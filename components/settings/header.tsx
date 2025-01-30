import { Avatar, IconButton, List } from "react-native-paper";
import { useUser } from "@/hooks/auth/user";
import { useDefaultOrganization } from "@/hooks/org/default";
import { useState } from "react";
import { OrganizationSwitcher } from "@/components/settings/org-switcher";
import { AccountSettingsMenu } from "@/components/settings/account/menu";

export function ProfileSettings() {
  const { data: user } = useUser();
  const { data: organization } = useDefaultOrganization();

  const [isOrgSwitcherVisible, setIsOrgSwitcherVisible] = useState(false);

  return (
    <>
      <List.Item
        title={user?.email}
        description={organization?.name}
        right={({ style }) => <AccountSettingsMenu style={style} />}
        left={({ style }) => (
          <Avatar.Icon style={style} icon="account" size={48} />
        )}
      />
      <OrganizationSwitcher
        isVisible={isOrgSwitcherVisible}
        hideDialog={() => setIsOrgSwitcherVisible(false)}
      />
    </>
  );
}
