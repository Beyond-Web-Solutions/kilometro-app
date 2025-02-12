import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { nl, registerTranslation } from "react-native-paper-dates";
import {
  Appbar,
  Button,
  Dialog,
  Divider,
  Portal,
  TextInput,
  useTheme,
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { tripsSelector, updateTrip } from "@/src/store/features/trips.slice";
import { useForm } from "react-hook-form";
import {
  EditTripFormData,
  editTripSchema,
} from "@/src/constants/definitions/trip/edit";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimeFormField } from "@/src/components/_common/form/date-time";
import { SelectVehicleInput } from "@/src/components/trips/edit/select-vehicle";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { Trip } from "@/src/types/trips";
import { EditTripDetailsDialog } from "@/src/components/map/trip-details/edit";
import { supabase } from "@/src/lib/supabase";

registerTranslation("nl", nl);

export function EditTripDialog() {
  const { t } = useTranslation("trips", { keyPrefix: "edit" });
  const { id, edit } = useLocalSearchParams();
  const { colors } = useTheme();

  const dispatch = useAppDispatch();
  const trip = useAppSelector((state) =>
    tripsSelector.selectById(state, id as string),
  );

  const [
    isEditStartLocationDialogVisible,
    setIsEditStartLocationDialogVisible,
  ] = useState(false);

  const [isEditEndLocationDialogVisible, setIsEditEndLocationDialogVisible] =
    useState(false);

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting, defaultValues },
  } = useForm<EditTripFormData>({
    resolver: zodResolver(editTripSchema),
    defaultValues: {
      started_at: new Date(trip.started_at ?? "now"),
      ended_at: new Date(trip.ended_at ?? "now"),
      vehicle_id: trip.vehicle_id ?? "",
      start_odometer: trip.start_odometer / 1000,
      end_odometer: (trip.end_odometer ?? 0) / 1000,

      start_place_id: trip.start_place_id ?? "",
      start_address: trip.start_address ?? "",

      end_place_id: trip.end_place_id ?? "",
      end_address: trip.end_address ?? "",
    },
  });

  const close = useCallback(() => {
    reset();
    router.setParams({ edit: "false" });
  }, []);

  const onSubmit = useCallback(async (values: EditTripFormData) => {
    const { error, data } = await supabase
      .from("trips")
      .update({
        ...values,
        start_odometer: values.start_odometer * 1000,
        end_odometer: values.end_odometer * 1000,
        started_at: values.started_at.toISOString(),
        ended_at: values.ended_at.toISOString(),
      })
      .eq("id", id as string)
      .select()
      .single();

    if (error) {
      return;
    }

    dispatch(updateTrip({ id: id as string, changes: data as Trip }));
    return router.setParams({ edit: "false" });
  }, []);

  return (
    <Modal
      animationType="slide"
      onRequestClose={close}
      presentationStyle="overFullScreen"
      visible={edit === "true"}
    >
      <Portal.Host>
        <Appbar.Header elevated>
          <Appbar.Action icon="close" onPress={close} />
          <Appbar.Content title={t("title")} />
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {t("save")}
          </Button>
        </Appbar.Header>
        <ScrollView style={{ backgroundColor: colors.surface }}>
          <Dialog.Content style={styles.content}>
            <DateTimeFormField<EditTripFormData>
              control={control}
              label={t("form.started_at.label")}
              name="started_at"
            />
            <DateTimeFormField<EditTripFormData>
              control={control}
              label={t("form.ended_at.label")}
              name="ended_at"
            />
            <Divider />
            <SelectVehicleInput
              control={control}
              defaultValue={defaultValues?.vehicle_id ?? ""}
            />
            <View style={styles.row}>
              <View style={styles.row_item}>
                <TextFormField<EditTripFormData>
                  name="start_odometer"
                  control={control}
                  mode="outlined"
                  label={t("form.start-odometer.label")}
                  inputMode="numeric"
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus("end_odometer")}
                />
              </View>
              <View style={styles.row_item}>
                <TextFormField<EditTripFormData>
                  control={control}
                  name="end_odometer"
                  mode="outlined"
                  label={t("form.end-odometer.label")}
                  inputMode="numeric"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Divider />
            <TextFormField<EditTripFormData>
              control={control}
              name="start_address"
              mode="outlined"
              label={t("form.start-location.label")}
              right={
                <TextInput.Icon
                  icon="pencil"
                  onPress={() => setIsEditStartLocationDialogVisible(true)}
                />
              }
              readOnly
            />
            <TextFormField<EditTripFormData>
              control={control}
              name="end_address"
              mode="outlined"
              label={t("form.end-location.label")}
              right={
                <TextInput.Icon
                  icon="pencil"
                  onPress={() => setIsEditEndLocationDialogVisible(true)}
                />
              }
              readOnly
            />
          </Dialog.Content>
        </ScrollView>
        <EditTripDetailsDialog
          isVisible={isEditStartLocationDialogVisible}
          hideDialog={() => setIsEditStartLocationDialogVisible(false)}
          address={getValues("start_address")}
          callback={(placeId, address) => {
            setValue("start_place_id", placeId);
            setValue("start_address", address);
          }}
        />
        <EditTripDetailsDialog
          isVisible={isEditEndLocationDialogVisible}
          hideDialog={() => setIsEditEndLocationDialogVisible(false)}
          address={getValues("end_address")}
          callback={(placeId, address) => {
            setValue("end_place_id", placeId);
            setValue("end_address", address);
          }}
        />
      </Portal.Host>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  row_item: {
    flex: 1,
  },
});
