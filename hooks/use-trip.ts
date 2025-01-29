import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useTrip(id: string) {
  return useQuery({
    queryKey: [`trip:${id}`],
    queryFn: () => getTrip(id),
  });
}

export async function getTrip(id: string) {
  const { data } = await supabase
    .from("trips")
    .select("*, vehicles(*)")
    .eq("id", id)
    .eq("status", "done")
    .single();

  return data;
}
