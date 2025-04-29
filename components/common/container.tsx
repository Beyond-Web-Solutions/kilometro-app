import { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

export function Container({ style, ...props }: ComponentProps<typeof View>) {
  return <View style={[style, styles.container]} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    gap: 8,
  },
});
