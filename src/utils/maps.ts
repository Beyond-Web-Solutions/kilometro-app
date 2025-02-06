import { Platform } from "react-native";

export function getGoogleMapsApiKey() {
  if (process.env.EAS_BUILD_PROFILE === "production") {
    if (Platform.OS === "ios") {
      return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS;
    }

    if (Platform.OS === "android") {
      return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;
    }
  }

  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
}
