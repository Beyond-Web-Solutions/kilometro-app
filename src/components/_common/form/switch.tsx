import { Control, useController } from "react-hook-form";
import { HelperText, Switch, Text } from "react-native-paper";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
}

export function SwitchFormField<T extends FieldValues>({
  control,
  name,
  label,
}: Props<T>) {
  const { t } = useTranslation("validation");

  const { field, fieldState } = useController({
    name,
    control,
  });

  const hasError = Boolean(fieldState.error);

  return (
    <View>
      <View style={styles.row}>
        <Text variant="bodyLarge">{label}</Text>
        <Switch value={field.value} onValueChange={field.onChange} />
      </View>
      {hasError && (
        <HelperText type="error" visible={hasError}>
          {t(fieldState.error?.message as never)}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
