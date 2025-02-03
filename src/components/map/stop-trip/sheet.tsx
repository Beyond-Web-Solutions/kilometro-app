import { useEffect, useRef } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "react-native-paper";
import { useCurrentTrip } from "@/src/hooks/trip/current";
import { LoadingTripDetails } from "@/src/components/map/stop-trip/loading";
import { StopTripForm } from "@/src/components/map/stop-trip/form";

interface Props {
  isVisible: boolean;
  hideSheet: () => void;
}

export function StopTripSheet({ isVisible, hideSheet }: Props) {
  const ref = useRef<BottomSheetModal>(null);

  const { data, isPending } = useCurrentTrip();
  const { colors } = useTheme();

  useEffect(() => {
    if (isVisible) {
      ref.current?.present();
    }
  }, [isVisible]);

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={hideSheet}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.onSurface }}
    >
      <BottomSheetView>
        {isPending && <LoadingTripDetails />}
        {data && (
          <StopTripForm
            trip={data}
            closeBottomSheet={() => ref.current?.dismiss()}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
