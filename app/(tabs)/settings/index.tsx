import { Container } from "@/components/_common/layout/container";
import { Divider } from "react-native-paper";
import { SettingsFooter } from "@/components/settings/footer/list";
import { ProfileSettings } from "@/components/settings/header";
import { GeneralSettings } from "@/components/settings/general/list";
import { ScrollView } from "react-native";
import { AppearanceSettings } from "@/components/settings/appearance/list";

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
