import { Tables } from "@/src/types/supabase";
import { reverseGeocode } from "@/src/hooks/geo/reverse-geocode";
import { LatLng } from "react-native-maps";
import { supabase } from "@/src/lib/supabase";
import { store } from "@/src/store/store";
import { setTrip } from "@/src/store/features/current-trip.slice";
import { Trip } from "@/src/types/trips";

export async function updateTripStartLocation(
  trip: Tables<"trips">,
  start: LatLng,
) {
  if (trip.start_address) return;

  const response = await reverseGeocode(start);
  const result = response.results[0];

  if (result) {
    const { data, error } = await supabase
      .from("trips")
      .update({
        start_place_id: result.place_id,
        start_address: result.formatted_address,
        start_point: start,
      })
      .eq("id", trip.id)
      .select()
      .single();

    if (error) {
      console.error(error);
    }

    if (data) {
      store.dispatch(setTrip(data as Trip));
    }
  }
}
