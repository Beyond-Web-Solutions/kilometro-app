import { create } from "zustand";
import { LatLng } from "react-native-maps";

type Store = {
  isTracking: boolean;
  route: LatLng[];
  speed: number[];
  startedAt: number | null;
  vehicle: string | null;

  addRoutePoint: (point: LatLng) => void;
  addSpeed: (speed: number) => void;

  startTrip: (vehicle: string) => void;
  stopTrip: () => void;
};

export const useCurrentTripStore = create<Store>((set) => ({
  isTracking: false,
  route: [],
  startedAt: null,
  speed: [],
  vehicle: null,

  addRoutePoint: (point) =>
    set((store) => ({ route: [...store.route, point] })),
  addSpeed: (speed) => set((store) => ({ speed: [...store.speed, speed] })),

  startTrip: (vehicle) =>
    set({ isTracking: true, vehicle, startedAt: new Date().getTime() }),
  stopTrip: () =>
    set({
      isTracking: false,
      route: [],
      startedAt: null,
      speed: [],
      vehicle: null,
    }),
}));
