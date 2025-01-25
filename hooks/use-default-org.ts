import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useDefaultOrganization() {
  return useQuery({
    queryKey: ["default-organization"],
    queryFn: getOrganization,
  });
}

async function getOrganization() {
  const { data } = await supabase.from("organizations").select("*");

  return data;
}
