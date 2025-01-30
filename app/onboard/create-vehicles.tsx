import { StyleSheet, View } from "react-native";
import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { VehiclesList } from "@/components/vehicles/list";
import { OnboardingAddVehicleDialog } from "@/components/onboard/create-vehicles/add";
import { Surface, useTheme } from "react-native-paper";
import { useVehicles } from "@/hooks/vehicles/list";

export default function CreateVehiclesScreen() {
  const { t } = useTranslation("onboard", { keyPrefix: "create-vehicles" });

  const { roundness } = useTheme();
  const { data } = useVehicles();

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      links={
        (data?.length ?? 0) > 0
          ? [
              {
                label: t("links.continue"),
                mode: "contained",
                onPress: () => router.replace("/(tabs)"),
              },
            ]
          : []
      }
    >
      <View style={styles.page}>
        <Surface style={[styles.vehicles, { borderRadius: roundness }]}>
          <VehiclesList />
        </Surface>
        <OnboardingAddVehicleDialog hasVehicles={(data?.length ?? 0) > 0} />
      </View>
    </OnboardAndAuthLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 8,
    marginBottom: 8,
  },
  vehicles: {
    marginVertical: 8,
  },
});
