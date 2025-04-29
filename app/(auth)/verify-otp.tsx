import { StyleSheet } from "react-native";
import { Container } from "@/components/common/container";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export default function VerifyOtpScreen() {
  const { t } = useTranslation("auth", { keyPrefix: "verify-otp" });

  return (
    <Container style={styles.container}>
      <Text variant="headlineLarge">{t("title")}</Text>
      <Text>{t("description")}</Text>
      <VerifyOtpForm />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 64,
    flex: 1,
  },
});
