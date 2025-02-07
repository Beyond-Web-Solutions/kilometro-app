import { User } from "@supabase/supabase-js";
import {
  asyncThunkCreator,
  buildCreateSlice,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "@/src/lib/supabase";

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

interface AuthState {
  isPending: boolean;

  user: User | null;
  role: "admin" | "driver" | null;
}

const initialState: AuthState = {
  isPending: true,

  user: null,
  role: null,
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    setUser: create.reducer((state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    }),

    initAuth: create.asyncThunk(
      async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data } = await supabase.rpc("get_user_role");

        const role = data as "admin" | "driver" | null | undefined;

        return { user, role: role ?? null };
      },
      {
        pending: (state) => {
          state.isPending = true;
        },
        rejected: (state) => {
          state.isPending = false;
        },
        fulfilled: (state, action) => {
          state.isPending = false;

          state.user = action.payload.user;
          state.role = action.payload.role ?? null;
        },
      },
    ),
  }),
});

export const { setUser, initAuth } = authSlice.actions;
