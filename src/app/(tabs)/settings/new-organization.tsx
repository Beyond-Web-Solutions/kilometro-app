import { Container } from "@/src/components/_common/layout/container";
import { Divider } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { CreateOrganizationDialog } from "@/src/components/settings/organization/create/dialog";
import { JoinOrganizationDialog } from "@/src/components/settings/organization/join/dialog";
import { router } from "expo-router";

export default function NewOrganizationScreen() {
  return (
    <Container>
      <View style={styles.container}>
        <CreateOrganizationDialog onSuccess={() => router.back()} />
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
