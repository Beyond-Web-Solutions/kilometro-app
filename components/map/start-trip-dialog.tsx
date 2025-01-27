import { Button, Dialog, FAB, Portal, RadioButton } from "react-native-paper";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { useVehicles } from "@/hooks/use-vehicles";
import { useCurrentTripStore } from "@/store/current-trip";
import { LOCATION_TASK_NAME } from "@/constants/strings";
import * as Location from "expo-location";
import { LocationActivityType } from "expo-location";

export function StartTripDialog() {
  const { t } = useTranslation("map", { keyPrefix: "start-trip" });
  const { data, isSuccess } = useVehicles();
  const { isTracking, startTrip } = useCurrentTripStore();

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleToggleDialog = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  const handleStartTrip = useCallback(async () => {
    if (selectedVehicle) {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
          setIsVisible(false);

          startTrip(selectedVehicle);

          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            activityType: LocationActivityType.AutomotiveNavigation,
            showsBackgroundLocationIndicator: true,
            accuracy: Location.Accuracy.BestForNavigation,
          });
        }
      }
    }
  }, [selectedVehicle, setIsVisible]);

  return (
    <>
      <FAB
        icon="car"
        visible={!isTracking}
        label={t("button")}
        disabled={!isSuccess}
        onPress={handleToggleDialog}
      />
      <Portal>
        <Dialog visible={isVisible} onDismiss={handleToggleDialog}>
          <Dialog.Icon icon="car" />
          <Dialog.Title style={styles.text}>{t("dialog-title")}</Dialog.Title>
          {data && (
            <Dialog.ScrollArea style={styles.scroll_container}>
              <ScrollView>
                <RadioButton.Group
                  onValueChange={setSelectedVehicle}
                  value={selectedVehicle ?? ""}
                >
                  {data.map((vehicle) => (
                    <RadioButton.Item
                      style={styles.radio_button}
                      key={vehicle.id}
                      label={vehicle.name}
                      value={vehicle.id}
                    />
                  ))}
                </RadioButton.Group>
              </ScrollView>
            </Dialog.ScrollArea>
          )}

          <Dialog.Actions>
            <Button onPress={handleToggleDialog}>{t("cancel")}</Button>
            <Button
              onPress={handleStartTrip}
              mode="contained"
              disabled={!selectedVehicle}
            >
              {t("start")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  radio_button: {
    paddingHorizontal: 24,
  },
  scroll_container: {
    paddingHorizontal: 0,
  },
  text: {
    textAlign: "center",
  },
});
