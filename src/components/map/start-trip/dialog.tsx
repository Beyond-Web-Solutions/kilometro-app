import { Button, Dialog, Divider, Portal } from "react-native-paper";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useForegroundPermissions } from "expo-location";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StartTripFormData,
  startTripSchema,
} from "@/src/constants/definitions/trip/start";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentTripStore } from "@/src/store/current-trip";
import { SelectVehicleInput } from "@/src/components/map/start-trip/select-vehicle";
import { router } from "expo-router";
import { handleOnStartTripSubmit } from "@/src/utils/trips/start";
import { useVehicles } from "@/src/hooks/vehicles/list";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
}

export function StartTripDialog({ isVisible, hideDialog }: Props) {
  const queryClient = useQueryClient();

  const [status, request] = useForegroundPermissions();

  const { t } = useTranslation("map", { keyPrefix: "start-trip-dialog" });

  const { startTrip } = useCurrentTripStore();
  const { data: vehicles } = useVehicles();

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
      if (!status?.granted) {
        if (status?.canAskAgain) {
          await request();
        } else {
          return router.navigate("/(tabs)/settings");
        }
      }

      const { error } = await handleOnStartTripSubmit(values);

      if (error) {
        console.error(error);
        return;
      }

      hideDialog();
      reset();
      startTrip();

      return queryClient.invalidateQueries({
        queryKey: ["current-trip"],
      });
    },
    [status, hideDialog],
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
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Dialog.Icon icon="car-select" />
          <Dialog.Title style={styles.text}>{t("title")}</Dialog.Title>
          <Dialog.Content style={styles.form_container}>
            <SelectVehicleInput control={control} />

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
            <Button onPress={hideDialog}>{t("form.cancel")}</Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              mode="contained"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t("form.submit")}
            </Button>
          </Dialog.Actions>
        </KeyboardAvoidingView>
      </Dialog>
    </Portal>
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
