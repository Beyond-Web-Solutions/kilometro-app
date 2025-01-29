import { Platform } from "react-native";

export function getGoogleMapsApiKey() {
  if (process.env.NODE_ENV === "production") {
    if (Platform.OS === "ios") {
      return process.env.GOOGLE_MAPS_API_KEY_IOS;
    }

    if (Platform.OS === "android") {
      return process.env.GOOGLE_MAPS_API_KEY_ANDROID;
    }
  }

  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
}
