import { Control, useController } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { DatePickerModal } from "react-native-paper-dates";
import { ExportTripFormData } from "@/src/constants/definitions/trip/export";
import i18n from "@/src/lib/i18n";

interface Props {
  control: Control<ExportTripFormData>;
  label: string;
}

export function DateRangeFormField({ control, label }: Props) {
  const { t } = useTranslation("validation");

  const { field, fieldState } = useController({
    name: "range",
    control,
  });

  const hasError = Boolean(fieldState.error);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        readOnly
        value={`${field.value.from.toLocaleDateString(i18n.language, { dateStyle: "medium" })} - ${field.value.to.toLocaleDateString(i18n.language, { dateStyle: "medium" })}`}
        right={
          <TextInput.Icon
            icon="calendar"
            onPress={() => setIsDatePickerVisible(true)}
          />
        }
      />
      <DatePickerModal
        locale={i18n.language}
        mode="range"
        visible={isDatePickerVisible}
        onDismiss={() => setIsDatePickerVisible(false)}
        startDate={field.value.from}
        endDate={field.value.to}
        withDateFormatInLabel={false}
        startWeekOnMonday
        label={label}
        onConfirm={({ startDate, endDate }) => {
          field.onChange({ from: startDate, to: endDate });
          setIsDatePickerVisible(false);
        }}
      />
      {hasError && (
        <HelperText type="error" visible={hasError}>
          {t(fieldState.error?.message as never)}
        </HelperText>
      )}
    </View>
  );
}
