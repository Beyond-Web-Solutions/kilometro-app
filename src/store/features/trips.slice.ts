import {
  asyncThunkCreator,
  buildCreateSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { RootState } from "@/src/store/store";
import { getTrips } from "@/src/data/trips/list";
import { Trip } from "@/src/types/trips";

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const tripsAdapter = createEntityAdapter<Trip>();

export const tripsSlice = createAppSlice({
  name: "trips",
  initialState: tripsAdapter.getInitialState({
    isPending: true,
    isRefetching: false,
  }),
  reducers: (create) => ({
    addTrip: create.reducer(tripsAdapter.addOne),
    initTrips: create.asyncThunk(getTrips, {
      pending: (state) => {
        state.isPending = true;
      },
      rejected: (state) => {
        state.isPending = false;
      },
      fulfilled: (state, action) => {
        state.isPending = false;

        if (action.payload) {
          tripsAdapter.setAll(state, action.payload as Trip[]);
        }
      },
    }),
    refetchTrips: create.asyncThunk(getTrips, {
      pending: (state) => {
        state.isRefetching = true;
      },
      rejected: (state) => {
        state.isRefetching = false;
      },
      fulfilled: (state, action) => {
        state.isRefetching = false;

        if (action.payload) {
          tripsAdapter.setAll(state, action.payload as Trip[]);
        }
      },
    }),
  }),
});

export const tripsSelector = tripsAdapter.getSelectors<RootState>(
  (state) => state.trips,
);

export const { initTrips, refetchTrips, addTrip } = tripsSlice.actions;
