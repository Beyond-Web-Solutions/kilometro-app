import { StyleSheet } from "react-native";
import { formatSpeed } from "@/src/utils/format";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/store/hooks";

export function SpeedIndicator() {
  const speed = useAppSelector((state) => state.current_trip.currentSpeed);

  const { t } = useTranslation("common");

  const insets = useSafeAreaInsets();

  if (!speed) {
    return null;
  }

  return (
    <Surface
      elevation={5}
      style={[
        styles.container,
        { left: 16 + insets.left, top: 16 + insets.top },
      ]}
    >
      <Text style={styles.text} variant="titleLarge">
        {formatSpeed(speed)}
      </Text>
      <Text style={styles.text} variant="bodySmall">
        {t("km-h")}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderRadius: 64,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    lineHeight: 0,
  },
});
