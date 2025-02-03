import { FAB } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";
import { Region } from "react-native-maps";

interface Props {
  callback: (region: Region) => void;
}

export function CenterOnUserFab({ callback }: Props) {
  const { isPending, mutate } = useMutation({
    onSuccess: ({ coords }) => {
      callback({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    },
    mutationFn: () =>
      getCurrentPositionAsync({
        accuracy: LocationAccuracy.BestForNavigation,
      }),
  });

  return (
    <FAB
      size="small"
      icon="target"
      variant="secondary"
      loading={isPending}
      disabled={isPending}
      onPress={() => mutate()}
    />
  );
}
