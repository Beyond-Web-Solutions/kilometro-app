import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { BottomNavigation } from "react-native-paper";
import { useMemo } from "react";

interface Props extends BottomTabBarProps {
  role: "admin" | "driver";
}

export function TabBar({
  state,
  insets,
  descriptors,
  navigation,
  role,
}: Props) {
  const routes = useMemo(
    () =>
      state.routes.filter((route) => {
        if (role === "driver") {
          return route.name !== "vehicles";
        }
        return route;
      }),
    [state.routes],
  );

  return (
    <BottomNavigation.Bar
      navigationState={{
        routes: routes,
        index: state.index,
      }}
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
  );
}
