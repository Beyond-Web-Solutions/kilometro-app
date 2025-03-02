import { Container } from "@/src/components/_common/layout/container";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { Redirect } from "expo-router";
import {
  fetchOrganizationMembers,
  organizationMembersSelector,
} from "@/src/store/features/organization-members.slice";
import { FlatList } from "react-native";
import { MemberListItem } from "@/src/components/settings/organization/list/item";
import { EmptyList } from "@/src/components/_common/empty-list";
import { Divider } from "react-native-paper";

export default function JoinRequests() {
  const org = useAppSelector((state) => state.organizations.selected);

  if (!org) {
    return <Redirect href="/onboard" />;
  }

  const dispatch = useAppDispatch();
  const isPending = useAppSelector(
    (state) => state.organization_members.isPending,
  );
  const members = useAppSelector(organizationMembersSelector.selectAll);

  return (
    <Container>
      <FlatList
        ListEmptyComponent={<EmptyList />}
        ItemSeparatorComponent={() => <Divider />}
        refreshing={isPending}
        onRefresh={() => dispatch(fetchOrganizationMembers(org))}
        data={members.filter(
          (member) => member.organization_id === org && !member.is_accepted,
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemberListItem item={item} />}
      />
    </Container>
  );
}
