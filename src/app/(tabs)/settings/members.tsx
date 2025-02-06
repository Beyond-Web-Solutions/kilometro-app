import { Container } from "@/src/components/_common/layout/container";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationMembers } from "@/src/hooks/org-members/list";
import { useOrganizationRole } from "@/src/hooks/org/role";
import { FlatList } from "react-native";
import { Avatar, Divider, List, useTheme } from "react-native-paper";
import { formatName } from "@/src/utils/format";
import { useTranslation } from "react-i18next";
import { useUser } from "@/src/hooks/auth/user";
import { MembersOptionsMenu } from "@/src/components/settings/members/members-options";

export default function OrganizationMembersPage() {
  const { data: user } = useUser();
  const { colors } = useTheme();
  const { data: role } = useOrganizationRole();
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.members",
  });

  const { data } = useQuery({
    enabled: role === "admin",
    queryKey: ["organizations", "members"],
    queryFn: getOrganizationMembers,
  });

  return (
    <Container>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <List.Item
            title={formatName(
              t("overview.unknown-member-name"),
              t("overview.yourself"),
              item?.profiles?.first_name,
              item?.profiles?.last_name,
              user?.id === item?.profiles?.user_id,
            )}
            description={item.profiles?.email}
            left={({ style }) => (
              <Avatar.Icon
                style={style}
                color={colors.surface}
                icon="account"
                size={32}
              />
            )}
            right={(props) => (
              <MembersOptionsMenu
                {...props}
                id={item.id}
                role={item.role}
                isSelf={user?.id === item?.profiles?.user_id}
              />
            )}
          />
        )}
      />
    </Container>
  );
}
