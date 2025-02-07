import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { store } from "../store/store";
import {
  addSpeed,
  addWaypoint,
  setHeading,
} from "@/src/store/features/current-trip.slice";

TaskManager.defineTask<{ locations: LocationObject[] }>(
  "TRACK_BACKGROUND_LOCATION",
  async ({ data, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }

    const location = data.locations[0];

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
