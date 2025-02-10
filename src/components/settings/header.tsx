import { Avatar, List } from "react-native-paper";
import { useAppSelector } from "@/src/store/hooks";
import { organizationsSelector } from "@/src/store/features/organization.slice";
import { Redirect } from "expo-router";
import { formatUsername } from "@/src/utils/format";
import { useTranslation } from "react-i18next";

export function ProfileSettings() {
  const { t } = useTranslation("trips", { keyPrefix: "details" });
  const selected = useAppSelector((state) => state.organizations.selected);

  if (!selected) {
    return <Redirect href="/onboard" />;
  }

  const profile = useAppSelector((state) => state.auth.profile);
  const organization = useAppSelector((state) =>
    organizationsSelector.selectById(state, selected),
  );

  return (
    <List.Item
      title={formatUsername(
        t("unknown-user"),
        profile?.first_name ?? null,
        profile?.last_name ?? null,
        profile?.email ?? null,
      )}
      description={organization?.name}
      left={({ style }) => (
        <Avatar.Icon style={style} icon="account" size={48} />
      )}
      // right={(props) => <IconButton {...props} icon="qrcode-scan" />}
    />
  );
}
