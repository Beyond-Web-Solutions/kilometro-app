import { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { router, useNavigation } from "expo-router";
import { Tables } from "@/src/types/supabase";
import { DeleteVehicleDialog } from "@/src/components/vehicles/delete";

interface Props {
  vehicle: Tables<"vehicles">;
  color: string;
  style?: any;
}

export function VehicleMenu(props: Props) {
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
          <IconButton
            iconColor={props.color}
            style={props.style}
            onPress={() => setIsVisible(true)}
            icon="dots-vertical"
          />
        }
      >
        <Menu.Item
          title={t("edit")}
          leadingIcon="pencil"
          onPress={() => {
            setIsVisible(false);
            router.navigate(`/vehicles/${props.vehicle.id}`);
          }}
        />
        <Menu.Item
          title={t("delete")}
          leadingIcon="trash-can-outline"
          onPress={() => {
            setIsVisible(false);
            setIsDeleteDialogVisible(true);
          }}
        />
      </Menu>
      <DeleteVehicleDialog
        id={props.vehicle.id}
        isVisible={isDeleteDialogVisible}
        hideDialog={() => setIsDeleteDialogVisible(false)}
      />
    </>
  );
}
