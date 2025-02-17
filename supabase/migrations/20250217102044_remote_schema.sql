alter table "public"."trips" add column "profile_id" uuid default auth.uid();

alter table "public"."trips" add constraint "trips_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."trips" validate constraint "trips_profile_id_fkey";


