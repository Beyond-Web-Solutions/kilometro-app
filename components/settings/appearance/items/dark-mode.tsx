import { useTranslation } from "react-i18next";
import { List, Switch } from "react-native-paper";
import { useColorScheme, Appearance } from "react-native";

export function DarkModeSettings() {
  const { t } = useTranslation("settings", { keyPrefix: "appearance" });

  const scheme = useColorScheme();

  return (
    <List.Item
      title={t("theme.title")}
      left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
      right={({ style }) => (
        <Switch
          style={style}
          value={scheme === "dark"}
          onValueChange={(dark) =>
            Appearance.setColorScheme(dark ? "dark" : "light")
          }
        />
      )}
    />
  );
}
