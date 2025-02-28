import { z } from "zod";

export const createVehicleSchema = z.object({
  name: z.string().min(3, { message: "name-too-short" }),
  licence_plate: z
    .string()
    .regex(
      /(\w{2}-\d{2}-\d{2})|(\d{2}-\d{2}-\w{2})|(\d{2}-\w{2}-\d{2})|(\w{2}-\d{2}-\w{2})|(\w{2}-\w{2}-\d{2})|(\d{2}-\w{2}-\w{2})|(\d{2}-\w{3}-\d{1})|(\d{1}-\w{3}-\d{2})|(\w{2}-\d{3}-\w{1})|(\w{1}-\d{3}-\w{2})|(\w{3}-\d{2}-\w{1})|(\d{1}-\w{2}-\d{3})/gm,
      { message: "invalid-licence-plate" },
    ),
  odometer: z.coerce
    .string()
    .transform((val) => Number(`${val}`.replace(",", ".")))
    .pipe(z.number().positive("odometer-must-be-positive")),
});

export type CreateVehicleFormData = z.infer<typeof createVehicleSchema>;
