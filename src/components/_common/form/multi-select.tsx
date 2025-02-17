import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { Control, useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Checkbox,
  Dialog,
  HelperText,
  Portal,
  TextInput,
} from "react-native-paper";
import { useMemo, useState } from "react";

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  values: { value: string; label: string }[];
  defaultValue?: string[];
}

export function MultiSelectFormField<T extends FieldValues>({
  name,
  control,
  label,
  values,
  defaultValue,
}: Props<T>) {
  const { t } = useTranslation(["validation", "common"]);

  const { field, fieldState } = useController<T>({
    name,
    control,
  });

  const hasError = Boolean(fieldState.error);

  const [isVisible, setIsVisible] = useState(false);

  const value = useMemo(() => {
    const value = field.value as string[];

    return value.map(
      (v) => values.find((item) => item.value === v)?.label ?? v,
    );
  }, [field.value]);

  return (
    <View>
      <TextInput
        ref={field.ref}
        onChangeText={field.onChange}
        error={Boolean(fieldState.error)}
        mode="outlined"
        value={value.join(", ")}
        label={label}
        right={
          <TextInput.Icon icon="pencil" onPress={() => setIsVisible(true)} />
        }
        readOnly
      />
      {hasError && (
        <HelperText type="error" visible={hasError}>
          {t(fieldState.error?.message as never)}
        </HelperText>
      )}
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Title>{label}</Dialog.Title>
          <Dialog.ScrollArea style={styles.container}>
            <ScrollView>
              {values.map((item) => (
                <Checkbox.Item
                  style={styles.checkbox_item}
                  mode="android"
                  key={item.value}
                  label={item.label}
                  onPress={() => {
                    field.onChange(
                      field.value.includes(item.value)
                        ? field.value.filter((v: any) => v !== item.value)
                        : [...field.value, item.value],
                    );
                  }}
                  status={
                    field.value.includes(item.value) ? "checked" : "unchecked"
                  }
                />
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              onPress={() => {
                if (defaultValue) {
                  field.onChange(defaultValue);
                }

                setIsVisible(false);
              }}
            >
              {t("common:cancel")}
            </Button>
            <Button onPress={() => setIsVisible(false)}>
              {t("common:ok")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  checkbox_item: {
    marginHorizontal: 8,
  },
});
