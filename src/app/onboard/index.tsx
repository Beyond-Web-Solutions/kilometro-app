import { useTranslation } from "react-i18next";
import { Redirect } from "expo-router";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { CreateOrganizationDialog } from "@/src/components/settings/organization/create/dialog";
import { JoinOrganizationDialog } from "@/src/components/settings/organization/join/dialog";
import { StyleSheet, View } from "react-native";
import { useAppSelector } from "@/src/store/hooks";
import { organizationsSelector } from "@/src/store/features/organization.slice";

export default function CreateOrJoinOrganizationScreen() {
  const { t } = useTranslation("onboard", { keyPrefix: "create-or-join" });

  const isPending = useAppSelector((state) => state.auth.isRolePending);
  const role = useAppSelector((state) => state.auth.role);
  const orgCount = useAppSelector(organizationsSelector.selectTotal);

  if (!isPending && role) {
    return <Redirect href="/(tabs)" />;
  }

  if (orgCount > 0) {
    return <Redirect href="/onboard/switch-org" />;
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
