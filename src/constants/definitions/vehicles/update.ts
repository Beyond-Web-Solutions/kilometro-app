import { z } from "zod";
import { createVehicleSchema } from "@/src/constants/definitions/vehicles/create";

export const updateVehicleSchema = createVehicleSchema.extend({
  id: z.string().uuid(),

  brand: z.string(),
  model: z.string(),

  year: z.coerce.number(),
});

export type UpdateVehicleFormData = z.infer<typeof updateVehicleSchema>;
