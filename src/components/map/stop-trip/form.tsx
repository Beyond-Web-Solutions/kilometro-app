import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { StyleSheet, View } from "react-native";
import { CancelTripDialog } from "@/src/components/map/stop-trip/cancel";
import { Tables } from "@/src/types/supabase";
import { TripDetails } from "@/src/components/map/trip-details/view";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { EditTripDetailsDialog } from "@/src/components/map/trip-details/edit";
import { setTrip, stopTrip } from "@/src/store/features/current-trip.slice";
import { Trip } from "@/src/types/trips";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StopTripFormData,
  stopTripSchema,
} from "@/src/constants/definitions/trip/stop";
import { PolyUtil, SphericalUtil } from "node-geometry-library";
import { SegmentedButtonsField } from "@/src/components/_common/form/segmented-buttons";
import { Button, Divider, IconButton, Text } from "react-native-paper";
import { TextFormField } from "../../_common/form/text-input";
import { formatDistance } from "@/src/utils/format";
import { supabase } from "@/src/lib/supabase";
import { stopLocationUpdatesAsync } from "expo-location";

interface Props {
  trip: Tables<"trips">;
  closeBottomSheet: () => void;
}

export function StopTripForm({ trip, closeBottomSheet }: Props) {
  const { t } = useTranslation("map", { keyPrefix: "stop-trip-sheet.form" });

  const dispatch = useAppDispatch();
  const route = useAppSelector((state) => state.current_trip.route);

  const [isEditingOrigin, setIsEditingOrigin] = useState(false);
  const [isEditingDestination, setIsEditingDestination] = useState(false);

  const points = useMemo(
    () =>
      route.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      })),
    [route],
  );

  const distance = useMemo(() => SphericalUtil.computeLength(points), [points]);

  const newOdometer = useMemo(() => {
    const km = (trip.start_odometer + Math.trunc(distance)) / 1000;

    return Math.round(km * 10) / 10;
  }, [distance, trip.start_odometer]);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    resetField,
    getFieldState,
    formState: { isSubmitting },
  } = useForm<StopTripFormData>({
    resolver: zodResolver(stopTripSchema),
    defaultValues: {
      type: trip.is_private ? "private" : "business",
      start_odometer: trip.start_odometer / 1000,
      end_odometer: newOdometer,
      distance,
    },
  });

  const onSubmit = useCallback(
    async (values: StopTripFormData) => {
      await supabase
        .from("trips")
        .update({
          ...trip,
          end_odometer: values.end_odometer * 1000,
          distance: values.distance,
          codec: PolyUtil.encode(points),
        })
        .eq("id", trip.id);

      await stopLocationUpdatesAsync("TRACK_BACKGROUND_LOCATION");

      dispatch(stopTrip());
      reset();
      closeBottomSheet();
    },
    [trip, points],
  );

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
        origin={trip.start_address ?? t("unknown-address")}
        destination={trip.end_address ?? t("unknown-address")}
        departedAt={trip.started_at}
        arrivedAt={new Date().toISOString()}
        onOriginPress={() => setIsEditingOrigin(true)}
        onDestinationPress={() => setIsEditingDestination(true)}
      />

      <Divider horizontalInset />
      <View style={[styles.content, styles.container]}>
        <View style={styles.odometers_row}>
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
          {getFieldState("end_odometer").isDirty && (
            <IconButton
              icon="reload"
              onPress={() => {
                resetField("end_odometer");
              }}
            />
          )}
        </View>
        <Text>
          {t("total-distance", {
            distance: formatDistance((watch("distance") ?? 0) / 1000),
          })}
        </Text>
      </View>

      <Divider horizontalInset />
      <View style={[styles.content, styles.submit_button_container]}>
        <CancelTripDialog
          id={trip.id}
          onSubmit={() => {
            closeBottomSheet();
          }}
        />
        <Button
          style={styles.button}
          mode="contained"
          icon="car-off"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {t("submit")}
        </Button>
      </View>

      <EditTripDetailsDialog
        isVisible={isEditingOrigin}
        hideDialog={() => setIsEditingOrigin(false)}
        address={trip.start_address}
        callback={(placeId, address) => {
          dispatch(
            setTrip({
              ...trip,
              start_place_id: placeId,
              start_address: address,
            } as Trip),
          );
        }}
      />

      <EditTripDetailsDialog
        isVisible={isEditingDestination}
        hideDialog={() => setIsEditingDestination(false)}
        address={trip.end_address}
        callback={(placeId, address) => {
          dispatch(
            setTrip({
              ...trip,
              end_place_id: placeId,
              end_address: address,
            } as Trip),
          );
        }}
      />
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
    flexDirection: "row",
    gap: 8,
  },
  odometers_container: {
    flex: 1,
  },
  odometers_row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
