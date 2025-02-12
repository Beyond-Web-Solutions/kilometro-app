import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  List,
  Portal,
  Snackbar,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useAppSelector } from "@/src/store/hooks";
import { Redirect } from "expo-router";
import { organizationsSelector } from "@/src/store/features/organization.slice";
import { setStringAsync } from "expo-clipboard";

export function ShowOrganizationJoinCode() {
  const selected = useAppSelector((state) => state.organizations.selected);

  if (!selected) {
    return <Redirect href="/onboard" />;
  }

  const org = useAppSelector((state) =>
    organizationsSelector.selectById(state, selected),
  );
  const { colors, roundness } = useTheme();
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.join-code",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isCopiedSnackbarVisible, setIsCopiedSnackbarVisible] = useState(false);

  return (
    <>
      <List.Item
        title={t("title")}
        left={(props) => <List.Icon {...props} icon="shield-key" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => setIsVisible(true)}
      />
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="account-plus" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content style={styles.dialog_content}>
            <Text>{t("dialog-description")}</Text>
            <TouchableRipple
              onPress={() => {
                setStringAsync(org.code).then(() => {
                  setIsCopiedSnackbarVisible(true);
                });
              }}
              style={[
                styles.code_container,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: roundness,
                },
              ]}
            >
              <Text variant="labelLarge">{org.code}</Text>
            </TouchableRipple>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>{t("ok")}</Button>
          </Dialog.Actions>
        </Dialog>
        <Snackbar
          visible={isCopiedSnackbarVisible}
          onDismiss={() => setIsCopiedSnackbarVisible(false)}
          action={{
            label: t("ok"),
            onPress: () => setIsCopiedSnackbarVisible(false),
          }}
        >
          {t("copied-to-clipboard")}
        </Snackbar>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  dialog_content: {
    gap: 8,
  },
  code_container: {
    padding: 8,
    marginTop: 8,
    alignItems: "center",
  },
});
