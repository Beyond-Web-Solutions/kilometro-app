import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { LOCATION_TASK_NAME } from "@/constants/strings";

TaskManager.defineTask<{ locations: LocationObject[] }>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      const location = data.locations[0];

      console.log("km/u: ", (location.coords.speed ?? 0) * 3.6);
      console.log(data.locations);
      // do something with the locations captured in the background
    }
  },
);
