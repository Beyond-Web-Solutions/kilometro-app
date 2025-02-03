import { StartTripFormData } from "@/src/constants/definitions/trip/start";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import { RadioGroupField } from "@/src/components/_common/form/radio-group";
import { Control } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { UseFormSetValue, UseFormWatch } from "react-hook-form/dist/types/form";
import { useEffect } from "react";
import { useVehicles } from "@/src/hooks/vehicles/list";

interface Props {
  control: Control<StartTripFormData>;
  watch: UseFormWatch<StartTripFormData>;
  setValue: UseFormSetValue<StartTripFormData>;
}

export function SelectVehicleInput({ control, watch, setValue }: Props) {
  const { data, isPending } = useVehicles();

  const vehicle_id = watch("vehicle_id");

  useEffect(() => {
    const vehicle = data?.find((vehicle) => vehicle.id === vehicle_id);

    if (vehicle) {
      const odometer = vehicle.odometer / 1000;
      setValue("start_odometer", odometer.toString());
    }
  }, [vehicle_id, data, setValue]);

  if (isPending) {
    return (
      <View style={styles.activity_indicator_container}>
        <ActivityIndicator animating />
      </View>
    );
  }

  return (
    <RadioGroupField<StartTripFormData> control={control} name="vehicle_id">
      {data?.map((vehicle) => (
        <RadioButton.Item
          mode="android"
          style={styles.radio_button}
          key={vehicle.id}
          label={vehicle.name}
          value={vehicle.id}
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
    paddingHorizontal: 24,
  },
});
