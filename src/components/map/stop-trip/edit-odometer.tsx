import { Control, useController } from "react-hook-form";
import { StopTripFormData } from "@/src/constants/definitions/trip/stop";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { TextFormField } from "@/src/components/_common/form/text-input";

interface Props {
  isVisible: boolean;
  closeDialog: () => void;
  defaultValue: string;
  control: Control<StopTripFormData>;
}
export function EditOdometerDialog({
  isVisible,
  closeDialog,
  control,
  defaultValue,
}: Props) {
  const { t } = useTranslation("map", {
    keyPrefix: "stop-trip-sheet.form.end_odometer",
  });

  const { field } = useController({
    control,
    name: "end_odometer",
  });

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={closeDialog}>
        <Dialog.Title>{t("dialog-title")}</Dialog.Title>
        <Dialog.Content>
          <TextFormField<StopTripFormData>
            control={control}
            mode="outlined"
            name="end_odometer"
            label={t("label")}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              field.onChange(defaultValue);
              closeDialog();
            }}
          >
            {t("cancel")}
          </Button>
          <Button onPress={closeDialog}>{t("submit")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
