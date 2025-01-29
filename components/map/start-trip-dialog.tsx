import {
  Button,
  Dialog,
  Divider,
  FAB,
  Portal,
  RadioButton,
} from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useVehicles } from "@/hooks/use-vehicles";
import * as Location from "expo-location";
import { LocationAccuracy, LocationActivityType } from "expo-location";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StartTripFormData,
  startTripSchema,
} from "@/constants/definitions/trip/start";
import { TextFormField } from "@/components/_common/form/text-input";
import { RadioGroupField } from "@/components/_common/form/radio-group";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentTrip } from "@/hooks/use-current-trip";
import { LOCATION_TRACKING } from "@/constants/strings";
import { useCurrentTripStore } from "@/store/current-trip";

export function StartTripDialog() {
  const queryClient = useQueryClient();

  const [isVisible, setIsVisible] = useState(false);

  const handleToggleDialog = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  const { t } = useTranslation("map", { keyPrefix: "start-trip" });

  const { setIsTracking } = useCurrentTripStore();

  const { data: currentTrip } = useCurrentTrip();
  const { data: vehicles, isSuccess: areVehiclesLoadedSuccessfully } =
    useVehicles();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<StartTripFormData>({
    resolver: zodResolver(startTripSchema),
    defaultValues: {
      start_odometer: "",
      vehicle_id: "",
    },
  });

  const onSubmit = useCallback(async (values: StartTripFormData) => {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    const { error } = await supabase.functions.invoke("start-trip", {
      body: {
        vehicle_id: values.vehicle_id,
        start_odometer: values.start_odometer,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });

    if (error) {
      console.error(error);
      return;
    }

    setIsVisible(false);
    setIsTracking(true);

    await queryClient.invalidateQueries({
      queryKey: ["current-trip"],
    });

    return Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: LocationAccuracy.BestForNavigation,
      activityType: LocationActivityType.AutomotiveNavigation,
      showsBackgroundLocationIndicator: true,
    });
  }, []);

  const vehicle_id = watch("vehicle_id");

  useEffect(() => {
    const vehicle = vehicles?.find((vehicle) => vehicle.id === vehicle_id);

    if (vehicle) {
      const odometer = vehicle.odometer / 1000;
      setValue("start_odometer", odometer.toString());
    }
  }, [vehicle_id, vehicles, setValue]);

  return (
    <>
      <FAB
        icon="car"
        visible={!currentTrip}
        label={t("button")}
        disabled={!areVehiclesLoadedSuccessfully}
        onPress={handleToggleDialog}
      />
      <Portal>
        <Dialog visible={isVisible} onDismiss={handleToggleDialog}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Dialog.Icon icon="car-select" />
            <Dialog.Title style={styles.text}>{t("dialog-title")}</Dialog.Title>
            <Dialog.Content style={styles.form_container}>
              <RadioGroupField<StartTripFormData>
                control={control}
                name="vehicle_id"
              >
                {vehicles?.map((vehicle) => (
                  <RadioButton.Item
                    mode="android"
                    style={styles.radio_button}
                    key={vehicle.id}
                    label={vehicle.name}
                    value={vehicle.id}
                  />
                ))}
              </RadioGroupField>
              <Divider />

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

            <Dialog.Actions>
              <Button onPress={handleToggleDialog}>{t("cancel")}</Button>
              <Button
                onPress={handleSubmit(onSubmit)}
                mode="contained"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t("start")}
              </Button>
            </Dialog.Actions>
          </KeyboardAvoidingView>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  form_container: {
    gap: 8,
  },
  radio_button: {
    paddingHorizontal: 24,
  },
  scroll_container: {
    paddingHorizontal: 0,
  },
  text: {
    textAlign: "center",
  },
});
