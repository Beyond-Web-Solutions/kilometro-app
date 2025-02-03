import { Button } from "react-native-paper";
import { CreateVehicleDialog } from "@/src/components/vehicles/create";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

interface Props {
  hasVehicles: boolean;
}

export function OnboardingAddVehicleDialog({ hasVehicles }: Props) {
  const { t } = useTranslation("onboard", { keyPrefix: "create-vehicles" });
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button
        contentStyle={styles.button}
        mode={hasVehicles ? "contained-tonal" : "contained"}
        icon="plus-circle-outline"
        onPress={() => setIsVisible(true)}
      >
        {t("title")}
      </Button>
      <CreateVehicleDialog
        isVisible={isVisible}
        hideDialog={() => setIsVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row-reverse",
  },
});
