import { supabase } from "@/src/lib/supabase";
import { getUser } from "@/src/hooks/auth/user";
import { useMutation } from "@tanstack/react-query";

export function useSetDefaultOrganization(onSuccess: () => Promise<void>) {
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
