import { User } from "@supabase/supabase-js";
import {
  asyncThunkCreator,
  buildCreateSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/src/types/supabase";

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

interface AuthState {
  isAuthPending: boolean;
  isProfilePending: boolean;
  isOrganizationPending: boolean;

  organization: Tables<"organizations"> | null;
  user: User | null;
  role: "admin" | "driver" | null;
}

const initialState: AuthState = {
  isAuthPending: true,
  isProfilePending: true,
  isOrganizationPending: true,

  organization: null,
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
    fetchRole: create.asyncThunk(
      async () => {
        const { data: role } = await supabase.rpc("get_user_role");

        return role as "admin" | "driver" | null | undefined;
      },
      {
        pending: (state) => {
          state.isProfilePending = true;
        },
        rejected: (state) => {
          state.isProfilePending = false;
        },
        fulfilled: (state, action) => {
          state.isProfilePending = false;
          state.role = action.payload ?? null;
        },
      },
    ),
    fetchAuth: create.asyncThunk(supabase.auth.getUser, {
      pending: (state) => {
        state.isAuthPending = true;
      },
      rejected: (state) => {
        state.isAuthPending = false;
      },
      fulfilled: (state, action) => {
        state.isAuthPending = false;

        if (action.payload.data.user) {
          state.user = action.payload.data.user;
        }
      },
    }),
  }),
});

export const { setUser, fetchAuth, fetchRole } = authSlice.actions;
