import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { LOCATION_TRACKING } from "@/constants/strings";
import { useCurrentTripStore } from "@/store/current-trip";

TaskManager.defineTask<{ locations: LocationObject[] }>(
  LOCATION_TRACKING,
  async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    const store = useCurrentTripStore.getState();

    if (data && store.isTracking) {
      const location = data.locations[0];

      store.addWaypoint({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (location.coords.speed) {
        store.addSpeed(location.coords.speed);
      }
    }
  },
);
