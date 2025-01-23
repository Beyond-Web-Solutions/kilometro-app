import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { VerifyEmailOtpForm } from "@/components/auth/otp/email-otp-form";
import { useCallback } from "react";

export default function OTPPage() {
  const params = useLocalSearchParams<{ email: string }>();

  const { colors } = useTheme();
  const { t } = useTranslation("auth", { keyPrefix: "otp.sign-up" });

  if (!params.email) {
    return <View />;
  }

  const handleOnSuccess = useCallback(() => {
    router.replace("/(onboard)/permissions");
  }, []);

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
          <VerifyEmailOtpForm
            email={params.email}
            type="signup"
            onSuccess={handleOnSuccess}
          />
        </View>
        <Divider />
        <View style={[styles.form_container, styles.link_container]}>
          <Link href="/(auth)/sign-in" replace asChild>
            <Button>{t("links.back")}</Button>
          </Link>
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
