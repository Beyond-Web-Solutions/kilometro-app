import { FlatList } from "react-native";
import { Tables } from "@/src/types/supabase";
import { List } from "react-native-paper";
import { VehicleMenu } from "@/src/components/vehicles/menu";
import { useVehicles } from "@/src/hooks/vehicles/list";
import { router } from "expo-router";

export function VehiclesList() {
  const { data } = useVehicles();

  return (
    <FlatList<Tables<"vehicles">>
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          description={item.licence_plate}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.navigate(`/vehicles/${item.id}`)}
        />
      )}
    />
  );
}
