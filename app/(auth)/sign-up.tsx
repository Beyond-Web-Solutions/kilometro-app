import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { SignUpForm } from "@/components/auth/sign-up/form";

export default function SignUpPage() {
  const { colors } = useTheme();
  const { t } = useTranslation("auth", { keyPrefix: "sign-up" });

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
          <SignUpForm />
        </View>
        <Divider />
        <View style={[styles.form_container, styles.link_container]}>
          <Link href="/(auth)/sign-in" replace asChild>
            <Button>{t("links.already-account")}</Button>
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
