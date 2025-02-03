import { z } from "zod";

export const startTripSchema = z.object({
  vehicle_id: z.string().uuid("invalid-vehicle"),
  start_odometer: z.string().refine((data) => {
    const odometer = Number(data);

    return odometer >= 0;
  }),
});

export type StartTripFormData = z.infer<typeof startTripSchema>;
