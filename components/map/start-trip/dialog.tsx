import { Button, Dialog, Divider, FAB, Portal } from "react-native-paper";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import {
  geocodeAsync,
  getCurrentPositionAsync,
  LocationAccuracy,
  reverseGeocodeAsync,
  useForegroundPermissions,
} from "expo-location";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StartTripFormData,
  startTripSchema,
} from "@/constants/definitions/trip/start";
import { TextFormField } from "@/components/_common/form/text-input";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentTripStore } from "@/store/current-trip";
import { SelectVehicleInput } from "@/components/map/start-trip/select-vehicle";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export function StartTripDialog() {
  const queryClient = useQueryClient();

  const [isVisible, setIsVisible] = useState(false);
  const [status, request] = useForegroundPermissions();

  const handleToggleDialog = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  const { t } = useTranslation("map", { keyPrefix: "start-trip" });

  const { isTracking, startTrip } = useCurrentTripStore();

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

  const onSubmit = useCallback(
    async (values: StartTripFormData) => {
      if (!status?.granted) {
        if (status?.canAskAgain) {
          await request();
        } else {
          return router.navigate("/(tabs)/settings");
        }
      }

      const { coords } = await getCurrentPositionAsync({
        accuracy: LocationAccuracy.BestForNavigation,
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
      startTrip();

      return queryClient.invalidateQueries({
        queryKey: ["current-trip"],
      });
    },
    [status],
  );

  return (
    <>
      <FAB
        icon="car"
        visible={!isTracking}
        label={t("button")}
        onPress={handleToggleDialog}
      />
      <Portal>
        <Dialog visible={isVisible} onDismiss={handleToggleDialog}>
          <Dialog.Icon icon="car-select" />
          <Dialog.Title style={styles.text}>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content style={styles.form_container}>
            <SelectVehicleInput
              control={control}
              watch={watch}
              setValue={setValue}
            />

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
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  form_container: {
    gap: 8,
  },
  scroll_container: {
    paddingHorizontal: 0,
  },
  text: {
    textAlign: "center",
  },
});
