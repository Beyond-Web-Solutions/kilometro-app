import { Control, useController } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import { useCallback, useState } from "react";
import i18n from "@/src/lib/i18n";

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
}

export function DateTimeFormField<T extends FieldValues>({
  control,
  name,
  label,
}: Props<T>) {
  const { t } = useTranslation(["validation", "common"]);

  const { field, fieldState } = useController({
    name,
    control,
  });

  const hasError = Boolean(fieldState.error);

  const [isTimepickerVisible, setIsTimepickerVisible] = useState(false);

  const showTimepicker = useCallback(() => setIsTimepickerVisible(true), []);
  const hideTimepicker = useCallback(() => setIsTimepickerVisible(false), []);

  const date = new Date(field.value);

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.picker_container}>
          <DatePickerInput
            ref={field.ref}
            locale={i18n.language}
            value={field.value}
            onChange={field.onChange}
            hasError={Boolean(fieldState.error)}
            label={label}
            inputMode="end"
            mode="outlined"
            withDateFormatInLabel={false}
            editable={false}
            startWeekOnMonday
            readOnly
          />
        </View>
        <View style={styles.picker_container}>
          <TextInput
            readOnly
            mode="outlined"
            label={label}
            right={
              <TextInput.Icon icon="clock-outline" onPress={showTimepicker} />
            }
            error={Boolean(fieldState.error)}
            value={date.toLocaleTimeString(i18n.language, {
              timeStyle: "short",
            })}
          />
        </View>
      </View>
      {hasError && (
        <HelperText type="error" visible={hasError}>
          {t(fieldState.error?.message as never)}
        </HelperText>
      )}
      <TimePickerModal
        use24HourClock
        confirmLabel={t("common:ok")}
        cancelLabel={t("common:cancel")}
        visible={isTimepickerVisible}
        onDismiss={hideTimepicker}
        onConfirm={({ hours, minutes }) => {
          const newDate = new Date(date);
          newDate.setHours(hours);
          newDate.setMinutes(minutes);

          field.onChange(newDate);
          setIsTimepickerVisible(false);
        }}
        label={label}
        locale={i18n.language}
        animationType="fade"
        hours={date.getHours()}
        minutes={date.getMinutes()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  picker_container: {
    height: 56,
    flex: 1,
  },
});
