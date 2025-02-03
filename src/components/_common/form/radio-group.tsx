import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { Control, useController } from "react-hook-form";
import { HelperText, RadioButton, useTheme } from "react-native-paper";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  children: ReactNode;
}

export function RadioGroupField<T extends FieldValues>({
  name,
  control,
  children,
}: Props<T>) {
  const { colors, roundness } = useTheme();
  const { t } = useTranslation("validation");

  const { field, fieldState } = useController({
    name,
    control,
  });

  const hasError = Boolean(fieldState.error);

  return (
    <View>
      <RadioButton.Group onValueChange={field.onChange} value={field.value}>
        <View
          style={{
            borderRadius: roundness,
            borderWidth: 1,
            borderColor: hasError ? colors.error : colors.elevation.level3,
          }}
        >
          {children}
        </View>
      </RadioButton.Group>
      {hasError && (
        <HelperText type="error" visible={hasError}>
          {t(fieldState.error?.message as never)}
        </HelperText>
      )}
    </View>
  );
}
