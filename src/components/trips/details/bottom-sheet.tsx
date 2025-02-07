import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Divider, List, useTheme } from "react-native-paper";
import { TripDetails } from "@/src/components/map/trip-details/view";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  formatDistance,
  formatDuration,
  formatOdometer,
  formatSpeed,
  formatUsername,
} from "@/src/utils/format";
import { Tables } from "@/src/types/supabase";
import { vehiclesSelector } from "@/src/store/features/vehicle.slice";
import { store } from "@/src/store/store";

interface Props {
  trip: Tables<"trips">;
  profile: Tables<"profiles"> | null | undefined;
}

export function ViewTripDetailsBottomSheet({ trip, profile }: Props) {
  const ref = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["15%"], []);

  const vehicle = trip.vehicle_id
    ? vehiclesSelector.selectById(store.getState(), trip.vehicle_id)
    : null;

  const { t } = useTranslation("trips", { keyPrefix: "details" });
  const { colors } = useTheme();

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
            description={vehicle?.name ?? t("unknown-vehicle")}
            left={(props) => <List.Icon {...props} icon="car" />}
          />
          <List.Item
            title={t("user")}
            description={formatUsername(
              t("unknown-user"),
              profile?.first_name ?? undefined,
              profile?.last_name ?? undefined,
            )}
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
