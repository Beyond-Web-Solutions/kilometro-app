import { IconButton, Menu } from "react-native-paper";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OrganizationSwitcher } from "@/src/components/settings/org-switcher";

interface Props {
  style?: any;
}

export function AccountSettingsMenu({ style }: Props) {
  const { t } = useTranslation("settings", {
    keyPrefix: "account-settings-menu",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isOrganizationSwitcherVisible, setIsOrganizationSwitcherVisible] =
    useState(false);

  return (
    <>
      <Menu
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        anchor={
          <IconButton
            icon="dots-vertical"
            style={style}
            onPress={() => setIsVisible(true)}
          />
        }
      >
        <Menu.Item
          leadingIcon="account"
          title={t("account")}
          onPress={() => {}}
        />
        <Menu.Item
          leadingIcon="office-building"
          title={t("organization")}
          onPress={() => {
            setIsOrganizationSwitcherVisible(true);
            setIsVisible(false);
          }}
        />
      </Menu>
      <OrganizationSwitcher
        isVisible={isOrganizationSwitcherVisible}
        hideDialog={() => setIsOrganizationSwitcherVisible(false)}
      />
    </>
  );
}
