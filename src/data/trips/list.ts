import { supabase } from "@/src/lib/supabase";

export async function getTrips() {
  const { data: org } = await supabase.rpc("get_selected_organization");

  if (!org) {
    return null;
  }

  const { data } = await supabase.from("trips").select("*").limit(100);

  return data;
}
