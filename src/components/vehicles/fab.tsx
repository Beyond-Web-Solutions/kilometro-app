import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { CreateVehicleDialog } from "@/src/components/vehicles/create";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CreateVehicleFab() {
  const { t } = useTranslation("vehicles", { keyPrefix: "create" });
  const { right } = useSafeAreaInsets();

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <FAB
        label={t("fab")}
        icon="car"
        style={[styles.fab, { bottom: 8, right: 8 + right }]}
        onPress={() => setIsVisible(true)}
      />
      <CreateVehicleDialog
        isVisible={isVisible}
        hideDialog={() => setIsVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    zIndex: 1,
  },
});
