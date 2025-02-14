import { ActivityIndicator, List } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSignOut } from "@/src/hooks/auth/sign-out";
import { useCallback } from "react";
import { router } from "expo-router";
import { useAppSelector } from "@/src/store/hooks";
import { isStream } from "minipass";

export function SignOutButton() {
  const { t } = useTranslation("settings", { keyPrefix: "footer" });

  const isTracking = useAppSelector((state) => state.current_trip.isTracking);

  const handleSignOutSuccess = useCallback(() => {
    router.replace("/auth/sign-in");
  }, []);

  const { mutate, isPending } = useSignOut(handleSignOutSuccess);

  return (
    <List.Item
      title={t("sign-out")}
      description={isTracking ? t("cannot-sign-out-while-driving") : null}
      onPress={() => mutate()}
      disabled={isTracking}
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
