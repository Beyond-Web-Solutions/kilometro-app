import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Divider, List, useTheme } from "react-native-paper";
import { TripDetails } from "@/components/map/trip-details/view";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  formatDistance,
  formatDuration,
  formatOdometer,
  formatSpeed,
} from "@/utils/format";
import { getTrip } from "@/hooks/trip/use-trip";

interface Props {
  trip: Awaited<ReturnType<typeof getTrip>>;
}

export function ViewTripDetailsBottomSheet({ trip }: Props) {
  const ref = useRef<BottomSheet>(null);

  const { t } = useTranslation("trips", { keyPrefix: "details" });
  const { colors } = useTheme();

  const snapPoints = useMemo(() => ["15%"], []);

  if (!trip) {
    return null;
  }

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.onSurface }}
    >
      <BottomSheetView style={styles.container}>
        <TripDetails
          origin={trip.start_address}
          departedAt={trip.started_at}
          destination={trip.end_address}
          arrivedAt={trip.ended_at}
        />
        <Divider horizontalInset />
        <View>
          <List.Item
            title={t("vehicle")}
            description={trip.vehicles?.name}
            left={(props) => <List.Icon {...props} icon="car" />}
          />
          <List.Item
            title={t("user")}
            description={trip.user_id}
            left={(props) => <List.Icon {...props} icon="account" />}
          />

          <List.Item
            title={t("distance")}
            description={formatDistance((trip.distance ?? 0) / 1000)}
            left={(props) => (
              <List.Icon {...props} icon="map-marker-distance" />
            )}
          />

          <List.Item
            title={t("duration")}
            description={formatDuration(trip.started_at, trip.ended_at)}
            left={(props) => <List.Icon {...props} icon="clock-outline" />}
          />
          <List.Item
            title={t("avg-speed")}
            description={formatSpeed(trip.avg_speed ?? 0, true)}
            left={(props) => <List.Icon {...props} icon="speedometer" />}
          />
          <List.Item
            title={t("start-odometer")}
            description={formatOdometer(trip.start_odometer, true)}
            left={(props) => <List.Icon {...props} icon="gauge" />}
          />
          <List.Item
            title={t("end-odometer")}
            description={formatOdometer(trip.end_odometer, true)}
            left={(props) => <List.Icon {...props} icon="gauge" />}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
