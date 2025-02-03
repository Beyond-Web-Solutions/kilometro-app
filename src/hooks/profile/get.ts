import { supabase } from "../../lib/supabase";

export async function getProfile(id: string) {
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", id)
    .maybeSingle();

  return data;
}
