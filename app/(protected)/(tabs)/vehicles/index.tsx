import { FlatList } from "react-native";
import { vehicles as vehicleSchema } from "@/lib/db/schema";
import { List } from "react-native-paper";
import { useGetAllVehiclesQuery } from "@/lib/store/api/vehicles";

export default function Vehicles() {
  const { data, refetch, isLoading } = useGetAllVehiclesQuery();

  return (
    <FlatList<typeof vehicleSchema.$inferSelect>
      data={data}
      refreshing={isLoading}
      onRefresh={refetch}
      renderItem={({ item }) => <List.Item title={item.name} />}
    />
  );
}
