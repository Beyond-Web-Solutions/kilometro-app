import { Container } from "@/src/components/_common/layout/container";
import { Divider } from "react-native-paper";
import { SettingsFooter } from "@/src/components/settings/footer/list";
import { ProfileSettings } from "@/src/components/settings/header";
import { GeneralSettings } from "@/src/components/settings/general/list";
import { ScrollView } from "react-native";
import { AppearanceSettings } from "@/src/components/settings/appearance/list";

export default function SettingsPage() {
  return (
    <Container>
      <ScrollView>
        <ProfileSettings />
        <Divider horizontalInset />
        <GeneralSettings />
        <Divider horizontalInset />
        <AppearanceSettings />
        <Divider horizontalInset />
        <SettingsFooter />
      </ScrollView>
    </Container>
  );
}
