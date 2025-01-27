import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useCallback } from "react";
import { Button } from "react-native-paper";
import {
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  useBackgroundPermissions,
} from "expo-location";
import { router } from "expo-router";
import { OnboardPermissionsDialog } from "@/components/onboard/permissions/dialog";
import { useQueryClient } from "@tanstack/react-query";

export default function OnboardingPermissionsScreen() {
  const queryClient = useQueryClient();

  const { t } = useTranslation("onboard", { keyPrefix: "permissions" });

  const [background] = useBackgroundPermissions();

  const requestPermissions = useCallback(async () => {
    const { status: foregroundStatus } =
      await requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
      const { status: backgroundStatus } =
        await requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        await queryClient.invalidateQueries({
          queryKey: ["permissions", "background-location"],
        });

        return router.replace("/(tabs)");
      }
    }
  }, []);

  return (
    <OnboardAndAuthLayout title={t("title")} description={t("description")}>
      <View style={styles.button_container}>
        {background?.canAskAgain ? (
          <Button mode="contained" onPress={requestPermissions}>
            {t("buttons.request-permissions")}
          </Button>
        ) : (
          <OnboardPermissionsDialog />
        )}
      </View>
    </OnboardAndAuthLayout>
  );
}

const styles = StyleSheet.create({
  button_container: {
    gap: 8,
    marginTop: 16,
  },
});
