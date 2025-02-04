import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { SwitchOrganizationSetting } from "@/src/components/settings/organization/list/switch-organization";
import { OrganizationMembersSettings } from "@/src/components/settings/organization/list/members";

export function OrganizationSettings() {
  const { t } = useTranslation("settings", { keyPrefix: "organization" });

  return (
    <List.Section>
      <List.Subheader>{t("title")}</List.Subheader>
      <SwitchOrganizationSetting />
      <OrganizationMembersSettings />
    </List.Section>
  );
}
