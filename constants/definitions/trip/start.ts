import { z } from "zod";

export const startTripSchema = z.object({
  vehicle_id: z.string().uuid(),
  start_odometer: z.number().int().positive(),
  start_point: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export type StartTripFormData = z.infer<typeof startTripSchema>;
