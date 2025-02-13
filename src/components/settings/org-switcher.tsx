import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { useOrganizations } from "@/src/hooks/org/list";
import { useDefaultOrganization } from "@/src/hooks/org/default";
import { Link, router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSetDefaultOrganization } from "@/src/hooks/org/set-default";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  organizationsSelector,
  setSelectedOrganization,
} from "@/src/store/features/organization.slice";
import { fetchRole } from "@/src/store/features/auth.slice";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
  showCreateNew: boolean;
}

export function OrganizationSwitcher({
  isVisible,
  hideDialog,
  showCreateNew,
}: Props) {
  const dispatch = useAppDispatch();

  const { t } = useTranslation("settings", {
    keyPrefix: "organization-switcher",
  });

  const selectedOrganizationId = useAppSelector(
    (state) => state.organizations.selected,
  );
  const organizations = useAppSelector(organizationsSelector.selectAll);

  const [organization, setOrganization] = useState<string>("");

  const { mutate, isPending } = useSetDefaultOrganization(() => {
    dispatch(setSelectedOrganization(organization));
    dispatch(fetchRole());

    hideDialog();

    router.replace("/(tabs)");
  });

  useEffect(() => {
    if (selectedOrganizationId) {
      setOrganization(selectedOrganizationId);
    }
  }, [selectedOrganizationId]);

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
        <Dialog.Actions
          style={[
            styles.footer,
            { justifyContent: showCreateNew ? "space-between" : "flex-end" },
          ]}
        >
          {showCreateNew && (
            <Link
              href="/settings/new-organization"
              onPress={hideDialog}
              asChild
            >
              <Button>{t("new")}</Button>
            </Link>
          )}
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
