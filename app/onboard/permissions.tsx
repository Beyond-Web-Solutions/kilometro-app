import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";
import { useTranslation } from "react-i18next";
import { Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useEffect } from "react";
import {
  useLocationsPermissions,
  useLocationsPermissionsMutation,
} from "@/hooks/use-locations-permissions";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { OnboardPermissionsDialog } from "@/components/onboard/permissions/dialog";

export default function OnboardingPermissionsScreen() {
  const queryClient = useQueryClient();

  const { t } = useTranslation("onboard", { keyPrefix: "permissions" });

  const { mutate, isPending, isSuccess } =
    useLocationsPermissionsMutation(queryClient);

  const { data: permissions, isFetched: isPermissionsFetched } =
    useLocationsPermissions();

  // redirect users to the home screen if they have already given permissions
  useEffect(() => {
    if (permissions?.granted && isPermissionsFetched) {
      return router.replace("/(tabs)");
    }
  }, [permissions, isPermissionsFetched]);

  return (
    <OnboardAndAuthLayout title={t("title")} description={t("description")}>
      <View style={styles.button_container}>
        {permissions?.canAskAgain ? (
          <Button
            mode="contained"
            disabled={isPending}
            loading={isPending}
            onPress={() => mutate()}
          >
            {t("buttons.give-permission")}
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
    marginTop: 16,
  },
});
