import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { LocationSettings } from "@/src/components/settings/general/items/location";
import { AccountSettings } from "@/src/components/settings/general/items/account";

export function GeneralSettings() {
  const { t } = useTranslation("settings", { keyPrefix: "general" });

  return (
    <List.Section>
      <List.Subheader>{t("title")}</List.Subheader>
      <AccountSettings />
      <LocationSettings />
    </List.Section>
  );
}
