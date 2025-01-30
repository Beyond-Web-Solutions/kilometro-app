import { FlatList } from "react-native";
import { Tables } from "@/types/supabase";
import { List } from "react-native-paper";
import { VehicleMenu } from "@/components/vehicles/menu";
import { useVehicles } from "@/hooks/vehicles/list";

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
          right={(props) => (
            <VehicleMenu
              color={props.color}
              style={props.style}
              vehicle={item}
            />
          )}
        />
      )}
    />
  );
}
