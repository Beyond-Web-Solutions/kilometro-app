import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Tables } from "@/src/types/supabase";
import { TripsOverviewListItem } from "@/src/components/trips/overview/list-item";
import { Divider, FAB, useTheme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchTrips, tripsSelector } from "@/src/store/features/trips.slice";
import { EmptyList } from "@/src/components/_common/empty-list";
import { useTranslation } from "react-i18next";
import { Link, router } from "expo-router";

export default function TripsPage() {
  const { t } = useTranslation("trips", { keyPrefix: "overview" });

  const { colors } = useTheme();

  const dispatch = useAppDispatch();
  const trips = useAppSelector(tripsSelector.selectAll);
  const isPending = useAppSelector((state) => state.trips.isPending);
  const role = useAppSelector((state) => state.auth.role);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <FlatList<Tables<"trips">>
        data={trips}
        refreshing={isPending}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={<EmptyList />}
        onRefresh={() => dispatch(fetchTrips())}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TripsOverviewListItem trip={item} />}
      />
      <FAB
        visible={role === "admin"}
        style={styles.fab}
        label={t("export")}
        icon="file-download-outline"
        onPress={() => router.navigate("/(tabs)/trips/export")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 8,
    right: 0,
    bottom: 0,
  },
});
