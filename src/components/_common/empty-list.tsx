import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Icon, Text, useTheme } from "react-native-paper";

export function EmptyList() {
  const { t } = useTranslation("common", { keyPrefix: "empty-list" });
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Icon size={48} source="close-circle-outline" color={colors.error} />
      <View style={styles.content}>
        <Text variant="headlineLarge">{t("title")}</Text>
        <Text>{t("subtitle")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 32,
    alignItems: "center",
  },
  content: {
    marginTop: 8,
  },
});
