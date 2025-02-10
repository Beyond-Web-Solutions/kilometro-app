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
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchOrganizationMembers,
  organizationMembersSelector,
} from "@/src/store/features/organization-members.slice";
import { Redirect } from "expo-router";
import { EmptyList } from "@/src/components/_common/empty-list";

export default function OrganizationMembersPage() {
  const { colors } = useTheme();
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.members",
  });

  const dispatch = useAppDispatch();
  const members = useAppSelector(organizationMembersSelector.selectAll);
  const organization = useAppSelector((state) => state.organizations.selected);
  const user = useAppSelector((state) => state.auth.user);
  const isPending = useAppSelector(
    (state) => state.organization_members.isPending,
  );

  if (!organization) {
    return <Redirect href="/(tabs)/settings" />;
  }

  return (
    <Container>
      <FlatList
        data={members.filter(
          (member) =>
            member.organization_id === organization && member.is_accepted,
        )}
        onRefresh={() => dispatch(fetchOrganizationMembers(organization))}
        refreshing={isPending}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={<EmptyList />}
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
