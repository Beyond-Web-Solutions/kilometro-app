import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { ComponentProps } from "react";

export function Screen({
  style,
  ...props
}: ComponentProps<typeof SafeAreaView>) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={StyleSheet.flatten([
        styles.full_screen,
        { backgroundColor: colors.background },
        style,
      ])}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  full_screen: {
    flex: 1,
  },
});
