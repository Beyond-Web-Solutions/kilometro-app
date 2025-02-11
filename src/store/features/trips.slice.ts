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

const tripsAdapter = createEntityAdapter<Trip>({
  sortComparer: (a, b) => {
    const startedAtA = new Date(a.started_at!).getTime();
    const startedAtB = new Date(b.started_at!).getTime();

    return startedAtB - startedAtA;
  },
});

export const tripsSlice = createAppSlice({
  name: "trips",
  initialState: tripsAdapter.getInitialState({
    isPending: true,
  }),
  reducers: (create) => ({
    addTrip: create.reducer(tripsAdapter.addOne),
    deleteTrip: create.reducer(tripsAdapter.removeOne),
    fetchTrips: create.asyncThunk(getTrips, {
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
  }),
});

export const tripsSelector = tripsAdapter.getSelectors<RootState>(
  (state) => state.trips,
);

export const { addTrip, deleteTrip, fetchTrips } = tripsSlice.actions;
