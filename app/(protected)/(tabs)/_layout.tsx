import { Redirect, Tabs, usePathname } from "expo-router";
import { MainTabBar } from "@/components/nav/tab-bar";
import { Icon } from "react-native-paper";
import { useContext } from "react";
import { AuthContext } from "@/components/auth/provider";

export default function TabsLayout() {
  const { organizationId } = useContext(AuthContext);

  if (!organizationId) {
    return <Redirect href="/onboarding/create-organization" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={MainTabBar}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: (props) => <Icon source="home" {...props} />,
        }}
      />
    </Tabs>
  );
}
