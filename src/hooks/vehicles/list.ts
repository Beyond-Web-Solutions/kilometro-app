import { supabase } from "@/src/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });
}

async function getVehicles() {
  const { data } = await supabase.from("vehicles").select("*");

  return data;
}
