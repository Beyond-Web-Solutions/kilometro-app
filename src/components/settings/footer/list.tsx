import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { nativeApplicationVersion } from "expo-application";
import { WebsiteLink } from "@/src/components/settings/footer/items/website";
import { TermsLink } from "@/src/components/settings/footer/items/terms";
import { PrivacyLink } from "@/src/components/settings/footer/items/privacy";
import { SignOutButton } from "@/src/components/settings/footer/items/sign-out";

export function SettingsFooter() {
  const { t } = useTranslation("settings", { keyPrefix: "footer" });

  return (
    <List.Section>
      <SignOutButton />
      <List.Item
        title={t("support")}
        left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
      />
      <WebsiteLink />
      <TermsLink />
      <PrivacyLink />
      <List.Item
        title={t("app-version")}
        description={nativeApplicationVersion}
        left={(props) => <List.Icon {...props} icon="information-outline" />}
      />
    </List.Section>
  );
}
