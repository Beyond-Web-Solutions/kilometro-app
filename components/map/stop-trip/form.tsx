import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { Tables } from "@/types/supabase";
import { TripDetails } from "@/components/map/trip-details/view";
import { Button, Divider, IconButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  StopTripFormData,
  stopTripSchema,
} from "@/constants/definitions/trip/stop";
import { SegmentedButtonsField } from "@/components/_common/form/segmented-buttons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentTripStore } from "@/store/current-trip";
import { TextFormField } from "@/components/_common/form/text-input";
import { formatDistance } from "@/utils/format";
import { LoadingTripDetails } from "@/components/map/stop-trip/loading";
import { useQueryClient } from "@tanstack/react-query";
import {
  getDefaultValuesForStopTripForm,
  handleOnStopTripSubmit,
} from "@/utils/trips/stop";
import { EditTripDetailsDialog } from "@/components/map/trip-details/edit";

interface Props {
  trip: Tables<"trips">;
  closeBottomSheet: () => void;
}

export function StopTripForm({ trip, closeBottomSheet }: Props) {
  const queryClient = useQueryClient();

  const { t } = useTranslation("map", { keyPrefix: "stop-trip-sheet.form" });
  const { route, speed, stopTrip } = useCurrentTripStore();

  const points = useMemo(
    () =>
      route.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      })),
    [route],
  );

  const [isEditingOrigin, setIsEditingOrigin] = useState(false);
  const [isEditingDestination, setIsEditingDestination] = useState(false);

  const {
    control,
    watch,
    setValue,
    reset,
    getValues,
    handleSubmit,
    formState: { isSubmitting, defaultValues, isLoading, errors },
  } = useForm<StopTripFormData>({
    resolver: zodResolver(stopTripSchema),
    defaultValues: () => getDefaultValuesForStopTripForm(trip, points, speed),
  });

  useEffect(() => {
    console.log("Stop trip errors: ", errors);
  }, [errors]);

  const default_odometer = defaultValues?.end_odometer;
  const end_odometer = watch("end_odometer");

  useEffect(() => {
    const start_odometer = getValues("start_odometer");

    if (end_odometer > start_odometer) {
      setValue("distance", end_odometer - start_odometer);
    } else {
      setValue("distance", 0);
    }
  }, [end_odometer]);

  const onSubmit = useCallback(
    async (values: StopTripFormData) => {
      const { error } = await handleOnStopTripSubmit(values, trip.id, points);

      if (error) {
        console.error(error);
        return;
      }

      stopTrip();
      closeBottomSheet();
      reset();

      return queryClient.invalidateQueries({
        queryKey: ["current-trip"],
      });
    },
    [trip, stopTrip],
  );

  if (isLoading) {
    return <LoadingTripDetails />;
  }

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
          {!!default_odometer && end_odometer !== default_odometer && (
            <IconButton
              icon="reload"
              onPress={() => setValue("end_odometer", default_odometer)}
            />
          )}
        </View>
        <Text>
          {t("total-distance", {
            distance: formatDistance(watch("distance")),
          })}
        </Text>
      </View>

      <Divider horizontalInset />
      <View style={[styles.content, styles.submit_button_container]}>
        <Button
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
        address={getValues("start_address")}
        callback={(placeId, address) => {
          setValue("start_place_id", placeId);
          setValue("start_address", address);
          setIsEditingOrigin(false);
        }}
      />

      <EditTripDetailsDialog
        isVisible={isEditingDestination}
        hideDialog={() => setIsEditingDestination(false)}
        address={getValues("end_address")}
        callback={(placeId, address) => {
          setValue("end_place_id", placeId);
          setValue("end_address", address);
          setIsEditingDestination(false);
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
  },
  odometers_container: {
    flex: 1,
  },
  odometers_row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  odometer_input: {},
});
