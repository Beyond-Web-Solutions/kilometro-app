import { supabase } from "@/src/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useOrganizationRole() {
  return useQuery({
    queryKey: ["organizations", "role"],
    queryFn: getOrganizationRole,
  });
}

export async function getOrganizationRole() {
  const { data } = await supabase.rpc("get_user_role");

  return data as "admin" | "driver" | null | undefined;
}
