import { useTranslation } from "react-i18next";
import { Redirect, router } from "expo-router";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { useEffect } from "react";
import { CreateOrganizationDialog } from "@/src/components/settings/organization/create/dialog";
import { JoinOrganizationDialog } from "@/src/components/settings/organization/join/dialog";
import { StyleSheet, View } from "react-native";
import { useOrganizationRole } from "@/src/hooks/org/role";
import { useAppSelector } from "@/src/store/hooks";

export default function CreateOrJoinOrganizationScreen() {
  const { t } = useTranslation("onboard", { keyPrefix: "create-or-join" });

  const isPending = useAppSelector((state) => state.auth.isRolePending);
  const role = useAppSelector((state) => state.auth.role);

  if (!isPending && role) {
    return <Redirect href="/(tabs)" />;
  }

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
