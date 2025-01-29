import { z } from "zod";

export const stopTripSchema = z
  .object({
    type: z.enum(["business", "private"]),

    start_odometer: z.string(),
    end_odometer: z.string(),

    distance: z.string(),

    codec: z.string(),

    start_place_id: z.string(),
    start_address: z.string(),

    end_place_id: z.string(),
    end_address: z.string(),
  })
  .refine((data) => data.end_odometer > data.start_odometer, {
    message: "new-odometer-cannot-be-less-than-previous",
    path: ["end_odometer"],
  });

export type StopTripFormData = z.infer<typeof stopTripSchema>;
