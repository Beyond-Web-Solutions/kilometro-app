import { router, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { TabBar } from "@/components/nav/tabs";
import { useAuthState } from "@/hooks/use-auth-state";
import { useDefaultOrganization } from "@/hooks/use-default-org.ts";
import { useEffect } from "react";
import { useOrganizations } from "@/hooks/use-organizations.ts";

export default function TabsLayout() {
  useAuthState();

  const { isFetched: isDefaultOrganizationFetched, data: defaultOrganization } =
    useDefaultOrganization();

  const { isFetched: isOrganizationsFetched, data: organizations } =
    useOrganizations();

  // ensure a user has an organization before they can use the app
  useEffect(() => {
    if (isDefaultOrganizationFetched && isOrganizationsFetched) {
      if (!defaultOrganization && organizations?.length === 0) {
        return router.replace("/onboard");
      }
    }
  }, [
    isDefaultOrganizationFetched,
    defaultOrganization,
    organizations,
    isOrganizationsFetched,
  ]);

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        key="index"
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="home" />
          ),
        }}
      />

      <Tabs.Screen
        key="trips"
        name="trips"
        options={{
          title: "Ritten",
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="history" />
          ),
        }}
      />

      <Tabs.Screen
        key="settings"
        name="settings"
        options={{
          title: "Instellingen",
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="cog" />
          ),
        }}
      />
    </Tabs>
  );
}
