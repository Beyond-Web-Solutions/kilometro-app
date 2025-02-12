import { FAB } from "react-native-paper";
import { Region } from "react-native-maps";
import { useAppSelector } from "@/src/store/hooks";
import { useCallback } from "react";
import {
  getCurrentPositionAsync,
  LocationAccuracy,
  useForegroundPermissions,
} from "expo-location";

interface Props {
  callback: (region: Region) => void;
}

export function CenterOnUserFab({ callback }: Props) {
  const location = useAppSelector((state) => state.current_trip.last_location);
  const [status, request] = useForegroundPermissions();

  const handleCenterOnUserPress = useCallback(async () => {
    if (!location) {
      const { coords } = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.BestForNavigation,
      });

      callback({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });

      return;
    }

    callback({
      latitude: location?.latitude,
      longitude: location?.longitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    });
  }, [location, callback, status]);

  if (!status?.granted) {
    return (
      <FAB size="small" icon="target" variant="secondary" onPress={request} />
    );
  }

  return (
    <FAB
      size="small"
      icon="target"
      variant="secondary"
      onPress={handleCenterOnUserPress}
    />
  );
}
