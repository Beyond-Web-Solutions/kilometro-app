import { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { DeleteTripDialog } from "@/src/components/trips/details/delete";
import { useOrganizationRole } from "@/src/hooks/org/role";

interface Props {
  params: { id?: string };
}

export function TripsOptionsMenu({ params }: Props) {
  const { t } = useTranslation("trips");

  const { data } = useOrganizationRole();

  const [isVisible, setIsVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  if (data !== "admin" || !params.id) {
    return null;
  }

  return (
    <>
      <Menu
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        anchor={
          <IconButton icon="dots-vertical" onPress={() => setIsVisible(true)} />
        }
      >
        {/*<Menu.Item
              onPress={() => {}}
              title={t("edit.menu-item")}
              leadingIcon="pencil"
          />
          <Divider />*/}
        <Menu.Item
          title={t("delete.menu-item")}
          leadingIcon="delete"
          onPress={() => {
            setIsDeleteDialogVisible(true);
            setIsVisible(false);
          }}
        />
      </Menu>
      <DeleteTripDialog
        id={params.id}
        isVisible={isDeleteDialogVisible}
        hideDialog={() => setIsDeleteDialogVisible(false)}
      />
    </>
  );
}
