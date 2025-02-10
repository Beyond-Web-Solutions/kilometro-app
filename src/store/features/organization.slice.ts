import {
  asyncThunkCreator,
  buildCreateSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/src/store/store";
import { getTrips } from "@/src/data/trips/list";
import { Trip } from "@/src/types/trips";
import { Tables } from "@/src/types/supabase";
import { supabase } from "@/src/lib/supabase";
import { User } from "@supabase/supabase-js";

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const organizationAdapter = createEntityAdapter<Tables<"organizations">>();

export const organizationsSlice = createAppSlice({
  name: "organizations",
  initialState: organizationAdapter.getInitialState<{
    isPending: boolean;
    selected: null | string;
  }>({
    isPending: true,
    selected: null,
  }),
  reducers: (create) => ({
    setSelectedOrganization: create.reducer(
      (state, action: PayloadAction<string | null>) => {
        state.selected = action.payload;
      },
    ),
    fetchOrganizations: create.asyncThunk(
      async (user_id: string | null): Promise<Tables<"organizations">[]> => {
        if (!user_id) {
          return [];
        }

        const { data: members } = await supabase
          .from("organization_members")
          .select("organizations(*)")
          .eq("user_id", user_id);

        return members?.map((member) => member.organizations) ?? [];
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

          organizationAdapter.setAll(state, action.payload);
        },
      },
    ),
  }),
});

export const organizationsSelector =
  organizationAdapter.getSelectors<RootState>((state) => state.organizations);

export const { fetchOrganizations, setSelectedOrganization } =
  organizationsSlice.actions;
