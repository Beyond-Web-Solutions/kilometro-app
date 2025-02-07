import { useEffect } from "react";
import {
  LocationAccuracy,
  LocationSubscription,
  watchPositionAsync,
} from "expo-location";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  addSpeed,
  addWaypoint,
  setHeading,
} from "@/src/store/features/current-trip.slice";

export function LocationSubscriber() {
  const dispatch = useAppDispatch();
  const isTracking = useAppSelector((state) => state.current_trip.isTracking);

  useEffect(() => {
    let subscription: Promise<LocationSubscription> | undefined;

    if (isTracking) {
      subscription = watchPositionAsync(
        {
          accuracy: LocationAccuracy.BestForNavigation,
        },
        (location) => {
          console.log(location);

          if (location.coords.speed) {
            dispatch(addSpeed(location.coords.speed));
          }

          if (location.coords.heading) {
            dispatch(setHeading(location.coords.heading));
          }

          dispatch(
            addWaypoint({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }),
          );
        },
      );
    } else {
      subscription?.then((subscription) => subscription.remove());
    }

    return () => {
      subscription?.then((subscription) => subscription.remove());
    };
  }, [isTracking]);

  return null;
}
