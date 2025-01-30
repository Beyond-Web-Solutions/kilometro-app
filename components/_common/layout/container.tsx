import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  children: ReactNode;
}
export function Container({ children }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
