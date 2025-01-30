import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  CreateVehicleFormData,
  createVehicleSchema,
} from "@/constants/definitions/vehicles/create";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { TextFormField } from "@/components/_common/form/text-input";
import { supabase } from "@/lib/supabase";
import { getOrganization } from "@/hooks/org/default";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
}

export function CreateVehicleDialog({ isVisible, hideDialog }: Props) {
  const queryClient = useQueryClient();

  const { t } = useTranslation("vehicles", { keyPrefix: "create" });

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateVehicleFormData>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      name: "",
      licence_plate: "",
      odometer: 0,
    },
  });

  const onSubmit = useCallback(async (values: CreateVehicleFormData) => {
    const org = await getOrganization();

    if (!org) {
      console.error("Organization not found");
      return;
    }

    const { error } = await supabase.from("vehicles").insert({
      name: values.name,
      licence_plate: values.licence_plate,
      odometer: (values.odometer ?? 0) * 1000,
      organization_id: org.id,
    });

    if (error) {
      console.error(error);
      return;
    }

    hideDialog();
    reset();

    return queryClient.invalidateQueries({
      queryKey: ["vehicles"],
    });
  }, []);

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Icon icon="car" />
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.Content style={{ gap: 4 }}>
          <TextFormField<CreateVehicleFormData>
            control={control}
            name="name"
            mode="outlined"
            autoCapitalize="words"
            label={t("form.name.label")}
            keyboardType="default"
            returnKeyType="next"
            numberOfLines={1}
            onSubmitEditing={() => setFocus("licence_plate")}
          />
          <TextFormField<CreateVehicleFormData>
            control={control}
            autoComplete="off"
            name="licence_plate"
            mode="outlined"
            autoCapitalize="none"
            label={t("form.licence-plate.label")}
            placeholder={t("form.licence-plate.placeholder")}
            keyboardType="default"
            returnKeyType="default"
            numberOfLines={1}
            onSubmitEditing={() => setFocus("odometer")}
          />
          <TextFormField<CreateVehicleFormData>
            control={control}
            autoComplete="off"
            name="odometer"
            mode="outlined"
            autoCapitalize="none"
            label={t("form.odometer.label")}
            keyboardType="numeric"
            returnKeyType="done"
            numberOfLines={1}
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{t("cancel")}</Button>
          <Button
            mode="contained"
            disabled={isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          >
            {t("submit")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
