import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";

export function useAuthState() {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.replace("/auth/sign-in");
      }

      if (!session) {
        router.replace("/auth/sign-in");
      }

      if (session) {
        router.replace("/(tabs)");
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
}
