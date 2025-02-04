import { Avatar, IconButton, List } from "react-native-paper";
import { useUser } from "@/src/hooks/auth/user";
import { useDefaultOrganization } from "@/src/hooks/org/default";
import { AccountSettingsMenu } from "@/src/components/settings/account/menu";

export function ProfileSettings() {
  const { data: user } = useUser();
  const { data: organization } = useDefaultOrganization();

  return (
    <List.Item
      title={user?.email}
      description={organization?.name}
      right={(props) => <IconButton {...props} icon="qrcode-scan" />}
      left={({ style }) => (
        <Avatar.Icon style={style} icon="account" size={48} />
      )}
    />
  );
}
