import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useOrganizationIds() {
  return useQuery({
    queryKey: ["organizations", "ids"],
    queryFn: getOrganizationIds,
  });
}

export async function getOrganizationIds() {
  const { data } = await supabase.rpc("get_org_ids_for_user");

  return (data ?? []) as string[];
}
