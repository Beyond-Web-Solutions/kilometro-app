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

type Member = Tables<"organization_members"> & { profiles: Tables<"profiles"> };

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const organizationMembersAdapter = createEntityAdapter<Member>();

export const organizationMemberSlice = createAppSlice({
  name: "organization_members",
  initialState: organizationMembersAdapter.getInitialState({
    isPending: true,
  }),
  reducers: (create) => ({
    deleteOrganizationMember: create.reducer(
      organizationMembersAdapter.removeOne,
    ),
    updateOrganizationMember: create.reducer(
      organizationMembersAdapter.updateOne,
    ),
    fetchOrganizationMembers: create.asyncThunk(
      async (organization_id: string) => {
        const { data } = await supabase
          .from("organization_members")
          .select("*, profiles(*)")
          .eq("organization_id", organization_id);

        return data;
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

          organizationMembersAdapter.setAll(state, action.payload ?? []);
        },
      },
    ),
  }),
});

export const organizationMembersSelector =
  organizationMembersAdapter.getSelectors<RootState>(
    (state) => state.organization_members,
  );

export const {
  fetchOrganizationMembers,
  updateOrganizationMember,
  deleteOrganizationMember,
} = organizationMemberSlice.actions;
