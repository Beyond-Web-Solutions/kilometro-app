import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { useTranslation } from "react-i18next";
import { Button } from "react-native-paper";
import { OrganizationSwitcher } from "@/src/components/settings/org-switcher";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function SwitchOrganization() {
  const { t } = useTranslation("onboard", { keyPrefix: "switch-org" });

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <OnboardAndAuthLayout title={t("title")} description={t("description")}>
        <View style={styles.container}>
          <Button mode="contained" onPress={() => setIsVisible(true)}>
            {t("switch-button")}
          </Button>
        </View>
      </OnboardAndAuthLayout>
      <OrganizationSwitcher
        isVisible={isVisible}
        hideDialog={() => setIsVisible(false)}
        showCreateNew={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingTop: 16,
  },
});
