import { LatLng } from "react-native-maps";
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Trip } from "@/src/types/trips";
import { reverseGeocode } from "@/src/hooks/geo/reverse-geocode";
import { store } from "../store";

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

interface CurrentTripState {
  isTracking: boolean;

  first_location: LatLng | null;
  last_location: LatLng | null;

  isFetchingStartLocation: boolean;
  isFetchingStopLocation: boolean;

  route: LatLng[];
  speed: number[];

  currentSpeed: number | null;
  heading: number | null;

  trip: Trip | null;
}

const initialState: CurrentTripState = {
  isTracking: false,

  first_location: null,
  last_location: null,

  isFetchingStartLocation: false,
  isFetchingStopLocation: false,

  route: [],
  speed: [],

  currentSpeed: null,
  heading: null,

  trip: null,
};

export const currentTripSlice = createAppSlice({
  name: "current-trip",
  initialState,
  reducers: (create) => ({
    setTrip: create.reducer((state, action: PayloadAction<Trip>) => {
      state.trip = action.payload;
    }),
    setHeading: create.reducer((state, action: PayloadAction<number>) => {
      state.heading = action.payload;
    }),
    addWaypoint: create.reducer((state, action: PayloadAction<LatLng>) => {
      if (!state.first_location) {
        state.first_location = action.payload;
        store.dispatch(fetchStartLocation(action.payload));
      }

      state.last_location = action.payload;
      state.route.push(action.payload);
    }),
    addSpeed: create.reducer((state, action: PayloadAction<number>) => {
      if (action.payload > 0) {
        state.currentSpeed = action.payload;
        state.speed.push(action.payload);
      }
    }),
    fetchStartLocation: create.asyncThunk(reverseGeocode, {
      pending: (state) => {
        state.isFetchingStartLocation = true;
      },
      rejected: (state) => {
        state.isFetchingStartLocation = false;
      },
      fulfilled: (state, action) => {
        state.isFetchingStartLocation = false;

        const result = action.payload.results[0];

        if (result && state.trip) {
          state.trip.start_place_id = result.place_id;
          state.trip.start_address = result.formatted_address;
        }
      },
    }),
    fetchStopLocation: create.asyncThunk(reverseGeocode, {
      pending: (state) => {
        state.isFetchingStopLocation = true;
      },
      rejected: (state) => {
        state.isFetchingStopLocation = false;
      },
      fulfilled: (state, action) => {
        state.isFetchingStopLocation = false;

        const result = action.payload.results[0];

        if (result && state.trip) {
          state.trip.end_place_id = result.place_id;
          state.trip.end_address = result.formatted_address;
        }
      },
    }),
    startTrip: create.reducer((state, action: PayloadAction<Trip>) => {
      state.isTracking = true;

      state.route = [];
      state.speed = [];

      state.currentSpeed = null;
      state.heading = null;

      state.first_location = null;
      state.last_location = null;

      state.trip = action.payload;
    }),
    stopTrip: create.reducer((state) => {
      state.isTracking = false;

      state.route = [];
      state.speed = [];

      state.currentSpeed = null;
      state.heading = null;

      state.first_location = null;
      state.last_location = null;

      state.trip = null;
    }),
  }),
});

export const {
  addWaypoint,
  addSpeed,
  startTrip,
  stopTrip,
  setHeading,
  setTrip,
  fetchStartLocation,
  fetchStopLocation,
} = currentTripSlice.actions;
