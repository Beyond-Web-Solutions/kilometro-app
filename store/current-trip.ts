import { create } from "zustand";
import { LatLng } from "react-native-maps";

type Store = {
  tripId: string | null;
  isTracking: boolean;
  route: LatLng[];
  speed: number[];
  startedAt: number | null;
  vehicle: string | null;

  setTripId: (tripId: string | null) => void;

  addRoutePoint: (point: LatLng) => void;
  addSpeed: (speed: number) => void;

  startTrip: (tripId: string, vehicle: string) => void;
  stopTrip: () => void;
};

export const useCurrentTripStore = create<Store>((set) => ({
  tripId: null,
  isTracking: false,
  route: [],
  startedAt: null,
  speed: [],
  vehicle: null,

  setTripId: (tripId) => set({ tripId }),

  addRoutePoint: (point) =>
    set((store) => ({ route: [...store.route, point] })),
  addSpeed: (speed) => set((store) => ({ speed: [...store.speed, speed] })),

  startTrip: (tripId, vehicle) =>
    set({ tripId, isTracking: true, vehicle, startedAt: new Date().getTime() }),
  stopTrip: () =>
    set({
      tripId: null,
      isTracking: false,
      route: [],
      startedAt: null,
      speed: [],
      vehicle: null,
    }),
}));
