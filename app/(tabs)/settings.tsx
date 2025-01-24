import { Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native";
import { SignOutButton } from "@/components/auth/sign-out";
import { Link } from "expo-router";

export default function SettingsPage() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <SignOutButton />
      <Link href="/_sitemap">
        <Button>Sitemap</Button>
      </Link>
    </SafeAreaView>
  );
}
