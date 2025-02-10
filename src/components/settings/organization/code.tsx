import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  List,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAppSelector } from "@/src/store/hooks";
import { Redirect } from "expo-router";
import { organizationsSelector } from "@/src/store/features/organization.slice";

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

  return (
    <>
      <List.Item
        title={t("title")}
        left={(props) => <List.Icon {...props} icon="account-plus" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => setIsVisible(true)}
      />
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="account-plus" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content style={styles.dialog_content}>
            <Text>{t("dialog-description")}</Text>
            <View
              style={[
                styles.code_container,
                {
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: roundness,
                },
              ]}
            >
              <Text variant="labelLarge">{org.code}</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>{t("ok")}</Button>
          </Dialog.Actions>
        </Dialog>
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
