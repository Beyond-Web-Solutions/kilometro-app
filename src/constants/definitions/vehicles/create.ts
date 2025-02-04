import { z } from "zod";

export const createVehicleSchema = z.object({
  name: z.string().min(3, { message: "name-too-short" }),
  licence_plate: z
    .string()
    .length(8, { message: "licence-plate-must-be-8-characters" }),
  odometer: z.coerce.number().int().positive("odometer-must-be-positive"),
});

export type CreateVehicleFormData = z.infer<typeof createVehicleSchema>;
