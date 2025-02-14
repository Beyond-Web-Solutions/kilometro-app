import { useForm } from "react-hook-form";
import {
  ExportTripFormData,
  exportTripSchema,
} from "@/src/constants/definitions/trip/export";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@/src/components/_common/layout/container";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { useNavigation } from "expo-router";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { DateRangeFormField } from "@/src/components/trips/export/date-range";
import { StyleSheet, View } from "react-native";

export default function ExportTripsPage() {
  const { t } = useTranslation("trips", { keyPrefix: "export" });

  const navigation = useNavigation();

  const oneMonthAgo = useMemo(() => {
    const date = new Date();

    date.setMonth(date.getMonth() - 1);

    return date;
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ExportTripFormData>({
    resolver: zodResolver(exportTripSchema),
    defaultValues: {
      users: [],
      vehicles: [],
      range: {
        from: oneMonthAgo,
        to: new Date(),
      },
    },
  });

  const onSubmit = useCallback(async (values: ExportTripFormData) => {
    console.log(values);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {t("submit")}
        </Button>
      ),
    });
  }, []);

  return (
    <Container>
      <View style={styles.content}>
        <DateRangeFormField<ExportTripFormData>
          control={control}
          name="range"
          label={t("range")}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 8,
  },
});
