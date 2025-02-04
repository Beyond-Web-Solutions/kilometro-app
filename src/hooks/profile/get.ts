import { supabase } from "../../lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useProfile(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["profile", id],
    queryFn: () => getProfile(id!),
  });
}

export async function getProfile(id: string) {
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", id)
    .maybeSingle();

  return data;
}
