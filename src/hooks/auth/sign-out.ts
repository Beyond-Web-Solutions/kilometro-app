import { supabase } from "@/src/lib/supabase";
import { useAuthErrorStore } from "@/src/store/auth-error";
import { useMutation } from "@tanstack/react-query";

export function useSignOut(onSuccess: () => void) {
  return useMutation({
    mutationFn: signOut,
    onSuccess,
  });
}

async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    const store = useAuthErrorStore.getState();
    store.setError(error.code ?? "unknown");

    throw new Error(error.message);
  }
}
