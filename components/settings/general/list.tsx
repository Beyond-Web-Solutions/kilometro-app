import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { LocationSettings } from "@/components/settings/general/items/location";

export function GeneralSettings() {
  const { t } = useTranslation("settings", { keyPrefix: "general" });

  return (
    <List.Section>
      <List.Subheader>{t("title")}</List.Subheader>
      <LocationSettings />
    </List.Section>
  );
}
