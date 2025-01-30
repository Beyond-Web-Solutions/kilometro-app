import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { Portal, Snackbar } from "react-native-paper";
import { useErrorStore } from "@/store/error";

export function ErrorToast() {
  const { t } = useTranslation("common");
  const { error, setError } = useErrorStore();

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <Portal>
      <Snackbar
        visible={!!error}
        onDismiss={dismissError}
        action={{
          label: t("ok"),
          onPress: dismissError,
        }}
      >
        {error}
      </Snackbar>
    </Portal>
  );
}
