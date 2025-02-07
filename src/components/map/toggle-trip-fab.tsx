import { FAB } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { StartTripDialog } from "@/src/components/map/start-trip/dialog";
import { StopTripSheet } from "@/src/components/map/stop-trip/sheet";
import { useForegroundPermissions } from "expo-location";
import { Linking } from "react-native";
import { useAppSelector } from "@/src/store/hooks";

export function ToggleTripFab() {
  const { t } = useTranslation("map");

  const isTracking = useAppSelector((state) => state.current_trip.isTracking);

  const [status, request] = useForegroundPermissions();

  const [isStopTripBottomSheetVisible, setIsStopTripBottomSheetVisible] =
    useState(false);

  const [isStartTripDialogVisible, setIsStartTripDialogVisible] =
    useState(false);

  const handleOnFabPress = useCallback(() => {
    if (isTracking) {
      setIsStopTripBottomSheetVisible(true);
    } else {
      setIsStartTripDialogVisible(true);
    }
  }, [isTracking]);

  const handlePermissionPress = useCallback(async () => {
    if (status?.canAskAgain) {
      await request();
    } else {
      await Linking.openSettings();
    }
  }, [status]);

  if (!status?.granted) {
    return (
      <FAB
        animated={false}
        variant="primary"
        icon="car"
        label={t("start-trip")}
        onPress={handlePermissionPress}
      />
    );
  }

  return (
    <>
      <FAB
        animated={false}
        variant="primary"
        icon={isTracking ? "car-off" : "car"}
        label={isTracking ? t("stop-trip") : t("start-trip")}
        onPress={handleOnFabPress}
      />
      <StartTripDialog
        isVisible={isStartTripDialogVisible}
        hideDialog={() => setIsStartTripDialogVisible(false)}
      />
      <StopTripSheet
        isVisible={isStopTripBottomSheetVisible}
        hideSheet={() => setIsStopTripBottomSheetVisible(false)}
      />
    </>
  );
}
