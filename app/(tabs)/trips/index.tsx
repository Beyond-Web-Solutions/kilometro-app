import { useTrips } from "@/hooks/use-trips";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Tables } from "@/types/supabase";
import { TripsOverviewListItem } from "@/components/trips/overview/list-item";

export default function TripsPage() {
  const { data } = useTrips();

  return (
    <SafeAreaView style={styles.container}>
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
