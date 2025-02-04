import { getVehicle } from "@/src/hooks/vehicles/get";
import { UpdateVehicleFormData } from "@/src/constants/definitions/vehicles/update";

export async function getVehicleDefaultValues(
  id: string,
): Promise<UpdateVehicleFormData> {
  const vehicle = await getVehicle(id);

  return {
    id,
    name: vehicle?.name ?? "",
    licence_plate: vehicle?.licence_plate ?? "",
    odometer: (vehicle?.odometer ?? 0) / 1000,
    model: vehicle?.model ?? "",
    brand: vehicle?.brand ?? "",
    year: vehicle?.year ?? 0,
  };
}
