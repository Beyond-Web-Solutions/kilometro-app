import { StartTripFormData } from "@/src/constants/definitions/trip/start";
import { ActivityIndicator, List, RadioButton } from "react-native-paper";
import { RadioGroupField } from "@/src/components/_common/form/radio-group";
import { Control, useController } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useVehicles } from "@/src/hooks/vehicles/list";
import { useAppSelector } from "@/src/store/hooks";
import { vehiclesSelector } from "@/src/store/features/vehicle.slice";

interface Props {
  control: Control<StartTripFormData>;
}

export function SelectVehicleInput({ control }: Props) {
  const vehicles = useAppSelector(vehiclesSelector.selectAll);

  const { field } = useController({
    name: "vehicle_id",
    control,
  });

  return (
    <RadioGroupField<StartTripFormData> control={control} name="vehicle_id">
      {vehicles.map((vehicle) => (
        <List.Item
          key={vehicle.id}
          title={vehicle.name}
          description={vehicle.licence_plate}
          style={styles.radio_button}
          right={() => <RadioButton.Android value={vehicle.id} />}
          onPress={() => field.onChange(vehicle.id)}
        />
      ))}
    </RadioGroupField>
  );
}

const styles = StyleSheet.create({
  activity_indicator_container: {
    paddingVertical: 24,
  },
  radio_button: {
    paddingHorizontal: 8,
  },
});
