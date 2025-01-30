import { ReactNode } from "react";
import { View, StyleSheet, ViewProps, SafeAreaView } from "react-native";
import { useTheme } from "react-native-paper";

export function Container({ style, ...props }: ViewProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[style, styles.container, { backgroundColor: colors.surface }]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
