import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { DarkModeSettings } from "@/components/settings/appearance/items/dark-mode";
import { LanguageSettings } from "@/components/settings/appearance/items/language";

export function AppearanceSettings() {
  const { t } = useTranslation("settings", { keyPrefix: "appearance" });

  return (
    <List.Section>
      <List.Subheader>{t("title")}</List.Subheader>
      <DarkModeSettings />
      <LanguageSettings />
    </List.Section>
  );
}
