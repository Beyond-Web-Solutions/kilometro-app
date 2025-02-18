import { useEffect, useRef } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "react-native-paper";
import { StopTripForm } from "@/src/components/map/stop-trip/form";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { updateTripStartLocation } from "@/src/utils/trips/update-start-location";
import {
  fetchStartLocation,
  fetchStopLocation,
} from "@/src/store/features/current-trip.slice";

interface Props {
  isVisible: boolean;
  hideSheet: () => void;
}

export function StopTripSheet({ isVisible, hideSheet }: Props) {
  const ref = useRef<BottomSheetModal>(null);

  const dispatch = useAppDispatch();
  const trip = useAppSelector((state) => state.current_trip.trip);
  const start = useAppSelector((state) => state.current_trip.first_location);
  const end = useAppSelector((state) => state.current_trip.last_location);

  const { colors } = useTheme();

  useEffect(() => {
    if (isVisible) {
      ref.current?.present();

      if (end) {
        dispatch(fetchStopLocation(end));
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (start && trip && !trip.start_place_id) {
      dispatch(fetchStartLocation(start));
    }
  }, [start, trip]);

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={hideSheet}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.onSurface }}
    >
      <BottomSheetView>
        {trip && (
          <StopTripForm
            trip={trip}
            closeBottomSheet={() => ref.current?.dismiss()}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
