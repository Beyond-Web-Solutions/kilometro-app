import { useForm } from "react-hook-form";
import {
  CreateOrganizationFormData,
  createOrganizationSchema,
} from "@/constants/definitions/onboard/create-org";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { TextFormField } from "@/components/_common/form/text-input";
import { useTranslation } from "react-i18next";
import { Button } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export function CreatOrganizationForm() {
  const queryClient = useQueryClient();
  const { t } = useTranslation("onboard", { keyPrefix: "create.form" });

  const {
    control,
    setFocus,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = useCallback(async (values: CreateOrganizationFormData) => {
    const { data, error } = await supabase.functions.invoke("create-customer", {
      body: values,
    });

    if (error) {
      return console.error(error);
    }

    if (data.ok) {
      await queryClient.invalidateQueries({
        queryKey: ["orgs-for-user"],
      });
      return router.push("/(tabs)");
    }
  }, []);

  return (
    <View style={styles.container}>
      <TextFormField<CreateOrganizationFormData>
        control={control}
        name="name"
        mode="outlined"
        autoCapitalize="words"
        label={t("business-name.label")}
        textContentType="organizationName"
        returnKeyType="next"
        numberOfLines={1}
        onSubmitEditing={() => setFocus("email")}
      />
      <TextFormField<CreateOrganizationFormData>
        control={control}
        name="email"
        mode="outlined"
        autoCapitalize="none"
        label={t("business-email.label")}
        textContentType="emailAddress"
        returnKeyType="next"
        keyboardType="email-address"
        numberOfLines={1}
        onSubmitEditing={handleSubmit(onSubmit)}
      />
      <Button
        disabled={isSubmitting}
        loading={isSubmitting}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        {t("submit")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    gap: 6,
  },
  button: {
    marginTop: 4,
  },
});
