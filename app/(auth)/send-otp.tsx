import { Text } from "react-native-paper";
import { Container } from "@/components/common/container";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { SendOtpForm } from "@/components/auth/send-otp-form";
import { Screen } from "@/components/common/screen";

export default function SignUpScreen() {
  const { t } = useTranslation("auth", { keyPrefix: "welcome" });

  return (
    <Screen>
      <Container style={styles.container}>
        <Text variant="headlineLarge">{t("title")}</Text>
        <Text>{t("description")}</Text>
        <SendOtpForm />
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 64,
  },
});
