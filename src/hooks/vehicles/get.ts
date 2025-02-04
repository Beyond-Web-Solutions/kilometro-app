import { supabase } from "@/src/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useVehicle(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["vehicles", id],
    queryFn: async () => await getVehicle(id),
  });
}

export async function getVehicle(id?: string) {
  if (!id) return null;

  const { data } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}
