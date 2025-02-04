import { Portal, Snackbar } from "react-native-paper";
import { useAuthErrorStore } from "@/src/store/auth-error";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export function AuthErrorToast() {
  const { t } = useTranslation(["auth", "common"]);
  const { error, setError } = useAuthErrorStore();

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <Portal>
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
    </Portal>
  );
}
