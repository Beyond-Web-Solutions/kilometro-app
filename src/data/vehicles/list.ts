import { supabase } from "@/src/lib/supabase";

export async function getVehicles() {
  const { data: org } = await supabase.rpc("get_selected_organization");

  if (!org) {
    return null;
  }

  const { data } = await supabase
    .from("vehicles")
    .select("*")
    .eq("organization_id", org.id)
    .limit(100);

  return data;
}
