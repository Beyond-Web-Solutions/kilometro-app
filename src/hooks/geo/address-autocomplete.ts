import { getGoogleMapsApiKey } from "@/src/utils/maps";
import { useMutation } from "@tanstack/react-query";

export function useAddressAutocomplete() {
  return useMutation({
    mutationKey: ["address-autocomplete"],
    mutationFn: addressAutoComplete,
  });
}

export async function addressAutoComplete(q: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${q}&types=street_address&key=${getGoogleMapsApiKey()}`,
  );

  return (await response.json()) as google.maps.places.AutocompleteResponse;
}
