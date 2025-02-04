import { z } from "zod";

export const stopTripSchema = z
  .object({
    vehicle_id: z.string().uuid(),

    type: z.enum(["business", "private"]),

    start_odometer: z.coerce.number().positive(),
    end_odometer: z.coerce.number().positive(),

    distance: z.coerce.number().positive(),

    codec: z.string(),

    max_speed: z.number(),
    avg_speed: z.number(),

    start_place_id: z.string().min(3),
    start_address: z.string().min(3),

    end_place_id: z.string().min(3),
    end_address: z.string().min(3),

    end_point: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .refine((data) => data.end_odometer > data.start_odometer, {
    message: "new-odometer-cannot-be-less-than-previous",
    path: ["end_odometer"],
  });

export type StopTripFormData = z.infer<typeof stopTripSchema>;
