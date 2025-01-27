import { useQuery } from "@tanstack/react-query";
import { isBackgroundLocationAvailableAsync } from "expo-location";

export function useIsBackgroundLocationAvailable() {
  return useQuery({
    queryKey: ["permissions", "background-location"],
    queryFn: isBackgroundLocationAvailableAsync,
  });
}
