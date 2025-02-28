import { ReactNode, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchIsAccepted,
  fetchProfile,
  fetchRole,
  setUser,
} from "@/src/store/features/auth.slice";
import {
  fetchOrganizations,
  setSelectedOrganization,
} from "@/src/store/features/organization.slice";
import { fetchTrips } from "@/src/store/features/trips.slice";
import { fetchVehicles } from "@/src/store/features/vehicle.slice";
import { fetchOrganizationMembers } from "@/src/store/features/organization-members.slice";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  const organization = useAppSelector((state) => state.organizations.selected);

  useEffect(() => {
    if (organization) {
      dispatch(fetchTrips(organization));
      dispatch(fetchOrganizationMembers(organization));
      dispatch(fetchVehicles(organization));
    }
  }, [organization]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const user = session?.user;

      // first get the user from the session and set it in the state
      dispatch(setUser(user ?? null));

      // if the user is authenticated, fetch the user's role
      dispatch(fetchRole());

      const organizationId = session?.user?.user_metadata.organization_id as
        | string
        | null;

      // set the selected organization based on the organization_id in the user_metadata
      dispatch(setSelectedOrganization(organizationId));

      // fetch the trips, vehicles and other data
      dispatch(fetchProfile(user?.id ?? null));
      dispatch(fetchOrganizations(user?.id ?? null));
      dispatch(fetchIsAccepted());
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return children;
}
