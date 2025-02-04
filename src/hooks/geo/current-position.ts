import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";
import { useQuery } from "@tanstack/react-query";

export function useCurrentPosition() {
  return useQuery({
    queryKey: ["current-position"],
    queryFn: getCurrentPosition,
  });
}

async function getCurrentPosition() {
  return getCurrentPositionAsync({
    accuracy: LocationAccuracy.BestForNavigation,
  });
}
