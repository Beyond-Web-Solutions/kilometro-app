import { FAB } from "react-native-paper";
import { PermissionResponse } from "expo-location";

interface Props {
  permission: PermissionResponse | null;
}

export function StartTripFab({ permission }: Props) {
  return (
    <FAB
      icon="car"
      label="Start rit"
      onPress={() => {
        console.log("Start trip");
      }}
    />
  );
}
