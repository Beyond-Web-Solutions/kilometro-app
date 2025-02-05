import { supabase } from "@/src/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateOrganizationMember(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganizationMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations", "members"] });

      onSuccess();
    },
  });
}

async function updateOrganizationMember(data: {
  id: string;
  role: "driver" | "admin";
}) {
  await supabase
    .from("organization_members")
    .update({
      role: data.role,
    })
    .eq("id", data.id);

  return data;
}
