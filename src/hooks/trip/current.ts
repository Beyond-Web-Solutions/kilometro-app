import { supabase } from "@/src/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useCurrentTrip() {
  return useQuery({
    queryKey: ["current-trip"],
    queryFn: getCurrentTrip,
  });
}

async function getCurrentTrip() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "ongoing")
    .maybeSingle();

  return data;
}
