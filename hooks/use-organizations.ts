import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/types/supabase.ts";

export function useOrganizations() {
  return useQuery({
    queryKey: ["default-organization", "orgs-for-user"],
    queryFn: getOrganizations,
  });
}

async function getOrganizations() {
  const { data } = await supabase.rpc("get_orgs_for_user");

  return data as Tables<"organizations">[];
}
