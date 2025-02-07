import { useTranslation } from "react-i18next";
import { List } from "react-native-paper";
import {
  useBackgroundPermissions,
  useForegroundPermissions,
} from "expo-location";
import { useCallback } from "react";
import { Linking } from "react-native";

export function LocationSettings() {
  const { t } = useTranslation("settings", { keyPrefix: "general" });

  const [status, request] = useBackgroundPermissions();

  const handleOnPermissionClick = useCallback(async () => {
    if (status?.granted) return;

    if (status?.canAskAgain) {
      await request();
    } else {
      await Linking.openSettings();
    }
  }, [status, request]);

  return (
    <List.Item
      title={t("location.title")}
      onPress={handleOnPermissionClick}
      left={(props) => <List.Icon {...props} icon="map-marker" />}
      right={(props) => (
        <List.Icon {...props} icon={status?.granted ? "check" : "alert"} />
      )}
    />
  );
}
