import { Button, Dialog, FAB, Portal, RadioButton } from "react-native-paper";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { useVehicles } from "@/hooks/use-vehicles";
import { useCurrentTripStore } from "@/store/current-trip";
import { LOCATION_TASK_NAME } from "@/constants/strings";
import { LocationActivityType } from "expo-location";
import * as Location from "expo-location";
import { useStartTripMutation } from "@/hooks/use-start-trip";

export function StartTripDialog() {
  const { t } = useTranslation("map", { keyPrefix: "start-trip" });

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleToggleDialog = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  const { mutate, isPending } = useStartTripMutation(handleToggleDialog);
  const { data, isSuccess } = useVehicles();
  const { isTracking } = useCurrentTripStore();

  const handleStartTrip = useCallback(async () => {
    const vehicle = data?.find((vehicle) => vehicle.id === selectedVehicle);

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });

    if (vehicle) {
      mutate({
        vehicle_id: vehicle.id,
        start_odometer: vehicle.odometer,
        start_point: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    }
  }, [data, selectedVehicle]);

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
          <Dialog.Icon icon="car-select" />
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
              loading={isPending}
              disabled={!selectedVehicle || isPending}
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
