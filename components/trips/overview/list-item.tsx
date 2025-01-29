import { Tables } from "@/types/supabase";
import {
  Divider,
  Icon,
  List,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { formatDateTime } from "@/utils/format";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";

interface Props {
  trip: Tables<"trips">;
}

export function TripsOverviewListItem({ trip }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("trips", { keyPrefix: "overview" });

  return (
    <Link href={{ pathname: "/trips/[id]", params: { id: trip.id } }} asChild>
      <TouchableRipple>
        <View>
          <List.Item
            title={trip.start_address}
            description={
              trip.started_at
                ? formatDateTime(trip.started_at)
                : t("unknown-time")
            }
            left={(props) => <List.Icon {...props} icon="map-marker" />}
          />
          <View style={styles.arrow}>
            <Icon
              size={24}
              source="arrow-down"
              color={colors.onSurfaceDisabled}
            />
          </View>
          <List.Item
            title={trip.end_address}
            description={
              trip.ended_at ? formatDateTime(trip.ended_at) : t("unknown-time")
            }
            left={(props) => <List.Icon {...props} icon="map-marker" />}
          />
          <Divider />
        </View>
      </TouchableRipple>
    </Link>
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
