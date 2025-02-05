import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { useEffect } from "react";
import { CreateOrganizationDialog } from "@/src/components/settings/organization/create/dialog";
import { JoinOrganizationDialog } from "@/src/components/settings/organization/join/dialog";
import { StyleSheet, View } from "react-native";
import { useOrganizationRole } from "@/src/hooks/org/role";

export default function CreateOrJoinOrganizationScreen() {
  const { t } = useTranslation("onboard", { keyPrefix: "create-or-join" });

  const { data: role, isFetched } = useOrganizationRole();

  useEffect(() => {
    if (isFetched && role) {
      return router.replace("/(tabs)");
    }
  }, [isFetched, role]);

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
