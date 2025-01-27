import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { LOCATION_TASK_NAME } from "@/constants/strings";
import { useCurrentTripStore } from "@/store/current-trip";

TaskManager.defineTask<{ locations: LocationObject[] }>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      const store = useCurrentTripStore.getState();
      const location = data.locations[0];

      if (location.coords.speed) {
        store.addSpeed(location.coords.speed);
      }

      store.addRoutePoint({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  },
);
