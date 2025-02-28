import { supabase } from "@/src/lib/supabase";

export async function getTrips(organizationId: string) {
  const { data } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "done")
    .eq("organization_id", organizationId)
    .order("started_at", { ascending: false });

  return data;
}
