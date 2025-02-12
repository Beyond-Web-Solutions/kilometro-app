import { useTranslation } from "react-i18next";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { Button } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { StyleSheet, View } from "react-native";
import { fetchIsAccepted } from "@/src/store/features/auth.slice";
import { Redirect, router } from "expo-router";
import { useCallback } from "react";
import { useSignOut } from "@/src/hooks/auth/sign-out";

export default function AwaitAccessPage() {
  const { t } = useTranslation("onboard", { keyPrefix: "await-access" });

  const dispatch = useAppDispatch();
  const isAccepted = useAppSelector((state) => state.auth.isAccepted);
  const role = useAppSelector((state) => state.auth.role);

  const handleSignOutSuccess = useCallback(() => {
    router.replace("/auth/sign-in");
  }, []);

  const { mutate, isPending } = useSignOut(handleSignOutSuccess);

  if (isAccepted) {
    return <Redirect href="/(tabs)" />;
  }

  if (!role) {
    return <Redirect href="/onboard" />;
  }

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      links={[
        {
          label: t("links.back"),
          onPress: () => mutate(),
          loading: isPending,
          disabled: isPending,
        },
      ]}
      showDivider
    >
      <View style={styles.content}>
        <Button
          icon="reload"
          mode="contained"
          onPress={() => dispatch(fetchIsAccepted())}
        >
          {t("refetch")}
        </Button>
      </View>
    </OnboardAndAuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    marginVertical: 16,
  },
});
