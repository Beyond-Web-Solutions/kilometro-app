import { Avatar, IconButton, List } from "react-native-paper";
import { useUser } from "@/hooks/auth/user";
import { useDefaultOrganization } from "@/hooks/org/default";
import { useState } from "react";
import { OrganizationSwitcher } from "@/components/settings/org-switcher";

export function ProfileSettings() {
  const { data: user } = useUser();
  const { data: organization } = useDefaultOrganization();

  const [isOrgSwitcherVisible, setIsOrgSwitcherVisible] = useState(false);

  return (
    <>
      <List.Item
        title={user?.email}
        description={organization?.name}
        left={({ style }) => (
          <Avatar.Icon style={style} icon="account" size={48} />
        )}
        right={({ style }) => (
          <IconButton
            style={style}
            icon="dots-vertical"
            onPress={() => setIsOrgSwitcherVisible(true)}
          />
        )}
      />
      <OrganizationSwitcher
        isVisible={isOrgSwitcherVisible}
        hideDialog={() => setIsOrgSwitcherVisible(false)}
      />
    </>
  );
}
