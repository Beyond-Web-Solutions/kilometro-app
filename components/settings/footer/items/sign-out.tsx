import { ActivityIndicator, List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSignOut } from "@/hooks/auth/sign-out";
import { useCallback } from "react";
import { router } from "expo-router";

export function SignOutButton() {
  const { t } = useTranslation("settings", { keyPrefix: "footer" });

  const handleSignOutSuccess = useCallback(() => {
    router.replace("/auth/sign-in");
  }, []);

  const { mutate, isPending } = useSignOut(handleSignOutSuccess);

  return (
    <List.Item
      title={t("sign-out")}
      onPress={() => mutate()}
      left={(props) => <List.Icon {...props} icon="logout" />}
      right={(props) =>
        isPending ? (
          <ActivityIndicator {...props} size="small" />
        ) : (
          <List.Icon {...props} icon="chevron-right" />
        )
      }
    />
  );
}
