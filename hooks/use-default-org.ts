import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/types/supabase";

export function useDefaultOrganization() {
  return useQuery({
    queryKey: ["default-organization", "orgs-for-user"],
    queryFn: getOrganization,
  });
}

async function getOrganization() {
  const { data } = await supabase.rpc("get_default_org");

  return data as Tables<"organizations">;
}
