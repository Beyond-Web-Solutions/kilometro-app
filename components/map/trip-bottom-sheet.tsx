import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { useTheme } from "react-native-paper";
import { useCurrentTripStore } from "@/store/current-trip";
import { StopTripDialog } from "@/components/map/stop-trip-dialog";

export function TripBottomSheet() {
  const ref = useRef<BottomSheetModal>(null);

  const { colors } = useTheme();
  const { isTracking } = useCurrentTripStore();

  useEffect(() => {
    if (isTracking) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [isTracking]);

  return (
    <BottomSheetModal
      ref={ref}
      enablePanDownToClose={false}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.onSurface }}
    >
      <BottomSheetView>
        <StopTripDialog />
      </BottomSheetView>
    </BottomSheetModal>
  );
}
