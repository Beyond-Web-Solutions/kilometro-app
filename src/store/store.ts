import { configureStore } from "@reduxjs/toolkit";
import { vehiclesSlice } from "@/src/store/features/vehicle.slice";
import { tripsSlice } from "@/src/store/features/trips.slice";
import { currentTripSlice } from "@/src/store/features/current-trip.slice";
import { authSlice } from "@/src/store/features/auth.slice";

export const store = configureStore({
  reducer: {
    vehicles: vehiclesSlice.reducer,
    trips: tripsSlice.reducer,
    current_trip: currentTripSlice.reducer,
    auth: authSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
