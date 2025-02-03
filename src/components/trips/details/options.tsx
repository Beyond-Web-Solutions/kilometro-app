import { useEffect, useState } from "react";
import { Divider, IconButton, Menu } from "react-native-paper";

interface Props {
  params: { id?: string };
}

export function TripsOptionsMenu({ params }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log(params);
  }, [params]);

  return (
    <Menu
      visible={isVisible}
      onDismiss={() => setIsVisible(false)}
      anchor={
        <IconButton icon="dots-vertical" onPress={() => setIsVisible(true)} />
      }
    >
      <Menu.Item onPress={() => {}} title="Bewerken" leadingIcon="pencil" />
      <Divider />
      <Menu.Item onPress={() => {}} title="Verwijderen" leadingIcon="delete" />
    </Menu>
  );
}
