import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { router, Stack } from "expo-router";

export default function AuthLayout() {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/(tabs)");
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
}
