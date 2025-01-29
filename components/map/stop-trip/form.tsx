import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { Tables } from "@/supabase/functions/stop-trip/supabase/types";
import { TripDetails } from "@/components/map/trip-details";
import { Button, Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import {
  StopTripFormData,
  stopTripSchema,
} from "@/constants/definitions/trip/stop";
import { SegmentedButtonsField } from "@/components/_common/form/segmented-buttons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentTripStore } from "@/store/current-trip";
import { PolyUtil, SphericalUtil } from "node-geometry-library";
import { TextFormField } from "@/components/_common/form/text-input";
import { getCurrentPositionAsync, LocationAccuracy } from "expo-location";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";

interface Props {
  trip: Tables<"trips">;
}

export function StopTripForm({ trip }: Props) {
  const { t } = useTranslation("map", { keyPrefix: "stop-trip-sheet.form" });

  const { route } = useCurrentTripStore();

  const points = route.map((point) => ({
    lat: point.latitude,
    lng: point.longitude,
  }));

  const {
    control,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StopTripFormData>({
    resolver: zodResolver(stopTripSchema),
    defaultValues: async () => {
      const distanceInKm = SphericalUtil.computeLength(points) / 1000;
      const roundedDistance = Math.round(distanceInKm * 10) / 10;

      const { coords } = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.BestForNavigation,
      });

      return {
        start_address: trip.start_address ?? t("unknown-address"),
        start_place_id: trip.start_place_id ?? "",

        end_address: trip.start_address ?? t("unknown-address"),
        end_place_id: trip.start_place_id ?? "",

        codec: PolyUtil.encode(points),
        distance: String(roundedDistance),

        start_odometer: String(trip.start_odometer ?? 0),
        end_odometer: String((trip.start_odometer ?? 0) + roundedDistance),

        type: trip.is_private ? "private" : "business",
      };
    },
  });

  const onSubmit = useCallback((data: StopTripFormData) => {}, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SegmentedButtonsField<StopTripFormData>
          name="type"
          control={control}
          buttons={[
            {
              label: t("type.options.business"),
              value: "business",
              icon: "briefcase",
            },
            {
              label: t("type.options.private"),
              value: "private",
              icon: "account",
            },
          ]}
        />
      </View>
      <Divider horizontalInset />

      <TripDetails
        origin={getValues("start_address")}
        destination={getValues("end_address")}
        departedAt={trip.started_at}
        arrivedAt={new Date().toISOString()}
      />

      <Divider horizontalInset />
      <View style={[styles.content, styles.container]}>
        <KeyboardAvoidingView
          style={styles.odometers_row}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <View style={styles.odometers_container}>
            <TextFormField<StopTripFormData>
              control={control}
              disabled
              mode="outlined"
              name="start_odometer"
              label={t("start_odometer.label")}
            />
          </View>
          <View style={styles.odometers_container}>
            <TextFormField<StopTripFormData>
              control={control}
              mode="outlined"
              name="end_odometer"
              label={t("end_odometer.label")}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </KeyboardAvoidingView>
        <TextFormField<StopTripFormData>
          disabled
          control={control}
          mode="outlined"
          name="distance"
          label={t("distance.label")}
        />
      </View>

      <Divider horizontalInset />
      <View style={[styles.content, styles.submit_button_container]}>
        <Button
          mode="contained-tonal"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {t("submit")}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  content: {
    paddingHorizontal: 16,
  },
  submit_button_container: {
    paddingBottom: 8,
  },
  odometers_container: {
    flex: 1,
  },
  odometers_row: {
    flexDirection: "row",
    gap: 8,
  },
  odometer_input: {},
});
