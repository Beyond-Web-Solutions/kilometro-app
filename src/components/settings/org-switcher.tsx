import { Button, Dialog, Portal, RadioButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { useOrganizations } from "@/src/hooks/org/list";
import { useDefaultOrganization } from "@/src/hooks/org/default";
import { Link } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSetDefaultOrganization } from "@/src/hooks/org/set-default";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
}

export function OrganizationSwitcher({ isVisible, hideDialog }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useSetDefaultOrganization(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["organizations"],
      refetchType: "all",
    });

    await queryClient.invalidateQueries({
      queryKey: ["user"],
      refetchType: "all",
    });

    hideDialog();
  });

  const { t } = useTranslation("settings", {
    keyPrefix: "organization-switcher",
  });

  const { data: organizations } = useOrganizations();
  const { data: defaultOrganization } = useDefaultOrganization();

  const [organization, setOrganization] = useState<string>("");

  useEffect(() => {
    if (defaultOrganization) {
      setOrganization(defaultOrganization.id);
    }
  }, [defaultOrganization]);

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Icon icon="office-building" />
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.ScrollArea style={styles.scroll_area}>
          <ScrollView>
            <RadioButton.Group
              value={organization}
              onValueChange={setOrganization}
            >
              {organizations?.map((org) => (
                <RadioButton.Item
                  mode="android"
                  key={org.id}
                  value={org.id}
                  label={org.name}
                  style={styles.organization}
                />
              ))}
            </RadioButton.Group>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions style={styles.footer}>
          <Link href="/settings/new-organization" onPress={hideDialog} asChild>
            <Button>{t("new")}</Button>
          </Link>
          <View style={styles.footer_primary_actions}>
            <Button compact onPress={hideDialog}>
              {t("cancel")}
            </Button>
            <Button
              compact
              mode="contained"
              loading={isPending}
              disabled={isPending}
              onPress={() => mutate(organization)}
            >
              {t("submit")}
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  scroll_area: {
    paddingHorizontal: 0,
  },
  organization: {
    marginHorizontal: 8,
  },
  footer: {
    justifyContent: "space-between",
  },
  footer_primary_actions: {
    flexDirection: "row",
    gap: 4,
  },
});
