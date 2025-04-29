import { Text, Button } from "react-native-paper";
import { Container } from "@/components/common/container";
import { SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { t } = useTranslation("auth", { keyPrefix: "auth" });

  return (
    <SafeAreaView>
      <Container>
        <Text variant="titleLarge">{t("title")}</Text>
      </Container>
    </SafeAreaView>
  );
}
