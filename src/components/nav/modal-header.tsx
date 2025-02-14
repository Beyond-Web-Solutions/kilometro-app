import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Appbar, Button } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";

export function ModalHeader({
  navigation,
  options,
  route,
}: NativeStackHeaderProps) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header mode="small" elevated>
      <Appbar.Action icon="close" onPress={() => navigation.goBack()} />
      <Appbar.Content title={title} />
      {!!options.headerRight && options.headerRight({})}
    </Appbar.Header>
  );
}
