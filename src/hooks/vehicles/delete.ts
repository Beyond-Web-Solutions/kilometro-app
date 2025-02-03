import { supabase } from "@/src/lib/supabase";
import { useMutation } from "@tanstack/react-query";

export function useDeleteVehicle(onSuccess: () => Promise<void>) {
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess,
  });
}

async function deleteVehicle(id: string) {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
