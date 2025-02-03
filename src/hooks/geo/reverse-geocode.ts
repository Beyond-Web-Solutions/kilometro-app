import { getGoogleMapsApiKey } from "@/src/utils/maps";
import { LatLng } from "react-native-maps";
import { useMutation } from "@tanstack/react-query";

export function useReverseGeocode() {
  return useMutation({
    mutationKey: ["reverse-geocode"],
    mutationFn: reverseGeocode,
  });
}

export async function reverseGeocode(data: LatLng) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}&result_type=street_address&key=${getGoogleMapsApiKey()}`,
  );

  return (await response.json()) as google.maps.GeocoderResponse;
}
