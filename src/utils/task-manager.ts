import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import {
  addSpeed,
  addWaypoint,
  setHeading,
} from "@/src/store/features/current-trip.slice";
import { store } from "@/src/store/store";

export const LOCATION_TASK_NAME = "track-user-location";

TaskManager.defineTask<{ locations: LocationObject[] }>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    const location = data.locations[0];

    if (!location) return;

    console.log(location);

    if (location.coords.speed) {
      store.dispatch(addSpeed(location.coords.speed));
    }

    if (location.coords.heading) {
      store.dispatch(setHeading(location.coords.heading));
    }

    if (location.coords) {
      store.dispatch(
        addWaypoint({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      );
    }
  },
);
