import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LatLng } from "react-native-maps";

type Store = {
  isTracking: boolean;

  route: LatLng[];
  speed: number[];

  setIsTracking: (isTracking: boolean) => void;
  addWaypoint: (point: LatLng) => void;
  addSpeed: (speed: number) => void;

  stopTrip: () => void;
};

export const useCurrentTripStore = create(
  persist<Store>(
    (set) => ({
      isTracking: false,
      route: [],
      speed: [],

      setIsTracking: (isTracking) => set({ isTracking }),
      stopTrip: () => set({ route: [], isTracking: false }),

      addSpeed: (speed) => set((state) => ({ speed: [...state.speed, speed] })),
      addWaypoint: (location: LatLng) =>
        set((state) => ({
          route: [...state.route, location],
        })),
    }),
    {
      name: "current-trip",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
