import { Button, Text, TextInput } from "react-native-paper";
import { Container } from "@/components/common/container";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthForm } from "@/components/auth/form";

export default function LoginScreen() {
  const { t } = useTranslation("auth", { keyPrefix: "auth" });

  return (
    <SafeAreaView>
      <Container style={styles.container}>
        <Text variant="headlineLarge">{t("title")}</Text>
        <Text>{t("description")}</Text>
        <AuthForm />
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 64,
  },
});
