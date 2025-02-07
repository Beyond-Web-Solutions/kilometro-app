import { z } from "zod";

export const stopTripSchema = z
  .object({
    type: z.enum(["business", "private"]),

    start_odometer: z.number().positive(),
    end_odometer: z.number().positive(),

    distance: z.number().positive(),
  })
  .refine((data) => data.end_odometer > data.start_odometer, {
    message: "new-odometer-cannot-be-less-than-previous",
    path: ["end_odometer"],
  });

export type StopTripFormData = z.infer<typeof stopTripSchema>;
