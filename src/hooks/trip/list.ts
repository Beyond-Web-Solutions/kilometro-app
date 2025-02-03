import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
  });
}

async function getTrips() {
  const { data } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "done")
    .order("started_at", { ascending: false });

  return data;
}
