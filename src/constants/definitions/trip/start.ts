import { z } from "zod";

export const startTripSchema = z.object({
  vehicle_id: z.string().uuid("invalid-vehicle"),
  start_odometer: z.coerce.number().refine((data) => {
    return data >= 0;
  }),
});

export type StartTripFormData = z.infer<typeof startTripSchema>;
