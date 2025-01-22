import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { router, Tabs } from "expo-router";

export default function TabsLayout() {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.replace("/(auth)/sign-in");
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return <Tabs />;
}
