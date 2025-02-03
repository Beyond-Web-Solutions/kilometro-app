import { useTrips } from "@/src/hooks/trip/list";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Tables } from "@/src/types/supabase";
import { TripsOverviewListItem } from "@/src/components/trips/overview/list-item";
import { useTheme } from "react-native-paper";

export default function TripsPage() {
  const { data } = useTrips();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <FlatList<Tables<"trips">>
        data={data}
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
