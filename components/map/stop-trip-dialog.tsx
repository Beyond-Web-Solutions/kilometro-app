import { Button, Dialog, Portal, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useCurrentTripStore } from "@/store/current-trip";
import { encode } from "@googlemaps/polyline-codec";

export function StopTripDialog() {
  const { t } = useTranslation("map", { keyPrefix: "stop-trip" });

  const { route, speed, stopTrip } = useCurrentTripStore();

  const [isVisible, setIsVisible] = useState(false);

  const toggleDialog = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const handleStopTrip = useCallback(() => {
    const codec = encode(
      route.map((point) => [point.latitude, point.longitude]),
    );

    console.log(codec);
    stopTrip();
  }, []);

  return (
    <>
      <Button mode="contained-tonal" onPress={toggleDialog}>
        {t("button")}
      </Button>

      <Portal>
        <Dialog visible={isVisible} onDismiss={toggleDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={styles.text}>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.text}>
              {t("dialog-description")}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={toggleDialog}>{t("cancel")}</Button>
            <Button mode="contained" onPress={handleStopTrip}>
              {t("stop")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
  },
});
