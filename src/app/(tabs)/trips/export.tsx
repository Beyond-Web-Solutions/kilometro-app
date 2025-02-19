import { useForm } from "react-hook-form";
import {
  ExportTripFormData,
  exportTripSchema,
} from "@/src/constants/definitions/trip/export";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@/src/components/_common/layout/container";
import { useCallback, useMemo } from "react";
import { Button } from "react-native-paper";
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
import { router } from "expo-router";
import { json2csv } from "json-2-csv";
import { formatOdometer } from "@/src/utils/format";

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
      .select("*, vehicles(*), profiles(*)")
      .eq("status", "done")
      .gte("started_at", values.range.from)
      .lte("ended_at", values.range.to);

    if (values.users.length > 0) {
      q.in("user_id", values.users);
    }

    if (values.vehicles.length > 0) {
      q.in("vehicle_id", values.vehicles);
    }

    const { data } = await q;

    if (data) {
      const csv = json2csv(data, {
        parseValue: (value, defaultParser) => {
          if (typeof value === "number") {
            return formatOdometer(value, true);
          }

          if (typeof value === "boolean") {
            return value ? t("csv.yes") : t("csv.no");
          }

          return defaultParser(value);
        },
        keys: [
          { field: "vehicles.name", title: t("csv.vehicle") },
          { field: "vehicles.licence_plate", title: t("csv.license-plate") },
          { field: "start_address", title: t("csv.start-address") },
          { field: "end_address", title: t("csv.end-address") },
          { field: "distance", title: t("csv.distance") },
          { field: "is_private", title: t("csv.is-private") },
          { field: "start_odometer", title: t("csv.start-odometer") },
          { field: "end_odometer", title: t("csv.end-odometer") },
          { field: "profiles.email", title: t("csv.user-email") },
          { field: "profiles.first_name", title: t("csv.user-first-name") },
          { field: "profiles.last_name", title: t("csv.user-last-name") },
        ],
      });

      const file = new File(
        Paths.cache,
        `trip-export_${values.range.from.toISOString()}-${values.range.to.toISOString()}.csv`,
      );

      file.create();

      file.write(csv);

      await Sharing.shareAsync(file.uri);
    }

    return router.back();
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
            value: u.user_id,
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
