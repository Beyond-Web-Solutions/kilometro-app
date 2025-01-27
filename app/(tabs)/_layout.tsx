import { router, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { TabBar } from "@/components/nav/tabs";
import { useAuthState } from "@/hooks/use-auth-state";
import { useDefaultOrganization } from "@/hooks/use-default-org";
import { useEffect } from "react";
import { useOrganizations } from "@/hooks/use-organizations";
import { useTranslation } from "react-i18next";
import { useIsBackgroundLocationAvailable } from "@/hooks/use-is-background-location-available";

export default function TabsLayout() {
  useAuthState();

  const { t } = useTranslation("common");

  const {
    data: isBackgroundLocationAvailable,
    isFetchedAfterMount: isBackgroundLocationAvailbeFetched,
  } = useIsBackgroundLocationAvailable();

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

  // make sure the user has given location permissions
  useEffect(() => {
    if (!isBackgroundLocationAvailable && isBackgroundLocationAvailbeFetched) {
      return router.replace("/onboard/permissions");
    }
  }, [isBackgroundLocationAvailable, isBackgroundLocationAvailbeFetched]);

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        key="index"
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="car" />
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

      <Tabs.Screen
        key="settings"
        name="settings"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="cog" />
          ),
        }}
      />
    </Tabs>
  );
}
