import { Control, useController } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { ComponentProps } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

interface Props<T extends FieldValues>
  extends ComponentProps<typeof TextInput> {
  name: FieldPath<T>;
  control: Control<T>;
}

export function TextFormField<T extends FieldValues>({
  control,
  name,
  ...props
}: Props<T>) {
  const { t } = useTranslation("validation");

  const { field, fieldState } = useController({
    name,
    control,
  });

  const hasError = Boolean(fieldState.error);

  return (
    <View>
      <TextInput
        ref={field.ref}
        value={String(field.value)}
        onChangeText={field.onChange}
        error={Boolean(fieldState.error)}
        {...props}
      />
      {hasError && (
        <HelperText type="error" visible={hasError}>
          {t(fieldState.error?.message as never)}
        </HelperText>
      )}
    </View>
  );
}
