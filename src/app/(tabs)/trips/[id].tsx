import { StyleSheet, useColorScheme, View } from "react-native";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";
import { useTheme } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useTrip } from "@/src/hooks/trip/single";
import { useLayoutEffect, useMemo, useState } from "react";
import { PolyUtil } from "node-geometry-library";
import { ViewTripDetailsBottomSheet } from "@/src/components/trips/details/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

export default function Trip() {
  const scheme = useColorScheme();

  const { t } = useTranslation("trips", { keyPrefix: "details" });
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  const { data } = useTrip(id as string);

  const [region, setRegion] = useState<Region>();

  const startPoint = useMemo(() => {
    if (!data?.start_point) return null;

    return data?.start_point as LatLng;
  }, [data]);

  const endPoint = useMemo(() => {
    if (!data?.end_point) return null;

    return data?.end_point as LatLng;
  }, [data]);

  const polyline = useMemo(() => {
    if (data?.codec) {
      const points = PolyUtil.decode(data.codec);

      return points.map((point) => ({
        latitude: point.lat,
        longitude: point.lng,
      }));
    }

    return [];
  }, [data]);

  useLayoutEffect(() => {
    if (startPoint === null || endPoint === null) return;

    const latDelta = Math.abs(startPoint.latitude - endPoint.latitude) + 0.1;
    const lonDelta = Math.abs(startPoint.longitude - endPoint.longitude) + 0.1;

    setRegion({
      latitude: (startPoint.latitude + endPoint.latitude) / 2,
      longitude: (startPoint.longitude + endPoint.longitude) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    });
  }, [startPoint, endPoint]);

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
          {startPoint && (
            <Marker
              title={t("starting-point")}
              description={data?.start_address ?? undefined}
              coordinate={{
                latitude: startPoint.latitude,
                longitude: startPoint.longitude,
              }}
            />
          )}
          {endPoint && (
            <Marker
              title={t("destination")}
              description={data?.end_address ?? undefined}
              coordinate={{
                latitude: endPoint.latitude,
                longitude: endPoint.longitude,
              }}
            />
          )}
          <Polyline
            strokeColor={colors.primary}
            strokeWidth={5}
            coordinates={polyline}
          />
        </MapView>
        {data && <ViewTripDetailsBottomSheet trip={data} />}
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
