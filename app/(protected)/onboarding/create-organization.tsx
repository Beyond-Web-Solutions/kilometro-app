import { Screen } from "@/components/common/screen";
import { Container } from "@/components/common/container";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";
import { CreateOrganizationForm } from "@/components/onboarding/create-org/form";
import { useContext } from "react";
import { AuthContext } from "@/components/auth/provider";
import { Redirect, useRouter } from "expo-router";
import { authClient } from "@/lib/auth/client";

export default function OnboardingScreen() {
  const router = useRouter();

  const { t } = useTranslation("onboarding", { keyPrefix: "create-org" });
  const { data } = authClient.useActiveOrganization();

  if (data) {
    return <Redirect href="/" />;
  }

  return (
    <Screen>
      <Container style={styles.container}>
        <Text style={styles.text} variant="headlineLarge">
          {t("title")}
        </Text>
        <Text style={styles.text}>{t("description")}</Text>
        <CreateOrganizationForm onSuccess={() => router.navigate("/")} />
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 64,
  },
  text: {
    textAlign: "center",
  },
});
