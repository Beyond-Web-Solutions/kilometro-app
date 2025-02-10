import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { SwitchOrganizationSetting } from "@/src/components/settings/organization/list/switch-organization";
import { OrganizationMembersSettings } from "@/src/components/settings/organization/list/members";
import { ShowOrganizationJoinCode } from "@/src/components/settings/organization/code";
import { OrganizationJoinRequests } from "@/src/components/settings/organization/list/requests";
import { useAppSelector } from "@/src/store/hooks";

export function OrganizationSettings() {
  const { t } = useTranslation("settings", { keyPrefix: "organization" });

  const role = useAppSelector((state) => state.auth.role);
  return (
    <List.Section>
      <List.Subheader>{t("title")}</List.Subheader>
      <SwitchOrganizationSetting />
      <OrganizationMembersSettings />
      <ShowOrganizationJoinCode />
      {role === "admin" && <OrganizationJoinRequests />}
    </List.Section>
  );
}
