import { Text, Button } from "react-native-paper";
import { Container } from "@/components/common/container";
import { SafeAreaView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { t } = useTranslation("auth", { keyPrefix: "auth" });

  return (
    <SafeAreaView>
      <Container style={styles.container}>
        <Text variant="headlineLarge">{t("title")}</Text>
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 72,
  },
});
