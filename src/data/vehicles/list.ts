import { supabase } from "@/src/lib/supabase";

export async function getVehicles(organizationId: string) {
  const { data } = await supabase
    .from("vehicles")
    .select("*")
    .eq("organization_id", organizationId);

  return data;
}
