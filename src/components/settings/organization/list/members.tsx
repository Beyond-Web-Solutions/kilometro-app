import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

export function OrganizationMembersSettings() {
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.members",
  });

  return (
    <List.Item
      title={t("title")}
      left={(props) => <List.Icon {...props} icon="account-supervisor" />}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      onPress={() => router.navigate("/settings/members")}
    />
  );
}
