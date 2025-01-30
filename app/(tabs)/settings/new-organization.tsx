import { Container } from "@/components/_common/layout/container";
import { Button, Divider } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { CreateOrganizationDialog } from "@/components/settings/organization/create/dialog";
import { JoinOrganizationDialog } from "@/components/settings/organization/join/dialog";

export default function NewOrganizationScreen() {
  return (
    <Container>
      <View style={styles.container}>
        <CreateOrganizationDialog />
        <Divider />
        <JoinOrganizationDialog />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
});
