import { z } from "zod";

export const stopTripSchema = z.object({
  type: z.enum(["business", "private"]),

  start_place_id: z.string().optional(),
  start_address: z.string().optional(),

  end_place_id: z.string().optional(),
  end_address: z.string().optional(),
});

export type StopTripFormData = z.infer<typeof stopTripSchema>;
