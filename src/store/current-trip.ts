import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LatLng } from "react-native-maps";

type Store = {
  isTracking: boolean;

  route: LatLng[];
  currentSpeed: number | null;
  speed: number[];
  heading: number | null;

  setIsTracking: (isTracking: boolean) => void;
  setHeading: (heading: number) => void;
  addWaypoint: (point: LatLng) => void;
  addSpeed: (speed: number) => void;

  startTrip: () => void;
  stopTrip: () => void;
};

export const useCurrentTripStore = create(
  persist<Store>(
    (set) => ({
      isTracking: false,
      route: [],
      speed: [],
      currentSpeed: null,
      heading: null,

      startTrip: () =>
        set({ isTracking: true, route: [], speed: [], currentSpeed: null }),
      stopTrip: () =>
        set({ isTracking: false, route: [], speed: [], currentSpeed: null }),

      setIsTracking: (isTracking) => set({ isTracking }),
      setHeading: (heading) => set({ heading }),
      addSpeed: (speed) =>
        set((state) => ({
          speed: [...state.speed, speed],
          currentSpeed: speed,
        })),
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
