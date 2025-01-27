import {
  getBackgroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
} from "expo-location";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export function useLocationsPermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: getBackgroundPermissionsAsync,
  });
}

export function useLocationsPermissionsMutation(client: QueryClient) {
  return useMutation({
    mutationKey: ["permissions"],
    mutationFn: requestBackgroundPermissionsAsync,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}
