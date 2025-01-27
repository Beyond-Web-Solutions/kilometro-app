import { z } from "zod";

export const stopTripSchema = z.object({
  type: z.enum(["business", "private"]),
});

export type StopTripSchema = z.infer<typeof stopTripSchema>;
