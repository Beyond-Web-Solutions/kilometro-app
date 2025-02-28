import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ExternalPathString, Link } from "expo-router";

export function SupportLink() {
  const href = process.env.EXPO_PUBLIC_SUPPORT_URL;

  const { t } = useTranslation("settings", { keyPrefix: "footer" });

  if (!href) {
    return null;
  }

  return (
    <Link href={href as ExternalPathString} asChild>
      <List.Item
        title={t("support")}
        left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
        right={(props) => <List.Icon {...props} icon="open-in-new" />}
      />
    </Link>
  );
}
