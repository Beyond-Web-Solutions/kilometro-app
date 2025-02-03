import { supabase } from "@/src/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/src/types/supabase";

export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });
}

async function getOrganizations() {
  const { data } = await supabase.rpc("get_orgs_for_user");

  return (data ?? []) as Tables<"organizations">[];
}
