import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import { CreatOrganizationForm } from "@/components/onboard/create-org/form";

export function EntryLayout() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_text} variant="headlineLarge">
            {t("title")}
          </Text>
          <Text style={styles.header_text}>{t("description")}</Text>
        </View>
        <View style={styles.form_container}>
          <CreatOrganizationForm />
        </View>
        <Divider />
        <View style={[styles.form_container, styles.link_container]}>
          <Button onPress={handleGoBack}>{t("links.back")}</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
  },
  form_container: {
    paddingHorizontal: 32,
  },
  link_container: {
    gap: 4,
    paddingVertical: 4,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 64,
    gap: 4,
  },
  header_text: {
    textAlign: "center",
  },
});
