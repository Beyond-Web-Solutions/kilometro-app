import { useCurrentTripStore } from "@/store/current-trip";
import { StyleSheet } from "react-native";
import { formatSpeed } from "@/utils/format";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SpeedIndicator() {
  const { currentSpeed } = useCurrentTripStore();
  const insets = useSafeAreaInsets();

  if (!currentSpeed) {
    return null;
  }

  return (
    <Surface
      elevation={2}
      style={[
        styles.container,
        { left: 16 + insets.left, top: 16 + insets.top },
      ]}
    >
      <Text variant="titleLarge">{formatSpeed(currentSpeed)}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderRadius: 999,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
});
