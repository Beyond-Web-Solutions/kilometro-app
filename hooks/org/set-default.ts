import { supabase } from "@/lib/supabase";
import { getUser } from "@/hooks/auth/user";
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

  await supabase
    .from("organization_members")
    .update({ is_default: false })
    .eq("user_id", user.id);

  await supabase
    .from("organization_members")
    .update({
      is_default: true,
    })
    .eq("user_id", user.id)
    .eq("organization_id", id);
}
