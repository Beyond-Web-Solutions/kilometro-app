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
  isRolePending: boolean;
  isProfilePending: boolean;

  user: User | null;
  profile: Tables<"profiles"> | null;
  role: "admin" | "driver" | null;
}

const initialState: AuthState = {
  isAuthPending: true,
  isRolePending: true,
  isProfilePending: true,

  user: null,
  profile: null,
  role: null,
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    setProfile: create.reducer(
      (state, action: PayloadAction<Tables<"profiles"> | null>) => {
        state.profile = action.payload;
      },
    ),
    setUser: create.reducer((state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    }),
    fetchProfile: create.asyncThunk(
      async (user_id: string | null) => {
        if (!user_id) {
          return null;
        }
        const { data } = await supabase
          .from("profiles")
          .select()
          .eq("user_id", user_id)
          .maybeSingle();

        return data;
      },
      {
        pending: (state) => {
          state.isRolePending = true;
        },
        rejected: (state) => {
          state.isRolePending = false;
        },
        fulfilled: (state, action) => {
          state.isRolePending = false;

          state.profile = action.payload ?? null;
        },
      },
    ),
    fetchRole: create.asyncThunk(
      async () => {
        const { data: role } = await supabase.rpc("get_user_role");

        return role as "admin" | "driver" | null | undefined;
      },
      {
        pending: (state) => {
          state.isRolePending = true;
        },
        rejected: (state) => {
          state.isRolePending = false;
        },
        fulfilled: (state, action) => {
          state.isRolePending = false;

          state.role = action.payload ?? null;
        },
      },
    ),
  }),
});

export const { setUser, fetchRole, fetchProfile, setProfile } =
  authSlice.actions;
