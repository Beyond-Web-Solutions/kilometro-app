import { StartTripFormData } from "@/src/constants/definitions/trip/start";
import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";
import { reverseGeocode } from "@/src/hooks/geo/reverse-geocode";
import { supabase } from "@/src/lib/supabase";

export async function handleOnStartTripSubmit(values: StartTripFormData) {
  const { coords } = await getCurrentPositionAsync({
    accuracy: LocationAccuracy.BestForNavigation,
  });

  const geo = await reverseGeocode({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return supabase.from("trips").insert({
    user_id: user.id,
    vehicle_id: values.vehicle_id,
    start_odometer: Number(values.start_odometer) * 1000,
    start_point: {
      latitude: coords.latitude,
      longitude: coords.longitude,
    },
    start_place_id: geo?.results[0]?.place_id ?? null,
    start_address: geo?.results[0]?.formatted_address ?? null,
  });
}
