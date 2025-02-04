import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";
import { ReactNode } from "react";

interface Props extends NativeStackHeaderProps {
  right?: ReactNode;
}

export function StackHeader({
  route,
  options,
  back,
  navigation,
  right,
}: Props) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
      {Boolean(right) && right}
    </Appbar.Header>
  );
}
