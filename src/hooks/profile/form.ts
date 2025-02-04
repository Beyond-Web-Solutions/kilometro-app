import { getUser } from "../auth/user";
import { supabase } from "../../lib/supabase";

export async function getUserProfileDefaultValues() {
  const user = await getUser();

  if (!user) {
    return {
      first_name: "",
      last_name: "",
    };
  }

  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
  };
}
