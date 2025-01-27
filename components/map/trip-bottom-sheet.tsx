import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Button, Divider, List, Text, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  stopTripSchema,
  StopTripFormData,
} from "@/constants/definitions/trip/stop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentTrip } from "@/hooks/use-current-trip";
import { formatDateTime } from "@/utils/format";
import { SegmentedButtonsField } from "@/components/_common/form/segmented-buttons";
import * as Location from "expo-location";
import { supabase } from "@/lib/supabase";
import { useCurrentTripStore } from "@/store/current-trip";
import { getAverage } from "@/utils/math";
import { encode } from "@googlemaps/polyline-codec";
import { useQueryClient } from "@tanstack/react-query";

export function TripBottomSheet() {
  const queryClient = useQueryClient();
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["10%"], []);

  const { t } = useTranslation("map", { keyPrefix: "current-trip" });
  const { colors } = useTheme();

  const { speed, route, stopTrip } = useCurrentTripStore();
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

      const { error } = await supabase.functions.invoke("stop-trip", {
        body: {
          id: trip.id,
          end_odometer: 0,
          latitude: coords.latitude,
          longitude: coords.latitude,
          type: values.type,
          codec: encode(
            route.map((point) => [point.longitude, point.latitude]),
          ),
          avg_speed: getAverage(speed),
          max_speed: Math.max(...speed),
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
        <List.Item
          title={trip?.start_address ?? t("unknown-location")}
          description={
            trip?.started_at
              ? formatDateTime(trip.started_at)
              : t("unknown-time")
          }
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
        <SegmentedButtonsField<StopTripFormData>
          name="type"
          control={control}
          buttons={[
            { label: t("type.business"), value: "business", icon: "briefcase" },
            { label: t("type.private"), value: "private", icon: "account" },
          ]}
        />
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
