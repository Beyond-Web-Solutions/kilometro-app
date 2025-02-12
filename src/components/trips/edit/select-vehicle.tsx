import { Control, useController } from "react-hook-form";
import { EditTripFormData } from "@/src/constants/definitions/trip/edit";
import { useAppSelector } from "@/src/store/hooks";
import { vehiclesSelector } from "@/src/store/features/vehicle.slice";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { useTranslation } from "react-i18next";

interface Props {
  control: Control<EditTripFormData>;
  defaultValue: string;
}

export function SelectVehicleInput({ control, defaultValue }: Props) {
  const { t } = useTranslation(["validation", "trips"]);

  const { field, fieldState } = useController({
    name: "vehicle_id",
    control,
  });

  const vehicles = useAppSelector(vehiclesSelector.selectAll);
  const vehicle = useAppSelector((state) =>
    vehiclesSelector.selectById(state, field.value),
  );

  const hasError = Boolean(fieldState.error);

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  return (
    <>
      <View>
        <TextInput
          style={styles.hidden}
          ref={field.ref}
          value={String(field.value)}
          onChangeText={field.onChange}
          error={Boolean(fieldState.error)}
        />
        <TextInput
          mode="outlined"
          label={t("trips:edit.form.vehicle_id.label")}
          right={
            <TextInput.Icon
              icon="pencil"
              onPress={() => setIsDialogVisible(true)}
            />
          }
          value={vehicle.name}
          readOnly
        />
        {hasError && (
          <HelperText type="error" visible={hasError}>
            {t(`validation:${fieldState.error?.message}` as never)}
          </HelperText>
        )}
      </View>
      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Icon icon="car-select" />
          <Dialog.Title>
            {t("trips:edit.form.vehicle_id.dialog-title")}
          </Dialog.Title>
          <Dialog.ScrollArea style={styles.scroll_area}>
            <ScrollView>
              <RadioButton.Group
                onValueChange={field.onChange}
                value={field.value}
              >
                {vehicles.map((vehicle) => (
                  <RadioButton.Item
                    mode="android"
                    style={styles.radio_button}
                    key={vehicle.id}
                    label={vehicle.name}
                    value={vehicle.id}
                  />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setIsDialogVisible(false);
                field.onChange(defaultValue);
              }}
            >
              {t("trips:edit.form.vehicle_id.cancel")}
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setIsDialogVisible(false);
              }}
            >
              {t("trips:edit.form.vehicle_id.confirm")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  hidden: {
    display: "none",
  },
  scroll_area: {
    paddingHorizontal: 0,
  },
  radio_button: {
    paddingHorizontal: 24,
  },
});
