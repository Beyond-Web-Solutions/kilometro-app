import { supabase } from "@/src/lib/supabase";
import { getUser } from "@/src/hooks/auth/user";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/src/store/hooks";
import { setSelectedOrganization } from "@/src/store/features/organization.slice";

export function useSetDefaultOrganization(onSuccess: () => void) {
  return useMutation({
    mutationFn: setDefaultOrganization,
    onSuccess,
  });
}

export async function setDefaultOrganization(id: string) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  await supabase.auth.updateUser({
    data: { organization_id: id },
  });

  await supabase.auth.refreshSession();
}
