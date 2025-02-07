import { FAB } from "react-native-paper";
import { useCurrentTrip } from "@/src/hooks/trip/current";
import { useMutation } from "@tanstack/react-query";
import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";
import { LatLng, Region } from "react-native-maps";
import { useAppSelector } from "@/src/store/hooks";
import { useCallback } from "react";

interface Props {
  callback: (region: Region) => void;
}

export function ViewRouteFab({ callback }: Props) {
  const start = useAppSelector((state) => state.current_trip.first_location);
  const end = useAppSelector((state) => state.current_trip.last_location);

  const handleViewRoute = useCallback(() => {
    if (!start || !end) return;

    const latDelta = Math.abs(start.latitude - end.latitude) + 0.1;
    const lonDelta = Math.abs(start.longitude - end.longitude) + 0.1;

    callback({
      latitude: (start.latitude + end.latitude) / 2,
      longitude: (start.longitude + end.longitude) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    });
  }, [start, end, callback]);

  return (
    <FAB
      size="small"
      icon="map-marker-distance"
      variant="secondary"
      visible={!!start && !!end}
      onPress={handleViewRoute}
    />
  );
}
