import { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { router, useNavigation } from "expo-router";
import { Tables } from "@/src/types/supabase";
import { DeleteVehicleDialog } from "@/src/components/vehicles/delete";
import { useVehicle } from "@/src/hooks/vehicles/get";

interface Props {
  params: { id?: string };
}

export function VehicleMenu({ params }: Props) {
  const { data } = useVehicle(params.id);

  const { t } = useTranslation("vehicles", { keyPrefix: "list.menu" });

  const [isVisible, setIsVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  return (
    <>
      <Menu
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        anchorPosition="bottom"
        anchor={
          <IconButton icon="dots-vertical" onPress={() => setIsVisible(true)} />
        }
      >
        <Menu.Item
          title={t("delete")}
          leadingIcon="trash-can-outline"
          onPress={() => {
            setIsVisible(false);
            setIsDeleteDialogVisible(true);
          }}
        />
      </Menu>
      {data && (
        <DeleteVehicleDialog
          id={data?.id}
          isVisible={isDeleteDialogVisible}
          hideDialog={() => setIsDeleteDialogVisible(false)}
        />
      )}
    </>
  );
}
