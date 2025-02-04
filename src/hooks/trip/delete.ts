import { supabase } from "@/src/lib/supabase";

export async function deleteTrip(id: string) {
  const { data } = await supabase
    .from("trips")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (data?.vehicle_id && data?.start_odometer) {
    await supabase
      .from("vehicles")
      .update({
        odometer: data.start_odometer,
      })
      .eq("id", data.vehicle_id);
  }

  return data;
}
