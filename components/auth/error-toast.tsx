import { Snackbar } from "react-native-paper";
import { useAuthErrorStore } from "@/store/auth-error";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export function AuthErrorToast() {
  const { t } = useTranslation(["auth", "common"]);
  const { error, setError } = useAuthErrorStore();

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <Snackbar
      visible={!!error}
      onDismiss={dismissError}
      action={{
        label: t("common:ok"),
        onPress: dismissError,
      }}
    >
      {t(`auth:errors.${error}` as never)}
    </Snackbar>
  );
}
