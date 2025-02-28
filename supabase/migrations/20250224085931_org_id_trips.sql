alter table "public"."trips" add column "organization_id" uuid not null;

alter table "public"."trips" add constraint "trips_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."trips" validate constraint "trips_organization_id_fkey";