import { Avatar, List } from "react-native-paper";
import { useUser } from "@/hooks/auth/user";
import { useDefaultOrganization } from "@/hooks/org/default";
import { AccountSettingsMenu } from "@/components/settings/account/menu";

export function ProfileSettings() {
  const { data: user } = useUser();
  const { data: organization } = useDefaultOrganization();

  return (
    <List.Item
      title={user?.email}
      description={organization?.name}
      right={({ style }) => <AccountSettingsMenu style={style} />}
      left={({ style }) => (
        <Avatar.Icon style={style} icon="account" size={48} />
      )}
    />
  );
}
