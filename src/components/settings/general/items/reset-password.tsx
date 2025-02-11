import { useTranslation } from "react-i18next";
import { List } from "react-native-paper";
import { router } from "expo-router";

export function ResetPasswordSettings() {
  const { t } = useTranslation("settings", {
    keyPrefix: "auth.reset-password",
  });

  return (
    <List.Item
      title={t("list-item")}
      left={(props) => <List.Icon {...props} icon="lock" />}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      onPress={() => router.navigate("/(tabs)/settings/reset-password")}
    />
  );
}
