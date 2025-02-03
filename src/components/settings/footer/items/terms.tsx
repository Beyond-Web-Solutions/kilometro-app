import { ExternalPathString, Link } from "expo-router";
import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";

export function TermsLink() {
  const href = process.env.EXPO_PUBLIC_TERMS_URL;
  const { t } = useTranslation("settings", { keyPrefix: "footer" });

  if (!href) {
    return null;
  }

  return (
    <Link href={href as ExternalPathString} asChild>
      <List.Item
        title={t("app-terms")}
        left={(props) => <List.Icon {...props} icon="file-document-outline" />}
        right={(props) => <List.Icon {...props} icon="open-in-new" />}
      />
    </Link>
  );
}
