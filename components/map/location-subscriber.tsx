import { useCurrentTripStore } from "@/store/current-trip";
import { useEffect } from "react";
import {
  LocationAccuracy,
  LocationSubscription,
  watchPositionAsync,
} from "expo-location";

export function LocationSubscriber() {
  const { isTracking, addWaypoint, addSpeed } = useCurrentTripStore();

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
            addSpeed(location.coords.speed);
          }

          addWaypoint({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
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
