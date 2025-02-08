import { Platform } from "react-native";

export function getGoogleMapsApiKey() {
  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS;
  }

  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;
}
