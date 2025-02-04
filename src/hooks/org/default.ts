import { supabase } from "@/src/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/src/types/supabase";
import { getUser } from "@/src/hooks/auth/user";

export function useDefaultOrganization() {
  return useQuery({
    queryKey: ["organizations", "default"],
    queryFn: getDefaultOrganization,
  });
}

export async function getDefaultOrganization() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", user.user_metadata.organization_id)
    .maybeSingle();

  return data;
}
