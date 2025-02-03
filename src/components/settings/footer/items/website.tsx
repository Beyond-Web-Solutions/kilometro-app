import { ExternalPathString, Link } from "expo-router";
import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";

export function WebsiteLink() {
  const href = process.env.EXPO_PUBLIC_WEBSITE_URL;
  const { t } = useTranslation("settings", { keyPrefix: "footer" });

  if (!href) {
    return null;
  }

  return (
    <Link href={href as ExternalPathString} asChild>
      <List.Item
        title={t("app-website")}
        left={(props) => <List.Icon {...props} icon="web" />}
        right={(props) => <List.Icon {...props} icon="open-in-new" />}
      />
    </Link>
  );
}
