import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { router, Tabs } from "expo-router";
import { BottomNavigation, Icon } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";

export default function TabsLayout() {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.replace("/(auth)/sign-in");
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state, insets, descriptors }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];

            return options.title;
          }}
        />
      )}
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
