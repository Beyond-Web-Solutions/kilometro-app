import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Button, Divider, List, Text, useTheme } from "react-native-paper";
import { useCurrentTripStore } from "@/store/current-trip";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  stopTripSchema,
  StopTripSchema,
} from "@/constants/definitions/trip/stop";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";
import { supabase } from "@/lib/supabase";
import { encode } from "@googlemaps/polyline-codec";

export function TripBottomSheet() {
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["7.5%", "40%"], []);

  const { t } = useTranslation("map", { keyPrefix: "current-trip" });
  const { colors } = useTheme();
  const { isTracking, route, stopTrip, tripId, speed } = useCurrentTripStore();

  useEffect(() => {
    if (isTracking) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [isTracking]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StopTripSchema>({
    resolver: zodResolver(stopTripSchema),
    defaultValues: { type: "business" },
  });

  const onSubmit = useCallback(
    async (values: StopTripSchema) => {
      if (!tripId) return;

      const location = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.BestForNavigation,
      });

      const codec = encode(
        route.map((point) => [point.latitude, point.longitude]),
      );

      const { data, error } = await supabase
        .from("trips")
        .update({
          codec,
          start_point: `POINT(${location.coords.longitude} ${location.coords.latitude})`,
          ended_at: new Date().toISOString(),
          is_private: values.type === "private",
        })
        .eq("id", tripId);

      console.log(error);

      stopTrip();
    },
    [route, tripId, speed],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.onSurface }}
    >
      <BottomSheetView style={styles.container}>
        <Text variant="headlineSmall">{t("current-rit")}</Text>
        <Divider style={styles.divider} />
        <List.Item
          title={t("unknown-location")}
          description="10:35"
          left={(props) => <List.Icon {...props} icon="map-marker" />}
          right={(props) => <List.Icon {...props} icon="menu-right" />}
          onPress={() => {}}
        />
        <List.Item
          title={t("unknown-location")}
          description="11:45"
          left={(props) => <List.Icon {...props} icon="map-marker" />}
          right={(props) => <List.Icon {...props} icon="menu-right" />}
          onPress={() => {}}
        />
        <Divider style={styles.divider} />

        <Divider style={styles.divider} />
        <Button
          mode="contained-tonal"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {t("stop")}
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
});
