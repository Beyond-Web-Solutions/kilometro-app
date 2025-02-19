import { useTranslation } from "react-i18next";
import { List } from "react-native-paper";
import { useForegroundPermissions } from "expo-location";
import { useCallback } from "react";
import { Linking } from "react-native";
import { useLocationPermissions } from "@/src/hooks/permissions/location";
import { LocationSettingsDialog } from "@/src/components/map/location-settings-dialog";

export function LocationSettings() {
  const { t } = useTranslation("settings", { keyPrefix: "general" });

  const { granted, request, hideDialog, showDialog } = useLocationPermissions();

  return (
    <>
      <List.Item
        title={t("location.title")}
        onPress={request}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
        right={(props) => (
          <List.Icon {...props} icon={granted ? "check" : "alert"} />
        )}
      />
      <LocationSettingsDialog visible={showDialog} hideDialog={hideDialog} />
    </>
  );
}
