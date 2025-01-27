import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import {
  HelperText,
  SegmentedButtons,
  SegmentedButtonsProps,
} from "react-native-paper";
import { Control, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  buttons: SegmentedButtonsProps["buttons"];
}

export function SegmentedButtonsField<T extends FieldValues>({
  control,
  name,
  buttons,
}: Props<T>) {
  const { t } = useTranslation("validation");

  const { field, fieldState } = useController({
    name,
    control,
  });

  const hasError = Boolean(fieldState.error);

  return (
    <View>
      <SegmentedButtons
        value={field.value}
        onValueChange={field.onChange}
        buttons={buttons}
      />
      {hasError && (
        <HelperText type="error" visible={hasError}>
          {t(fieldState.error?.message as never)}
        </HelperText>
      )}
    </View>
  );
}
