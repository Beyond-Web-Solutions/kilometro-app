import {
  asyncThunkCreator,
  buildCreateSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { Tables } from "@/src/types/supabase";
import { RootState } from "../store";
import { getVehicles } from "@/src/data/vehicles/list";

type Vehicle = Tables<"vehicles">;

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const vehiclesAdapter = createEntityAdapter<Vehicle>();

export const vehiclesSlice = createAppSlice({
  name: "vehicles",
  initialState: vehiclesAdapter.getInitialState({
    isPending: true,
    isRefetching: false,
  }),
  reducers: (create) => ({
    initVehicles: create.asyncThunk(getVehicles, {
      pending: (state) => {
        state.isPending = true;
      },
      rejected: (state) => {
        state.isPending = false;
      },
      fulfilled: (state, action) => {
        state.isPending = false;

        if (action.payload) {
          vehiclesAdapter.setAll(state, action.payload);
        }
      },
    }),
    refetchVehicles: create.asyncThunk(getVehicles, {
      pending: (state) => {
        state.isRefetching = true;
      },
      rejected: (state) => {
        state.isRefetching = false;
      },
      fulfilled: (state, action) => {
        state.isRefetching = false;

        if (action.payload) {
          vehiclesAdapter.setAll(state, action.payload);
        }
      },
    }),
  }),
});

export const vehiclesSelector = vehiclesAdapter.getSelectors<RootState>(
  (state) => state.vehicles,
);

export const { initVehicles, refetchVehicles } = vehiclesSlice.actions;
