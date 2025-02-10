import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Tables } from "@/src/types/supabase";
import { TripsOverviewListItem } from "@/src/components/trips/overview/list-item";
import { useTheme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchTrips, tripsSelector } from "@/src/store/features/trips.slice";

export default function TripsPage() {
  const { colors } = useTheme();

  const dispatch = useAppDispatch();
  const trips = useAppSelector(tripsSelector.selectAll);
  const isPending = useAppSelector((state) => state.trips.isPending);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <FlatList<Tables<"trips">>
        data={trips}
        refreshing={isPending}
        onRefresh={() => dispatch(fetchTrips())}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TripsOverviewListItem trip={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
