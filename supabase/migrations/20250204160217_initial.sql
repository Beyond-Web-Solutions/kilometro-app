create extension if not exists "wrappers" with schema "extensions";

CREATE TYPE "public"."organization_roles" AS ENUM (
    'driver',
    'admin'
    );

CREATE TYPE "public"."trip_status" AS ENUM (
    'done',
    'ongoing'
    );

CREATE TABLE IF NOT EXISTS "public"."profiles"
(
    "user_id"    "uuid"                                   NOT NULL PRIMARY KEY,
    "first_name" "text",
    "last_name"  "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email"      "text",

    CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."organizations"
(
    "id"                 "uuid"                   DEFAULT "gen_random_uuid"() NOT NULL PRIMARY KEY,
    "name"               "text"                                               NOT NULL,
    "code"               "text"                                               NOT NULL UNIQUE,
    "email"              "text"                                               NOT NULL,
    "stripe_customer_id" "text",
    "created_at"         timestamp with time zone DEFAULT "now"()             NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."organization_members"
(
    "id"              "uuid"                        DEFAULT "gen_random_uuid"()                    NOT NULL PRIMARY KEY,
    "user_id"         "uuid"                                                                       NOT NULL,
    "organization_id" "uuid"                                                                       NOT NULL,
    "profile_id"      "uuid"                                                                       NOT NULL,
    "role"            "public"."organization_roles" DEFAULT 'admin'::"public"."organization_roles" NOT NULL,
    "created_at"      timestamp with time zone      DEFAULT "now"()                                NOT NULL,

    CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations" ("id") ON DELETE CASCADE,
    CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE,
    CONSTRAINT "organization_members_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("user_id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "public"."vehicles"
(
    "id"              "uuid"                   DEFAULT "gen_random_uuid"() NOT NULL PRIMARY KEY,
    "organization_id" "uuid",
    "name"            "text"                                               NOT NULL,
    "licence_plate"   "text"                                               NOT NULL,
    "odometer"        integer                  DEFAULT 0                   NOT NULL,
    "created_at"      timestamp with time zone DEFAULT "now"()             NOT NULL,
    "year"            smallint,
    "model"           "text",
    "brand"           "text",

    CONSTRAINT "vehicles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."trips"
(
    "id"             "uuid"                   DEFAULT "gen_random_uuid"()               NOT NULL PRIMARY KEY,
    "vehicle_id"     "uuid",
    "user_id"        "uuid",
    "codec"          "text",
    "avg_speed"      real,
    "max_speed"      real,
    "distance"       integer,
    "start_odometer" integer                                                            NOT NULL,
    "end_odometer"   integer,
    "start_place_id" "text",
    "end_place_id"   "text",
    "is_private"     boolean                  DEFAULT false,
    "started_at"     timestamp with time zone DEFAULT "now"(),
    "ended_at"       timestamp with time zone DEFAULT "now"(),
    "start_point"    "json"                                                             NOT NULL,
    "end_point"      "json",
    "start_address"  "text",
    "end_address"    "text",
    "status"         "public"."trip_status"   DEFAULT 'ongoing'::"public"."trip_status" NOT NULL,

    CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE SET NULL,
    CONSTRAINT "trips_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles" ("id") ON DELETE SET NULL
);

ALTER TABLE "public"."organization_members"
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."organizations"
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles"
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."trips"
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."vehicles"
    ENABLE ROW LEVEL SECURITY;

CREATE
    OR REPLACE FUNCTION "public"."create_stripe_customer"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SECURITY DEFINER
AS
$$
DECLARE
    customer_id TEXT;
BEGIN
    -- Insert into stripe_customers table
    INSERT INTO stripe_customers(email, name)
    VALUES (NEW.email, NEW.name);

-- Get the id of the newly inserted stripe customer
    SELECT id
    INTO customer_id
    FROM stripe_customers
    WHERE email = NEW.email
    ORDER BY created DESC
    LIMIT 1;

-- Update the organizations table with the correct stripe_customer_id
    UPDATE organizations
    SET stripe_customer_id = customer_id -- Use the variable here
    WHERE id = NEW.id; -- NEW.id refers to the organization id, which is correct

    RETURN NEW;
END;
$$;

CREATE
    OR REPLACE FUNCTION "public"."get_org_ids_for_user"() RETURNS SETOF "uuid"
    LANGUAGE "sql"
    STABLE SECURITY DEFINER
AS
$$
SELECT org.id
FROM organizations org
         INNER JOIN organization_members member ON org.id = member.organization_id
WHERE member.user_id = auth.uid();
$$;

CREATE
    OR REPLACE FUNCTION "public"."get_orgs_for_user"() RETURNS SETOF "record"
    LANGUAGE "sql"
    STABLE SECURITY DEFINER
AS
$$
SELECT org
FROM organizations org
         INNER JOIN organization_members member ON org.id = member.organization_id
WHERE member.user_id = auth.uid();
$$;

CREATE
    OR REPLACE FUNCTION "public"."get_selected_organization"() RETURNS "text"
    LANGUAGE "plpgsql"
AS
$$
DECLARE
    user_role text;
BEGIN

    SELECT role
    FROM organization_members member
    WHERE member.user_id = auth.uid()
      AND (organization_id = (select auth.jwt() -> 'user_metadata' -> 'organization_id'));

    RETURN user_role;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
    RETURNS text
    LANGUAGE sql
    STABLE SECURITY DEFINER
AS
$function$
SELECT role
FROM organization_members member
WHERE member.user_id = auth.uid()
  AND member.organization_id = (SELECT (auth.jwt() -> 'user_metadata' ->> 'organization_id')::uuid)
LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path TO ''
AS
$function$
begin
    insert into public.profiles (user_id, email, first_name, last_name)
    values (new.id, new.email, new.raw_user_meta_data ->> 'first_name',
            new.raw_user_meta_data ->> 'last_name');
    return new;
end;
$function$
;

CREATE
    OR REPLACE TRIGGER "on_organizations_insert"
    AFTER INSERT
    ON "public"."organizations"
    FOR EACH ROW
EXECUTE FUNCTION "public"."create_stripe_customer"();

create trigger on_auth_user_created
    after insert
    on auth.users
    for each row
execute procedure public.handle_new_user();

CREATE
    POLICY "Allow update for all organization members" ON "public"."vehicles" FOR
    UPDATE TO "authenticated" USING (("organization_id" IN
                                      (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")))
    WITH CHECK (("organization_id" IN (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")));

CREATE
    POLICY "Enable admins to delete all trips" ON "public"."trips" FOR DELETE
    TO "authenticated" USING ((("vehicle_id" IN (SELECT "vehicles"."id"
                                                 FROM "public"."vehicles"
                                                 WHERE ("vehicles"."organization_id" IN
                                                        (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")))) AND
                               (SELECT ("public"."get_user_role"() = 'admin'::"text"))));

CREATE
    POLICY "Enable admins to update every trip" ON "public"."trips" FOR
    UPDATE TO "authenticated" USING ((((SELECT "public"."get_user_role"() AS "get_user_role") = 'admin'::"text") AND
                                      ("vehicle_id" IN (SELECT "vehicles"."id"
                                                        FROM "public"."vehicles"
                                                        WHERE ("vehicles"."organization_id" IN
                                                               (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user"))))))
    WITH CHECK (("vehicle_id" IN (SELECT "vehicles"."id"
                                  FROM "public"."vehicles"
                                  WHERE ("vehicles"."organization_id" IN
                                         (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")))));

CREATE
    POLICY "Enable admins to view their all trips" ON "public"."trips" FOR
    SELECT TO "authenticated" USING ((("vehicle_id" IN (SELECT "vehicles"."id"
                                                        FROM "public"."vehicles"
                                                        WHERE ("vehicles"."organization_id" IN
                                                               (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")))) AND
                                      (SELECT ("public"."get_user_role"() = 'admin'::"text"))));

CREATE
    POLICY "Enable delete for admins" ON "public"."organization_members" FOR DELETE
    TO "authenticated" USING ((((SELECT "public"."get_user_role"() AS "get_user_role") = 'admin'::"text") AND
                               ("organization_id" IN
                                (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user"))));

CREATE
    POLICY "Enable delete for admins only" ON "public"."vehicles" FOR DELETE
    TO "authenticated" USING ((
    ("organization_id" IN (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")) AND
    ((SELECT "public"."get_user_role"() AS "get_user_role") = 'admin'::"text")));

CREATE
    POLICY "Enable drivers to update their own trips" ON "public"."trips" FOR
    UPDATE TO "authenticated" USING ((("user_id" = "auth"."uid"()) AND
                                      (SELECT ("public"."get_user_role"() = 'driver'::"text"))))
    WITH CHECK (("user_id" = "auth"."uid"()));

CREATE
    POLICY "Enable drivers to view their own trips" ON "public"."trips" FOR
    SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) AND
                                      (SELECT ("public"."get_user_role"() = 'driver'::"text"))));

CREATE
    POLICY "Enable insert for authenticated users only" ON "public"."organization_members" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE
    POLICY "Enable insert for authenticated users only" ON "public"."organizations" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE
    POLICY "Enable insert for organization admins" ON "public"."vehicles" FOR INSERT TO "authenticated" WITH CHECK ((
    ("organization_id" IN (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")) AND
    ((SELECT "public"."get_user_role"() AS "get_user_role") = 'admin'::"text")));

CREATE
    POLICY "Enable insert for organization members" ON "public"."trips" FOR INSERT TO "authenticated" WITH CHECK ((
    "vehicle_id" IN (SELECT "vehicles"."id"
                     FROM "public"."vehicles"
                     WHERE ("vehicles"."organization_id" IN
                            (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")))));

CREATE
    POLICY "Enable read access for all users" ON "public"."profiles" FOR
    SELECT USING (true);

CREATE
    POLICY "Enable read access for authenticated users only" ON "public"."organizations" FOR
    SELECT TO "authenticated" USING (true);

CREATE
    POLICY "Enable read access for organization members" ON "public"."vehicles" FOR
    SELECT TO "authenticated" USING (("organization_id" IN
                                      (SELECT "public"."get_org_ids_for_user"() AS "get_org_ids_for_user")));

CREATE
    POLICY "Enable user to delete their own data only" ON "public"."profiles" FOR DELETE
    TO "authenticated" USING (((SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE
    POLICY "Enable users to insert their own data only" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (((SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE
    POLICY "Enable users to update their own data only" ON "public"."profiles" FOR
    UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"))
    WITH CHECK (("auth"."uid"() = "user_id"));

create policy "Enable admins to view all members"
    on "public"."organization_members"
    as permissive
    for select
    to authenticated
    using ((((SELECT get_user_role() AS get_user_role) = 'admin'::text) AND
            (organization_id IN (SELECT get_org_ids_for_user() AS get_org_ids_for_user))));


create policy "Enable update for admins"
    on "public"."organization_members"
    as permissive
    for update
    to authenticated
    using ((((SELECT get_user_role() AS get_user_role) = 'admin'::text) AND
            (organization_id IN (SELECT get_org_ids_for_user() AS get_org_ids_for_user))))
    with check ((((SELECT get_user_role() AS get_user_role) = 'admin'::text) AND
                 (organization_id IN (SELECT get_org_ids_for_user() AS get_org_ids_for_user))));


create policy "Enable users to view their own data only"
    on "public"."organization_members"
    as permissive
    for select
    to authenticated
    using (((SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on their id"
    on "public"."organization_members"
    as permissive
    for update
    to authenticated
    using (((SELECT auth.uid() AS uid) = user_id));