import { useState } from "react";
import { Divider, IconButton, Menu } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { UpdateOrganizationMemberDialog } from "@/src/components/settings/members/update";
import { DeleteOrganizationMemberDialog } from "@/src/components/settings/members/delete";

interface Props {
  id: string;
  role: "driver" | "admin";
  isSelf: boolean;
  style?: any;
}

export function MembersOptionsMenu({ id, role, isSelf, style }: Props) {
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.members.overview.menu",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isUpdateDialogVisible, setIsUpdateDialogVisible] = useState(false);

  if (isSelf) {
    return null;
  }

  return (
    <>
      <Menu
        visible={isOpen}
        onDismiss={() => setIsOpen(false)}
        anchorPosition="bottom"
        anchor={
          <IconButton
            style={style}
            icon="dots-vertical"
            onPress={() => setIsOpen(true)}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            setIsUpdateDialogVisible(true);
            setIsOpen(false);
          }}
          title={t("edit")}
          leadingIcon="pencil"
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            setIsDeleteDialogVisible(true);
            setIsOpen(false);
          }}
          title={t("delete")}
          leadingIcon="delete"
        />
      </Menu>
      <UpdateOrganizationMemberDialog
        id={id}
        role={role}
        isVisible={isUpdateDialogVisible}
        hideDialog={() => setIsUpdateDialogVisible(false)}
      />
      <DeleteOrganizationMemberDialog
        id={id}
        isVisible={isDeleteDialogVisible}
        hideDialog={() => setIsDeleteDialogVisible(false)}
      />
    </>
  );
}
