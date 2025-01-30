import { useTranslation } from "react-i18next";
import { Button } from "react-native-paper";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthErrorStore } from "@/store/auth-error";
import { router } from "expo-router";

export function SignOutButton() {
  const { t } = useTranslation("auth");
  const { setError } = useAuthErrorStore();

  const handleSignOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return setError(error.code ?? "unknown");
    }

    return router.replace("/auth/sign-in");
  }, []);

  return <Button onPress={handleSignOut}>{t("sign-out")}</Button>;
}
