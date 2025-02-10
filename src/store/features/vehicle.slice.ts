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
  }),
  reducers: (create) => ({
    addVehicle: create.reducer(vehiclesAdapter.addOne),
    updateVehicle: create.reducer(vehiclesAdapter.updateOne),
    deleteVehicle: create.reducer(vehiclesAdapter.removeOne),

    fetchVehicles: create.asyncThunk(getVehicles, {
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
  }),
});

export const vehiclesSelector = vehiclesAdapter.getSelectors<RootState>(
  (state) => state.vehicles,
);

export const { addVehicle, updateVehicle, deleteVehicle, fetchVehicles } =
  vehiclesSlice.actions;
