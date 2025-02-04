import { Container } from "@/src/components/_common/layout/container";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationMembers } from "@/src/hooks/org-members/list";
import { useOrganizationRole } from "@/src/hooks/org/role";
import { FlatList, View } from "react-native";
import {
  Avatar,
  Divider,
  IconButton,
  List,
  useTheme,
} from "react-native-paper";

export default function OrganizationMembersPage() {
  const { data: role } = useOrganizationRole();
  const { colors } = useTheme();

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
        renderItem={({ item }) => (
          <View>
            <List.Item
              title={item.profiles?.first_name + " " + item.profiles?.last_name}
              description={item.profiles?.email}
              left={({ style }) => (
                <Avatar.Icon
                  style={style}
                  color={colors.surface}
                  icon="account"
                  size={32}
                />
              )}
              right={({ color, style }) => (
                <IconButton
                  iconColor={color}
                  style={style}
                  icon="dots-vertical"
                />
              )}
            />
            <Divider />
          </View>
        )}
      />
    </Container>
  );
}
