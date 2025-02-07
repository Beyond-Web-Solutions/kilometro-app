import { LatLng } from "react-native-maps";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Trip } from "@/src/types/trips";

interface CurrentTripState {
  isTracking: boolean;

  start_point: LatLng | null;

  route: LatLng[];
  speed: number[];

  currentSpeed: number | null;
  heading: number | null;

  trip: Trip | null;
}

const initialState: CurrentTripState = {
  isTracking: false,

  start_point: null,

  route: [],
  speed: [],

  currentSpeed: null,
  heading: null,

  trip: null,
};

export const currentTripSlice = createSlice({
  name: "current-trip",
  initialState,
  reducers: {
    setHeading(state, action: PayloadAction<number>) {
      state.heading = action.payload;
    },
    addWaypoint(state, action: PayloadAction<LatLng>) {
      if (!state.start_point) {
        state.start_point = action.payload;
      }

      state.route.push(action.payload);
    },
    addSpeed(state, action: PayloadAction<number>) {
      if (action.payload > 0) {
        state.currentSpeed = action.payload;
        state.speed.push(action.payload);
      }
    },
    startTrip(state, action: PayloadAction<Trip>) {
      state.isTracking = true;

      state.route = [];
      state.speed = [];

      state.currentSpeed = null;
      state.heading = null;

      state.trip = action.payload;
    },
    stopTrip(state) {
      state.isTracking = false;

      state.route = [];
      state.speed = [];

      state.currentSpeed = null;
      state.heading = null;

      state.trip = null;
    },
  },
});

export const { addWaypoint, addSpeed, startTrip, stopTrip, setHeading } =
  currentTripSlice.actions;
