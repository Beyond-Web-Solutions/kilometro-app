import { supabase } from "@/src/lib/supabase";
import { getDefaultOrganization } from "@/src/hooks/org/default";

export async function getOrganizationMembers() {
  const organization = await getDefaultOrganization();

  if (!organization) {
    return [];
  }

  const { data } = await supabase
    .from("organization_members")
    .select("*, profiles(*)")
    .eq("organization_id", organization.id);

  return data;
}
