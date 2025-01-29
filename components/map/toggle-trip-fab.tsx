import { FAB } from "react-native-paper";
import { useCurrentTripStore } from "@/store/current-trip";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { StartTripDialog } from "@/components/map/start-trip/dialog";
import { StopTripSheet } from "@/components/map/stop-trip/sheet";

export function ToggleTripFab() {
  const { t } = useTranslation("map");
  const { isTracking } = useCurrentTripStore();

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
