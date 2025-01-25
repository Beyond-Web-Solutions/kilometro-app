import { FAB, Portal } from "react-native-paper";
import { useCallback, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { usePathname } from "expo-router";
import {
  useBackgroundPermissions,
  useForegroundPermissions,
} from "expo-location";

export function StartTripFab() {
  const [foregroundPermissions] = useForegroundPermissions({
    request: true,
  });
  const [backgroundPermissions] = useBackgroundPermissions({
    request: true,
  });

  return (
    <FAB
      icon="car"
      label="Start rit"
      disabled={
        foregroundPermissions?.granted && backgroundPermissions?.granted
      }
    />
  );
}
