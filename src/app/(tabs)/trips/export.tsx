import { useForm } from "react-hook-form";
import {
  ExportTripFormData,
  exportTripSchema,
} from "@/src/constants/definitions/trip/export";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@/src/components/_common/layout/container";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { useNavigation } from "expo-router";
import { Button, Portal } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { DateRangeFormField } from "@/src/components/trips/export/date-range";
import { StyleSheet, View } from "react-native";
import { useAppSelector } from "@/src/store/hooks";
import { vehiclesSelector } from "@/src/store/features/vehicle.slice";
import { organizationMembersSelector } from "@/src/store/features/organization-members.slice";
import { MultiSelectFormField } from "@/src/components/_common/form/multi-select";
import { supabase } from "@/src/lib/supabase";
import { File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";

export default function ExportTripsPage() {
  const { t } = useTranslation("trips", { keyPrefix: "export" });

  const vehicles = useAppSelector(vehiclesSelector.selectAll);
  const users = useAppSelector(organizationMembersSelector.selectAll);

  const oneMonthAgo = useMemo(() => {
    const date = new Date();

    date.setMonth(date.getMonth() - 1);

    return date;
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, defaultValues },
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
    const q = supabase
      .from("trips")
      .select(
        "started_at, ended_at, distance, start_odometer, end_odometer, is_private, avg_speed, max_speed, start_address, end_address, vehicles(name), profiles(email)",
      )
      .eq("status", "done")
      .gte("started_at", values.range.from)
      .lte("ended_at", values.range.to);

    if (values.users.length > 0) {
      q.in("user_id", values.users);
    }

    if (values.vehicles.length > 0) {
      q.in("vehicle_id", values.vehicles);
    }

    const { data } = await q.csv();

    if (data) {
      const file = new File(
        Paths.document,
        `trip-export_${values.range.from.toISOString()}-${values.range.to.toISOString()}.csv`,
      );

      file.create();
      file.write(data);

      await Sharing.shareAsync(file.uri);
    }
  }, []);

  return (
    <Container>
      <View style={styles.content}>
        <DateRangeFormField control={control} label={t("range")} />
        <MultiSelectFormField<ExportTripFormData>
          control={control}
          name="users"
          label={t("users")}
          defaultValue={defaultValues?.users as string[]}
          values={users.map((u) => ({
            value: u.id,
            label: u.profiles.email ?? "",
          }))}
        />
        <MultiSelectFormField<ExportTripFormData>
          control={control}
          name="vehicles"
          label={t("vehicles")}
          defaultValue={defaultValues?.vehicles as string[]}
          values={vehicles.map((v) => ({
            value: v.id,
            label: v.name,
          }))}
        />
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {t("submit")}
        </Button>
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
