import { StopTripFormData } from "@/src/constants/definitions/trip/stop";
import { PolyUtil, SphericalUtil } from "node-geometry-library";
import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";
import { reverseGeocode } from "@/src/hooks/geo/reverse-geocode";
import { getAverage } from "@/src/utils/math";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/src/types/supabase";

type Point = { lat: number; lng: number };

export async function getDefaultValuesForStopTripForm(
  trip: Tables<"trips">,
  points: Point[],
  speed: number[],
): Promise<StopTripFormData> {
  const distance = SphericalUtil.computeLength(points);

  const { coords } = await getCurrentPositionAsync({
    accuracy: LocationAccuracy.BestForNavigation,
  });

  const geo = await reverseGeocode({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  const newOdometer = (trip.start_odometer + Math.trunc(distance)) / 1000;

  return {
    type: trip.is_private ? "private" : "business",

    start_odometer: trip.start_odometer / 1000,
    end_odometer: Math.round(newOdometer * 10) / 10,

    codec: "",
    distance,

    start_place_id: trip.start_place_id ?? "",
    start_address: trip.start_address ?? "",

    end_place_id: geo?.results[0]?.place_id ?? "",
    end_address: geo?.results[0]?.formatted_address ?? "",

    avg_speed: getAverage(speed) || 0,
    max_speed: Math.max(...speed) || 0,

    end_point: {
      latitude: coords.latitude,
      longitude: coords.longitude,
    },
  };
}

export async function handleOnStopTripSubmit(
  values: StopTripFormData,
  tripId: string,
  waypoints: Point[],
) {
  return supabase
    .from("trips")
    .update({
      codec: PolyUtil.encode(waypoints),
      avg_speed: values.avg_speed,
      max_speed: values.max_speed,

      distance: Math.trunc(values.distance * 1000),
      end_odometer: Math.trunc(values.end_odometer * 1000),

      start_address: values.start_address,
      start_place_id: values.start_place_id,

      end_address: values.end_address,
      end_place_id: values.end_place_id,

      end_point: {
        latitude: values.end_point.latitude,
        longitude: values.end_point.longitude,
      },

      ended_at: new Date().toISOString(),
      status: "done",
      is_private: values.type === "private",
    })
    .eq("id", tripId);
}
