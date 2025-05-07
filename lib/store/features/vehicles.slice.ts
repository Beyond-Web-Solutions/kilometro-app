import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { vehicles } from "@/lib/db/schema";
import { vehiclesApi } from "@/lib/store/api/vehicles";
import { authClient } from "@/lib/auth/client";

export const fetchVehicles = createAsyncThunk("vehicles", async () => {
  const { data } = await authClient.token();

  return;
});

export const vehicleAdapter =
  createEntityAdapter<typeof vehicles.$inferSelect>();

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: vehicleAdapter.getInitialState<{
    status: "idle" | "pending" | "succeeded" | "failed";
  }>({
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
      });
  },
});

export const vehicleSelector = vehicleAdapter.getSelectors();

export default vehicleSlice.reducer;
