import { supabase } from "@/src/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteOrganizationMember(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrganizationMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations", "members"] });

      onSuccess();
    },
  });
}

async function deleteOrganizationMember(id: string) {
  await supabase.from("organization_members").delete().eq("id", id);
}
