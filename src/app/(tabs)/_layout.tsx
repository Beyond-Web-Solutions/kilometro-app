import { Redirect, router, Tabs } from "expo-router";
import { Icon } from "react-native-paper";
import { TabBar } from "@/src/components/nav/tabs";
import { useTranslation } from "react-i18next";
import { BottomTabHeader } from "@/src/components/nav/bottom-tab-header";
import { useAppSelector } from "@/src/store/hooks";

export default function TabsLayout() {
  const { t } = useTranslation("common");

  const isPending = useAppSelector((state) => state.auth.isRolePending);
  const user = useAppSelector((state) => state.auth.user);
  const role = useAppSelector((state) => state.auth.role);
  const isAccepted = useAppSelector((state) => state.auth.isAccepted);
  const isAcceptedPending = useAppSelector(
    (state) => state.auth.isAcceptedPending,
  );

  if (!isAccepted && !isAcceptedPending) {
    return <Redirect href="/onboard/await-access" />;
  }

  if (!user) {
    return <Redirect href="/auth/sign-in" />;
  }

  if (!role && !isPending) {
    return <Redirect href="/onboard" />;
  }

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
            <Icon size={size} color={color} source="map-marker" />
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
