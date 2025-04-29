import { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

export function Container({ style, ...props }: ComponentProps<typeof View>) {
  return <View {...props} style={[style, styles.container]} />;
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    gap: 8,
  },
});
