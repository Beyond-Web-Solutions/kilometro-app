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

  useEffect(() => {
    if (!role) {
      router.push("/onboard");
    }
  }, [role]);

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
          tabBarIcon: ({ color, size }) => (
            <Icon size={size} color={color} source="cog" />
          ),
        }}
      />
    </Tabs>
  );
}
