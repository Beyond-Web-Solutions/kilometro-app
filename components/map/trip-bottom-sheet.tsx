import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Divider, Text, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  StopTripFormData,
  stopTripSchema,
} from "@/constants/definitions/trip/stop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentTrip } from "@/hooks/use-current-trip";
import { SegmentedButtonsField } from "@/components/_common/form/segmented-buttons";
import * as Location from "expo-location";
import { supabase } from "@/lib/supabase";
import { useCurrentTripStore } from "@/store/current-trip";
import { getAverage } from "@/utils/math";
import { useQueryClient } from "@tanstack/react-query";
import { PolyUtil, SphericalUtil } from "node-geometry-library";
import { StopTripDialog } from "@/components/map/stop-trip/dialog";
import { TripDetails } from "@/components/map/trip-details";

export function TripBottomSheet() {
  const queryClient = useQueryClient();
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["10%"], []);

  const { t } = useTranslation("map", { keyPrefix: "current-trip" });
  const { colors } = useTheme();

  const { route, speed, stopTrip } = useCurrentTripStore();
  const { data: trip } = useCurrentTrip();

  useEffect(() => {
    if (trip) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [trip]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StopTripFormData>({
    resolver: zodResolver(stopTripSchema),
    defaultValues: { type: "business" },
  });

  const onSubmit = useCallback(
    async (values: StopTripFormData) => {
      if (!trip) return;

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const speeds = speed.filter((speed) => !!speed) as number[];
      const points = route.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      }));

      const codec = PolyUtil.encode(points);
      const distance = SphericalUtil.computeLength(points);

      const { error } = await supabase.functions.invoke("stop-trip", {
        body: {
          id: trip.id,
          end_odometer: 0,
          latitude: coords.latitude,
          longitude: coords.longitude,
          type: values.type,
          codec,
          distance: Math.trunc(distance),
          avg_speed: getAverage(speeds),
          max_speed: Math.max(...speeds),
        },
      });

      if (error) {
        console.error(error);
        return;
      }

      stopTrip();

      await queryClient.invalidateQueries({
        queryKey: ["current-trip"],
      });
    },
    [trip, speed, route],
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
        <TripDetails
          origin={trip?.start_address}
          departedAt={trip?.started_at}
          destination={trip?.end_address}
          arrivedAt={trip?.ended_at}
        />
        <Divider style={styles.divider} />
        <StopTripDialog startOdometer={trip?.start_odometer ?? 0} />
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
