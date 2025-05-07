import { Redirect, Tabs, usePathname } from "expo-router";
import { MainTabBar } from "@/components/nav/tab-bar";
import { Icon } from "react-native-paper";
import { useContext } from "react";
import { AuthContext } from "@/components/auth/provider";
import { useTranslation } from "react-i18next";
import { authClient } from "@/lib/auth/client";

export default function TabsLayout() {
  const { data } = authClient.useActiveOrganization();
  const { t } = useTranslation("common", { keyPrefix: "screens.tabs" });

  if (!data) {
    return <Redirect href="/onboarding/create-organization" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={MainTabBar}>
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: (props) => <Icon source="home" {...props} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: t("trips"),
          tabBarIcon: (props) => <Icon source="clock-outline" {...props} />,
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: t("vehicles"),
          tabBarIcon: (props) => <Icon source="car" {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: (props) => <Icon source="cog" {...props} />,
        }}
      />
    </Tabs>
  );
}
