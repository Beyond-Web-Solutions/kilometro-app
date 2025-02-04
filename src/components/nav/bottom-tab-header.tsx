import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { getHeaderTitle } from "@react-navigation/elements";
import { Appbar } from "react-native-paper";

export function BottomTabHeader({
  route,
  options,
  layout,
  navigation,
}: BottomTabHeaderProps) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header elevated>
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
