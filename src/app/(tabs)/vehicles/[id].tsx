import { Container } from "@/src/components/_common/layout/container";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateVehicleFormData,
  updateVehicleSchema,
} from "@/src/constants/definitions/vehicles/update";
import { StyleSheet, View } from "react-native";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { useTranslation } from "react-i18next";
import { Button, Divider } from "react-native-paper";
import { useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import { useErrorStore } from "@/src/store/error";
import { useAppSelector } from "@/src/store/hooks";
import { vehiclesSelector } from "@/src/store/features/vehicle.slice";

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { t } = useTranslation("vehicles", { keyPrefix: "edit.form" });
  const { setError } = useErrorStore();

  const vehicle = useAppSelector((state) =>
    vehiclesSelector.selectById(state, id as string),
  );

  const {
    control,
    setFocus,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateVehicleFormData>({
    resolver: zodResolver(updateVehicleSchema),
    defaultValues: {
      id: vehicle.id,
      name: vehicle.name,
      licence_plate: vehicle.licence_plate,
      odometer: vehicle.odometer / 1000, // Convert to kilometers,
      brand: vehicle.brand ?? "",
      model: vehicle.model ?? "",
      year: vehicle.year ?? 0,
    },
  });

  const onSubmit = useCallback(async (values: UpdateVehicleFormData) => {
    const { error } = await supabase
      .from("vehicles")
      .update({
        ...values,
        odometer: values.odometer * 1000, // Convert back to meters,
      })
      .eq("id", values.id);

    if (error) {
      console.error(error);

      return setError(t("errors.saving"));
    }
  }, []);

  return (
    <Container>
      <View style={styles.form}>
        <TextFormField<UpdateVehicleFormData>
          control={control}
          autoFocus
          name="name"
          mode="outlined"
          autoCapitalize="words"
          label={t("name.label")}
          returnKeyType="next"
          numberOfLines={1}
          onSubmitEditing={() => setFocus("licence_plate")}
        />
        <TextFormField<UpdateVehicleFormData>
          control={control}
          name="licence_plate"
          mode="outlined"
          autoCapitalize="characters"
          label={t("licence-plate.label")}
          placeholder={t("licence-plate.placeholder")}
          returnKeyType="next"
          numberOfLines={1}
          onSubmitEditing={() => setFocus("odometer")}
        />
        <TextFormField<UpdateVehicleFormData>
          control={control}
          name="odometer"
          mode="outlined"
          label={t("odometer.label")}
          returnKeyType="next"
          keyboardType="numeric"
          numberOfLines={1}
          onSubmitEditing={() => setFocus("brand")}
        />
        <TextFormField<UpdateVehicleFormData>
          control={control}
          name="brand"
          mode="outlined"
          label={t("brand.label")}
          placeholder={t("brand.placeholder")}
          returnKeyType="next"
          numberOfLines={1}
          onSubmitEditing={() => setFocus("model")}
        />
        <TextFormField<UpdateVehicleFormData>
          control={control}
          name="model"
          mode="outlined"
          label={t("model.label")}
          placeholder={t("model.placeholder")}
          returnKeyType="next"
          numberOfLines={1}
          onSubmitEditing={() => setFocus("year")}
        />
        <TextFormField<UpdateVehicleFormData>
          control={control}
          name="year"
          keyboardType="numeric"
          inputMode="numeric"
          mode="outlined"
          label={t("year.label")}
          placeholder={t("year.placeholder")}
          returnKeyType="done"
          numberOfLines={1}
          onSubmitEditing={handleSubmit(onSubmit)}
        />
        <Divider />
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {t("submit")}
        </Button>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    gap: 8,
  },
});
