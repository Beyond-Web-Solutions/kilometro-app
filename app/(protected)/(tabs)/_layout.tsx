import { Tabs } from "expo-router";
import { MainTabBar } from "@/components/nav/tab-bar";
import { Icon } from "react-native-paper";

export default function TabsLayout() {
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
