import { configureStore } from "@reduxjs/toolkit";
import { vehiclesApi } from "@/lib/store/api/vehicles";

export const store = configureStore({
  reducer: {
    [vehiclesApi.reducerPath]: vehiclesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(vehiclesApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
