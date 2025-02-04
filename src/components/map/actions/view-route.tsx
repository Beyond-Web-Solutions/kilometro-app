import { FAB } from "react-native-paper";
import { useCurrentTrip } from "@/src/hooks/trip/current";
import { useMutation } from "@tanstack/react-query";
import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";
import { LatLng, Region } from "react-native-maps";

interface Props {
  callback: (region: Region) => void;
}

export function ViewRouteFab({ callback }: Props) {
  const { data: trip } = useCurrentTrip();

  const { isPending, mutate } = useMutation({
    onSuccess: ({ coords }) => {
      if (!trip) return;

      const start = trip.start_point as LatLng;

      const latDelta = Math.abs(start.latitude - coords.latitude) + 0.1;
      const lonDelta = Math.abs(start.longitude - coords.longitude) + 0.1;

      callback({
        latitude: (start.latitude + coords.latitude) / 2,
        longitude: (start.longitude + coords.longitude) / 2,
        latitudeDelta: latDelta,
        longitudeDelta: lonDelta,
      });
    },
    mutationFn: () =>
      getCurrentPositionAsync({
        accuracy: LocationAccuracy.BestForNavigation,
      }),
  });

  return (
    <FAB
      visible={!!trip}
      loading={isPending}
      disabled={isPending}
      size="small"
      icon="map-marker-distance"
      variant="secondary"
      onPress={() => mutate()}
    />
  );
}
