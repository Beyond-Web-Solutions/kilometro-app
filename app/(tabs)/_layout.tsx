import { router, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { TabBar } from "@/components/nav/tabs";
import { useAuthState } from "@/hooks/auth/auth-listener";
import { useDefaultOrganization } from "@/hooks/org/default";
import { useEffect } from "react";
import { useOrganizations } from "@/hooks/org/list";
import { useTranslation } from "react-i18next";
import { BottomTabHeader } from "@/components/nav/bottom-tab-header";
import { useOrganizationRole } from "@/hooks/org/role";

export default function TabsLayout() {
  useAuthState();

  const { t } = useTranslation("common");

  const { data: role } = useOrganizationRole();

  const {
    isFetchedAfterMount: isDefaultOrganizationFetched,
    data: defaultOrganization,
  } = useDefaultOrganization();

  const { isFetchedAfterMount: isOrganizationsFetched, data: organizations } =
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
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        header: (props) => <BottomTabHeader {...props} />,
      }}
      tabBar={(props) => <TabBar {...props} role={role ?? "driver"} />}
    >
      <Tabs.Screen
        key="index"
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="map" />
          ),
        }}
      />

      <Tabs.Screen
        key="trips"
        name="trips"
        options={{
          title: t("trips"),
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="history" />
          ),
        }}
      />

      {role === "admin" && (
        <Tabs.Screen
          key="vehicles"
          name="vehicles"
          options={{
            title: t("vehicles"),
            tabBarIcon: ({ color, size }) => (
              <Icon size={size} color={color} source="car" />
            ),
          }}
        />
      )}

      <Tabs.Screen
        key="settings"
        name="settings"
        options={{
          title: t("settings"),
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="cog" />
          ),
        }}
      />
    </Tabs>
  );
}
