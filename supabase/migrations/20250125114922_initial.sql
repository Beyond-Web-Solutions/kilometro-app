create type "public"."organization_roles" as enum ('driver', 'admin');
create type "public"."trip_status" as enum ('done', 'ongoing');

CREATE TABLE IF NOT EXISTS "public"."organizations"
(
    "id"                 "uuid"                   DEFAULT "gen_random_uuid"() NOT NULL PRIMARY KEY,
    "name"               "text"                                               NOT NULL,
    "code"               "text"                                               NOT NULL UNIQUE,
    "email"              "text"                                               NOT NULL,
    "stripe_customer_id" "text"                                               NOT NULL,
    "created_at"         timestamp with time zone DEFAULT "now"()             NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."organization_members"
(
    "id"              "uuid"                        DEFAULT "gen_random_uuid"() NOT NULL PRIMARY KEY,
    "user_id"         "uuid",
    "organization_id" "uuid",
    "is_default"      "bool"               NOT NULL DEFAULT true,
    "role"            "organization_roles" not null default 'admin'::organization_roles,
    "created_at"      timestamp with time zone      DEFAULT "now"() NOT NULL,
    CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE CASCADE,
    CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."vehicles"
(
    "id"              "uuid"                   DEFAULT "gen_random_uuid"() NOT NULL PRIMARY KEY,
    "organization_id" "uuid",
    "name"            "text"                                               NOT NULL,
    "licence_plate"   "text"                                               NOT NULL,
    "odometer"        integer                  DEFAULT 0                   NOT NULL,
    "created_at"      timestamp with time zone DEFAULT "now"()             NOT NULL,
    CONSTRAINT "vehicles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."trips"
(
    "id"             "uuid"                                         DEFAULT "gen_random_uuid"() NOT NULL PRIMARY KEY,
    "vehicle_id"     "uuid",
    "user_id"        "uuid",
    "codec"          "text",
    "avg_speed"      real,
    "max_speed"      real,
    "distance"       integer,
    "start_odometer" integer                               NOT NULL,
    "end_odometer"   integer,
    "start_place_id" "text",
    "end_place_id"   "text",
    "is_private"     boolean                                        DEFAULT false,
    "started_at"     timestamp with time zone                       DEFAULT "now"(),
    "ended_at"       timestamp with time zone                       DEFAULT "now"(),
    "start_point"    json NOT NULL,
    "end_point"      json,
    "start_address"  "text",
    "end_address"    "text",
    "status"         "trip_status"                         not null default 'ongoing'::trip_status,
    CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id") ON DELETE SET NULL,
    CONSTRAINT "trips_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles" ("id") ON DELETE CASCADE
);

-- functions
create
    or replace function get_org_ids_for_user() returns setof uuid as
$$
SELECT org.id
FROM organizations org
         INNER JOIN organization_members member ON org.id = member.organization_id
WHERE member.user_id = auth.uid();
$$ stable language sql
   security definer;

create
    or replace function get_orgs_for_user() returns setof record as
$$
SELECT org
FROM organizations org
         INNER JOIN organization_members member ON org.id = member.organization_id
WHERE member.user_id = auth.uid();
$$ stable language sql
   security definer;

CREATE OR REPLACE FUNCTION public.get_default_org()
    RETURNS record
    LANGUAGE sql
    STABLE SECURITY DEFINER
AS
$$
SELECT org
FROM organizations org
         INNER JOIN organization_members member ON org.id = member.organization_id
WHERE member.user_id = auth.uid()
  AND member.is_default = true
LIMIT 1;
$$
;

--    RLS
ALTER TABLE "public"."organization_members"
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."organizations"
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."trips"
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."vehicles"
    ENABLE ROW LEVEL SECURITY;

create policy "Enable insert for authenticated users only"
    on "public"."organization_members"
    as permissive
    for insert
    to authenticated
    with check (true);


create policy "Enable insert for authenticated users only"
    on "public"."organizations"
    as permissive
    for insert
    to authenticated
    with check (true);


create policy "Enable read access for authenticated users only"
    on "public"."organizations"
    as permissive
    for select
    to authenticated
    using (true);

create policy "Enable read access for organization members"
    on "public"."vehicles"
    as permissive
    for select
    to authenticated
    using ((organization_id IN (SELECT get_org_ids_for_user() AS get_org_ids_for_user)));

create policy "Enable access for organization members"
    on "public"."trips"
    as PERMISSIVE
    for ALL
    to authenticated
    using (
    vehicle_id IN (SELECT id
                   FROM vehicles
                   WHERE organization_id IN (SELECT get_org_ids_for_user() AS get_org_ids_for_user))
    );



