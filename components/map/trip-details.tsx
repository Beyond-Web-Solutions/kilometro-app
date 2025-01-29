import { StyleSheet, View } from "react-native";
import { Icon, List, useTheme } from "react-native-paper";
import { formatDateTime } from "@/utils/format";
import { useTranslation } from "react-i18next";

interface Props {
  origin: string | null | undefined;
  departedAt: string | null;

  destination: string | null | undefined;
  arrivedAt: string | null;
}
export function TripDetails({
  origin,
  departedAt,
  destination,
  arrivedAt,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("common", { keyPrefix: "trip" });

  return (
    <View>
      <List.Item
        title={origin ?? t("unknown-location")}
        description={
          departedAt ? formatDateTime(departedAt) : t("unknown-time")
        }
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
      <View style={styles.arrow}>
        <Icon size={24} source="arrow-down" color={colors.onSurfaceDisabled} />
      </View>
      <List.Item
        title={destination ?? t("unknown-location")}
        description={arrivedAt ? formatDateTime(arrivedAt) : t("unknown-time")}
        left={(props) => <List.Icon {...props} icon="map-marker" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: "-50%" }],
  },
});
