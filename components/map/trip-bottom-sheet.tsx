import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Button, Divider, List, Text, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  stopTripSchema,
  StopTripSchema,
} from "@/constants/definitions/trip/stop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentTrip } from "@/hooks/use-current-trip";
import { formatDateTime } from "@/utils/format";

export function TripBottomSheet() {
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["10%"], []);

  const { t } = useTranslation("map", { keyPrefix: "current-trip" });
  const { colors } = useTheme();
  const { data: trip } = useCurrentTrip();

  useEffect(() => {
    if (trip) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [trip]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StopTripSchema>({
    resolver: zodResolver(stopTripSchema),
    defaultValues: { type: "business" },
  });

  const onSubmit = useCallback(async (values: StopTripSchema) => {}, []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.onSurface }}
    >
      <BottomSheetView style={styles.container}>
        <Text variant="headlineSmall">{t("current-rit")}</Text>
        <Divider style={styles.divider} />
        <List.Item
          title={trip?.start_address ?? t("unknown-location")}
          description={
            trip?.started_at
              ? formatDateTime(trip.started_at)
              : t("unknown-time")
          }
          left={(props) => <List.Icon {...props} icon="map-marker" />}
          right={(props) => <List.Icon {...props} icon="menu-right" />}
          onPress={() => {}}
        />
        <List.Item
          title={t("unknown-location")}
          description="11:45"
          left={(props) => <List.Icon {...props} icon="map-marker" />}
          right={(props) => <List.Icon {...props} icon="menu-right" />}
          onPress={() => {}}
        />
        <Divider style={styles.divider} />
        <Text>HEllo</Text>
        <Divider style={styles.divider} />
        <Button
          mode="contained-tonal"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {t("stop")}
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
});
