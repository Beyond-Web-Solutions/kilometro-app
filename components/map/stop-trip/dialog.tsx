import {
  Button,
  Dialog,
  Divider,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useCurrentTripStore } from "@/store/current-trip";
import { formatOdometer } from "@/utils/format";
import { SegmentedButtonsField } from "@/components/_common/form/segmented-buttons";
import {
  StopTripFormData,
  stopTripSchema,
} from "@/constants/definitions/trip/stop";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  startOdometer: number;
}

export function StopTripDialog({ startOdometer }: Props) {
  const { t } = useTranslation("map", { keyPrefix: "stop-trip" });

  const { setIsTracking, route } = useCurrentTripStore();

  const [isVisible, setIsVisible] = useState(false);

  const handleToggleDialog = useCallback(() => {
    setIsVisible((prevState) => {
      setIsTracking(prevState);
      return !prevState;
    });
  }, [isVisible]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StopTripFormData>({
    resolver: zodResolver(stopTripSchema),
    defaultValues: { type: "business" },
  });

  return (
    <>
      <Button
        icon="car-off"
        mode="contained-tonal"
        onPress={handleToggleDialog}
      >
        {t("button")}
      </Button>
      <Portal>
        <Dialog visible={isVisible} onDismiss={handleToggleDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={styles.text}>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content style={styles.form_container}>
            <SegmentedButtonsField<StopTripFormData>
              name="type"
              control={control}
              buttons={[
                {
                  label: t("form.type.options.business"),
                  value: "business",
                  icon: "briefcase",
                },
                {
                  label: t("form.type.options.private"),
                  value: "private",
                  icon: "account",
                },
              ]}
            />
            <Divider style={styles.divider} />

            <TextInput
              readOnly
              label={t("form.start_odometer.label")}
              value={formatOdometer(startOdometer)}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={handleToggleDialog}>{t("cancel")}</Button>
            <Button mode="contained">{t("stop")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  form_container: {
    gap: 8,
  },
  scroll_container: {
    paddingHorizontal: 0,
  },
  text: {
    textAlign: "center",
  },

  divider: {
    marginVertical: 8,
  },
});
