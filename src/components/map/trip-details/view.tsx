import { StyleSheet, View } from "react-native";
import { Icon, List, useTheme } from "react-native-paper";
import { formatDateTime } from "@/src/utils/format";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

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

  const renderOriginRightIcon = useCallback(
    (props: any) => {
      if (onOriginPress) {
        return <List.Icon {...props} icon="menu-right" />;
      }

      return null;
    },
    [onOriginPress],
  );

  const renderDestinationRightIcon = useCallback(
    (props: any) => {
      if (onDestinationPress) {
        return <List.Icon {...props} icon="menu-right" />;
      }

      return null;
    },
    [onDestinationPress],
  );

  return (
    <View>
      <List.Item
        title={origin || t("unknown-location")}
        titleStyle={{ color: origin ? colors.onSurface : colors.error }}
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
        right={renderOriginRightIcon}
        onPress={onOriginPress}
      />

      <View style={styles.arrow}>
        <Icon size={24} source="arrow-down" color={colors.onSurfaceDisabled} />
      </View>

      <List.Item
        title={destination || t("unknown-location")}
        titleStyle={{ color: destination ? colors.onSurface : colors.error }}
        description={arrivedAt ? formatDateTime(arrivedAt) : t("unknown-time")}
        left={(props) => (
          <List.Icon
            {...props}
            icon="map-marker"
            color={destination ? props.color : colors.error}
          />
        )}
        right={renderDestinationRightIcon}
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
