import { Button, Dialog, Portal } from "react-native-paper";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StartTripFormData,
  startTripSchema,
} from "@/src/constants/definitions/trip/start";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { SelectVehicleInput } from "@/src/components/map/start-trip/select-vehicle";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { vehiclesSelector } from "@/src/store/features/vehicle.slice";
import { startTrip } from "@/src/store/features/current-trip.slice";
import { Trip } from "@/src/types/trips";
import { supabase } from "@/src/lib/supabase";
import {
  LocationAccuracy,
  LocationActivityType,
  startLocationUpdatesAsync,
} from "expo-location";
import { LOCATION_TASK_NAME } from "@/src/utils/task-manager";
import { KeyboardAvoidingDialog } from "@/src/components/_common/keyboard-avoiding-dialog";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
}

export function StartTripDialog({ isVisible, hideDialog }: Props) {
  const { t } = useTranslation("map", { keyPrefix: "start-trip-dialog" });

  const dispatch = useAppDispatch();
  const vehicles = useAppSelector(vehiclesSelector.selectAll);
  const user = useAppSelector((state) => state.auth.user);
  const organization = useAppSelector((state) => state.organizations.selected);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<StartTripFormData>({
    resolver: zodResolver(startTripSchema),
    defaultValues: {
      start_odometer: 0,
      vehicle_id: "",
    },
  });

  const onSubmit = useCallback(
    async (values: StartTripFormData) => {
      if (!user! || !organization) return;

      const { data, error } = await supabase
        .from("trips")
        .insert({
          user_id: user.id,
          vehicle_id: values.vehicle_id,
          start_odometer: Number(values.start_odometer) * 1000,
          organization_id: organization,
        })
        .select("*")
        .single();

      if (error) {
        console.error(error);
        return;
      }

      dispatch(startTrip(data as Trip));

      await startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: LocationAccuracy.BestForNavigation,
        pausesUpdatesAutomatically: true,
        activityType: LocationActivityType.AutomotiveNavigation,
        showsBackgroundLocationIndicator: true,
      });

      hideDialog();
      reset();
    },
    [hideDialog, user],
  );

  const vehicle_id = watch("vehicle_id");

  useEffect(() => {
    const vehicle = vehicles?.find((v) => v.id === vehicle_id);

    if (vehicle) {
      setValue("start_odometer", vehicle.odometer / 1000);
    }
  }, [vehicle_id, vehicles]);

  return (
    <Portal>
      <KeyboardAvoidingDialog isVisible={isVisible} setIsVisible={hideDialog}>
        <Dialog.Icon icon="car-select" />
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.ScrollArea style={styles.scroll_area}>
          <ScrollView>
            <SelectVehicleInput control={control} />
          </ScrollView>
        </Dialog.ScrollArea>
        {watch("vehicle_id") !== "" && (
          <Dialog.Content>
            <TextFormField<StartTripFormData>
              disabled={watch("vehicle_id") === ""}
              control={control}
              name="start_odometer"
              mode="outlined"
              autoCapitalize="none"
              inputMode="numeric"
              label={t("form.odometer.label")}
              keyboardType="numeric"
              textContentType="none"
              returnKeyType="go"
              numberOfLines={1}
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          </Dialog.Content>
        )}

        <Dialog.Actions>
          <Button onPress={hideDialog}>{t("form.cancel")}</Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {t("form.submit")}
          </Button>
        </Dialog.Actions>
      </KeyboardAvoidingDialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  form_container: {
    gap: 8,
  },
  scroll_area: {
    paddingHorizontal: 0,
  },
});
