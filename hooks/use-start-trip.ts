import { supabase } from "@/lib/supabase";
import { StartTripFormData } from "@/constants/definitions/trip/start";
import { useMutation } from "@tanstack/react-query";
import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "@/constants/strings";
import { LocationActivityType } from "expo-location";
import { useCurrentTripStore } from "@/store/current-trip";

export function useStartTripMutation(onSuccess: () => void) {
  return useMutation({
    mutationKey: ["start-trip"],
    mutationFn: startTrip,
    onSuccess: async () => {
      onSuccess();

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        activityType: LocationActivityType.AutomotiveNavigation,
        showsBackgroundLocationIndicator: true,
        accuracy: Location.Accuracy.BestForNavigation,
      });
    },
  });
}

async function startTrip(values: StartTripFormData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      vehicle_id: values.vehicle_id,
      start_odometer: values.start_odometer,
      start_point: `POINT(${values.start_point.longitude} ${values.start_point.latitude})`,
    })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to start trip");
  }

  if (data) {
    const store = useCurrentTripStore.getState();

    store.startTrip(data.id, values.vehicle_id);
  }
}
