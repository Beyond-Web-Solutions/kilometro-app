import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { vehiclesSlice } from "@/src/store/features/vehicle.slice";
import { tripsSlice } from "@/src/store/features/trips.slice";
import { currentTripSlice } from "@/src/store/features/current-trip.slice";
import { authSlice } from "@/src/store/features/auth.slice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root", // key for the persisted state
  storage: AsyncStorage, // use AsyncStorage for React Native
};

const rootReducer = combineReducers({
  vehicles: vehiclesSlice.reducer,
  trips: tripsSlice.reducer,
  current_trip: currentTripSlice.reducer,
  auth: authSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types to prevent warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
