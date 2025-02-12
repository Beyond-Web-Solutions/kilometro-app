import { useKeepAwake } from "expo-keep-awake";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useCallback, useEffect, useState } from "react";
import {
  LocationAccuracy,
  LocationObject,
  LocationSubscription,
  watchPositionAsync,
} from "expo-location";
import { store } from "@/src/store/store";
import {
  addSpeed,
  addWaypoint,
  setHeading,
} from "@/src/store/features/current-trip.slice";

export function useLocationSubscriber() {
  useKeepAwake();

  const dispatch = useAppDispatch();
  const isTracking = useAppSelector((state) => state.current_trip.isTracking);

  const [subscription, setSubscription] = useState<LocationSubscription>();

  const handleLocationUpdates = useCallback((location: LocationObject) => {
    if (location.coords.speed) {
      dispatch(addSpeed(location.coords.speed));
    }

    if (location.coords.heading) {
      dispatch(setHeading(location.coords.heading));
    }

    if (location.coords) {
      dispatch(
        addWaypoint({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (isTracking) {
      watchPositionAsync(
        {
          accuracy: LocationAccuracy.BestForNavigation,
        },
        handleLocationUpdates,
      ).then(setSubscription);
    }

    if (!isTracking && subscription) {
      subscription.remove();
      setSubscription(undefined);
    }

    return () => {
      subscription?.remove();
    };
  }, [isTracking, subscription]);
}
