import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Redirect, router } from "expo-router";
import { useAppSelector } from "@/src/store/hooks";

export function OrganizationJoinRequests() {
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.join-requests",
  });
  const role = useAppSelector((state) => state.auth.role);

  if (role !== "admin") {
    return <Redirect href="/(tabs)/settings" />;
  }

  return (
    <List.Item
      title={t("requests")}
      left={(props) => <List.Icon {...props} icon="account-multiple-plus" />}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      onPress={() => router.navigate("/(tabs)/settings/join-requests")}
    />
  );
}
