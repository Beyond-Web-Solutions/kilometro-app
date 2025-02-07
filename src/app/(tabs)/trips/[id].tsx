import { StyleSheet, useColorScheme, View } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { useTheme } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import { PolyUtil } from "node-geometry-library";
import { ViewTripDetailsBottomSheet } from "@/src/components/trips/details/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/src/hooks/profile/get";
import { useAppSelector } from "@/src/store/hooks";
import { tripsSelector } from "@/src/store/features/trips.slice";
import { vehiclesSelector } from "@/src/store/features/vehicle.slice";

export default function Trip() {
  const scheme = useColorScheme();

  const { t } = useTranslation("trips", { keyPrefix: "details" });
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  const trip = useAppSelector((state) =>
    tripsSelector.selectById(state, id as string),
  );

  const { data: profile } = useProfile(trip?.user_id ?? undefined);

  const [region, setRegion] = useState<Region>();

  const polyline = useMemo(() => {
    if (trip?.codec) {
      const points = PolyUtil.decode(trip.codec);

      return points.map((point) => ({
        latitude: point.lat,
        longitude: point.lng,
      }));
    }

    return [];
  }, [trip]);

  useLayoutEffect(() => {
    if (trip.start_point === null || trip.end_point === null) return;

    const latDelta =
      Math.abs(trip.start_point.latitude - trip.end_point.latitude) + 0.1;
    const lonDelta =
      Math.abs(trip.start_point.longitude - trip.end_point.longitude) + 0.1;

    setRegion({
      latitude: (trip.start_point.latitude + trip.end_point.latitude) / 2,
      longitude: (trip.start_point.longitude + trip.end_point.longitude) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    });
  }, [trip]);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <MapView
          showsCompass
          showsScale
          region={region}
          userInterfaceStyle={scheme === "dark" ? "dark" : "light"}
          style={styles.map}
        >
          {trip.start_point && (
            <Marker
              title={t("starting-point")}
              description={trip?.start_address ?? undefined}
              coordinate={{
                latitude: trip.start_point.latitude,
                longitude: trip.start_point.longitude,
              }}
            />
          )}
          {trip.end_point && (
            <Marker
              title={t("destination")}
              description={trip?.end_address ?? undefined}
              coordinate={{
                latitude: trip.end_point.latitude,
                longitude: trip.end_point.longitude,
              }}
            />
          )}
          <Polyline
            strokeColor={colors.primary}
            strokeWidth={5}
            coordinates={polyline}
          />
        </MapView>
        {trip && <ViewTripDetailsBottomSheet trip={trip} profile={profile} />}
      </GestureHandlerRootView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  back_button: {
    zIndex: 1,
    position: "absolute",
  },
});
