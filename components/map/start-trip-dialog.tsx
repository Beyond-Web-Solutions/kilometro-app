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
import { useCurrentTripStore } from "@/store/current-trip";
import * as Location from "expo-location";
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

export function StartTripDialog() {
  const queryClient = useQueryClient();

  const { t } = useTranslation("map", { keyPrefix: "start-trip" });

  const [isVisible, setIsVisible] = useState(false);

  const handleToggleDialog = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  const { data, isSuccess } = useVehicles();
  const { isTracking } = useCurrentTripStore();

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

    const { data, error } = await supabase.functions.invoke("start-trip", {
      body: {
        vehicle_id: values.vehicle_id,
        start_odometer: values.start_odometer,
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });

    if (error) {
      // Handle error
      console.error(error);
    }

    // revalidate current trip query
    console.log(data);
  }, []);

  const vehicle_id = watch("vehicle_id");

  useEffect(() => {
    const vehicle = data?.find((vehicle) => vehicle.id === vehicle_id);

    if (vehicle) {
      const odometer = vehicle.odometer / 1000;
      setValue("start_odometer", odometer.toString());
    }
  }, [vehicle_id, data, setValue]);

  /*const handleStartTrip = useCallback(async () => {
    const vehicle = data?.find((vehicle) => vehicle.id === selectedVehicle);

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    if (vehicle) {
      mutate({
        vehicle_id: vehicle.id,
        start_odometer: vehicle.odometer,
        start_point: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    }
  }, [data, selectedVehicle]);*/

  return (
    <>
      <FAB
        icon="car"
        visible={!isTracking}
        label={t("button")}
        disabled={!isSuccess}
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
                {data?.map((vehicle) => (
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
