import { StyleSheet, View } from "react-native";
import { Icon, List, useTheme } from "react-native-paper";
import { formatDateTime } from "@/utils/format";
import { useTranslation } from "react-i18next";

interface Props {
  origin: string | null;
  departedAt: string | null;
  onOriginPress?: () => void;

  destination: string | null;
  arrivedAt: string | null;
  onDestinationPress?: () => void;
}
export function TripDetails({
  origin,
  onOriginPress,
  departedAt,
  destination,
  onDestinationPress,
  arrivedAt,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("common", { keyPrefix: "trip" });

  return (
    <View>
      <List.Item
        title={origin || t("unknown-location")}
        titleStyle={{ color: origin ? undefined : colors.error }}
        description={
          departedAt ? formatDateTime(departedAt) : t("unknown-time")
        }
        left={(props) => (
          <List.Icon
            {...props}
            icon="map-marker"
            color={origin ? props.color : colors.error}
          />
        )}
        right={(props) => <List.Icon {...props} icon="menu-right" />}
        onPress={onOriginPress}
      />

      <View style={styles.arrow}>
        <Icon size={24} source="arrow-down" color={colors.onSurfaceDisabled} />
      </View>

      <List.Item
        title={destination || t("unknown-location")}
        titleStyle={{ color: destination ? undefined : colors.error }}
        description={arrivedAt ? formatDateTime(arrivedAt) : t("unknown-time")}
        left={(props) => (
          <List.Icon
            {...props}
            icon="map-marker"
            color={destination ? props.color : colors.error}
          />
        )}
        right={(props) => <List.Icon {...props} icon="menu-right" />}
        onPress={onDestinationPress}
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
