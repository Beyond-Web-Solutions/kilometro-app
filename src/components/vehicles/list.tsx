import { FlatList } from "react-native";
import { Tables } from "@/src/types/supabase";
import { List } from "react-native-paper";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  refetchVehicles,
  vehiclesSelector,
} from "@/src/store/features/vehicle.slice";

export function VehiclesList() {
  const dispatch = useAppDispatch();
  const vehicles = useAppSelector(vehiclesSelector.selectAll);
  const isPending = useAppSelector((state) => state.vehicles.isRefetching);

  return (
    <FlatList<Tables<"vehicles">>
      data={vehicles}
      refreshing={isPending}
      onRefresh={() => dispatch(refetchVehicles())}
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
