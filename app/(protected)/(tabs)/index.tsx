import { AppleMaps, GoogleMaps } from "expo-maps";
import { Platform } from "react-native";

export default function Index() {
  if (Platform.OS === "ios") {
    return (
      <AppleMaps.View
        properties={{ isTrafficEnabled: true, selectionEnabled: false }}
        style={{ flex: 1 }}
      />
    );
  }

  if (Platform.OS === "android") {
    return (
      <GoogleMaps.View
        properties={{
          isTrafficEnabled: true,
          selectionEnabled: false,
          isIndoorEnabled: false,
        }}
        style={{ flex: 1 }}
      />
    );
  }

  return null;
}
