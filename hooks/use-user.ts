import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
}

async function getUser() {
  const { data } = await supabase.auth.getUser();

  return data;
}
