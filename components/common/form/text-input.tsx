import {
  HelperText,
  TextInput as Input,
  TextInputProps,
  useTheme,
} from "react-native-paper";
import { Control, FieldValues, useController } from "react-hook-form";
import { FieldPath } from "react-hook-form/dist/types";
import { View } from "react-native";

interface Props<V extends FieldValues> extends TextInputProps {
  name: FieldPath<V>;
  control: Control<V>;
}

export function TextInput<V extends FieldValues>({
  name,
  control,
  ...props
}: Props<V>) {
  const { colors } = useTheme();
  const { field, fieldState } = useController({
    name,
    control,
  });

  return (
    <View>
      <Input
        ref={field.ref}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        right={
          fieldState.invalid && (
            <Input.Icon icon="alert-circle" color={colors.error} />
          )
        }
        error={fieldState.invalid}
        disabled={field.disabled}
        aria-disabled={field.disabled}
        {...props}
      />
      <HelperText
        type="error"
        disabled={field.disabled}
        visible={fieldState.invalid}
      >
        {fieldState.error?.message}
      </HelperText>
    </View>
  );
}
