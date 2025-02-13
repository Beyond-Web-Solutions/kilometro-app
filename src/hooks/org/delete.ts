import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAppDispatch } from "@/src/store/hooks";
import {
  deleteOrganization as deleteOrganizationAction,
  setSelectedOrganization,
} from "@/src/store/features/organization.slice";
import { fetchRole } from "@/src/store/features/auth.slice";

export function useDeleteOrganization(id: string, onSuccess?: () => void) {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => deleteOrganization(id),
    onSuccess: () => {
      dispatch(deleteOrganizationAction(id));
      dispatch(setSelectedOrganization(null));
      dispatch(fetchRole());

      if (onSuccess) {
        onSuccess();
      }
    },
  });
}

async function deleteOrganization(id: string) {
  const { error } = await supabase.from("organizations").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}
