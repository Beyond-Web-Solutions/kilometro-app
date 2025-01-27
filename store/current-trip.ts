import { create } from "zustand";
import { LatLng } from "react-native-maps";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Store = {
  isTracking: boolean;

  route: LatLng[];
  speed: number[];

  setIsTracking: (isTracking: boolean) => void;
  addRoutePoint: (point: LatLng) => void;
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
      stopTrip: () => set({ route: [], speed: [] }),
      addSpeed: (speed) => set((store) => ({ speed: [...store.speed, speed] })),
      addRoutePoint: (point) =>
        set((store) => ({ route: [...store.route, point] })),
    }),
    {
      name: "current-trip",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
