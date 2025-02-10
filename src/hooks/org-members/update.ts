import { supabase } from "@/src/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/src/types/supabase";

export function useUpdateOrganizationMember(
  onSuccess: (data: Tables<"organization_members"> | null) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganizationMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["organizations", "members"] });

      onSuccess(data);
    },
  });
}

async function updateOrganizationMember(values: {
  id: string;
  role: "driver" | "admin";
  is_accepted: boolean;
}) {
  const { data } = await supabase
    .from("organization_members")
    .update({
      role: values.role,
      is_accepted: values.is_accepted,
    })
    .eq("id", values.id)
    .select()
    .single();

  return data;
}
