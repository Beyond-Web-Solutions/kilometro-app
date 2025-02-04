import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { useDefaultOrganization } from "@/src/hooks/org/default";
import { useEffect } from "react";
import { CreateOrganizationDialog } from "@/src/components/settings/organization/create/dialog";
import { JoinOrganizationDialog } from "@/src/components/settings/organization/join/dialog";
import { StyleSheet, View } from "react-native";

export default function CreateOrJoinOrganizationScreen() {
  const { t } = useTranslation("onboard", { keyPrefix: "create-or-join" });

  const { isFetched, data } = useDefaultOrganization();

  useEffect(() => {
    if (isFetched && data) {
      return router.replace("/(tabs)");
    }
  }, [isFetched, data]);

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      showDivider={false}
    >
      <View style={styles.container}>
        <CreateOrganizationDialog />
        <JoinOrganizationDialog />
      </View>
    </OnboardAndAuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingTop: 16,
  },
});
