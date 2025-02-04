import { List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { OrganizationSwitcher } from "@/src/components/settings/org-switcher";

export function OrganizationSettings() {
  const { t } = useTranslation("settings", {
    keyPrefix: "general.organization",
  });

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <List.Item
        title={t("title")}
        onPress={() => setIsVisible(true)}
        left={(props) => <List.Icon {...props} icon="office-building" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      />
      <OrganizationSwitcher
        isVisible={isVisible}
        hideDialog={() => setIsVisible(false)}
      />
    </>
  );
}
