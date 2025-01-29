import { StyleSheet, useColorScheme, View } from "react-native";
import MapView, { LatLng, Polyline, Region } from "react-native-maps";
import { FAB, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTrip } from "@/hooks/use-trip";
import { useLayoutEffect, useMemo, useState } from "react";
import { PolyUtil } from "node-geometry-library";

export default function Trip() {
  const scheme = useColorScheme();
  const navigation = useNavigation();

  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const { top, left } = useSafeAreaInsets();

  const { data } = useTrip(id as string);

  const [region, setRegion] = useState<Region>();

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
    if (!data?.start_point && !data?.end_point) return;

    const start = data.start_point as LatLng;
    const end = data.end_point as LatLng;

    const latDelta = Math.abs(start.latitude - end.latitude) + 0.1;
    const lonDelta = Math.abs(start.longitude - end.longitude) + 0.1;

    setRegion({
      latitude: (start.latitude + end.latitude) / 2,
      longitude: (start.longitude + end.longitude) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lonDelta,
    });
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={[styles.back_button, { top: 16 + top, left: 16 + left }]}>
        <FAB
          variant="surface"
          icon="close"
          size="small"
          onPress={() => navigation.goBack()}
        />
      </View>
      <MapView
        showsCompass
        showsScale
        region={region}
        userInterfaceStyle={scheme === "dark" ? "dark" : "light"}
        style={styles.map}
      >
        <Polyline
          strokeColor={colors.primary}
          strokeWidth={5}
          coordinates={polyline}
        />
      </MapView>
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
