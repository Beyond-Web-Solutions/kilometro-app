import { useTranslation } from "react-i18next";
import { Redirect } from "expo-router";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { CreateOrganizationDialog } from "@/src/components/settings/organization/create/dialog";
import { JoinOrganizationDialog } from "@/src/components/settings/organization/join/dialog";
import { StyleSheet, View } from "react-native";
import { useAppSelector } from "@/src/store/hooks";
import { organizationsSelector } from "@/src/store/features/organization.slice";
import { Button, Divider } from "react-native-paper";
import { OrganizationSwitcher } from "@/src/components/settings/org-switcher";
import { useState } from "react";

export default function CreateOrJoinOrganizationScreen() {
  const { t } = useTranslation("onboard", { keyPrefix: "create-or-join" });

  const isPending = useAppSelector((state) => state.auth.isRolePending);
  const role = useAppSelector((state) => state.auth.role);
  const orgCount = useAppSelector(organizationsSelector.selectTotal);

  const [isSwitcherVisible, setIsSwitcherVisible] = useState(false);

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
        {orgCount > 0 && (
          <>
            <Button mode="contained" onPress={() => setIsSwitcherVisible(true)}>
              {t("select")}
            </Button>
            <OrganizationSwitcher
              isVisible={isSwitcherVisible}
              hideDialog={() => setIsSwitcherVisible(false)}
              showCreateNew={false}
            />
            <Divider />
          </>
        )}
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
