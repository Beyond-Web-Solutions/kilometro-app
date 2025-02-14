import { z } from "zod";

export const exportTripSchema = z.object({
  range: z.object({
    from: z.date(),
    to: z.date(),
  }),

  users: z.array(z.string().uuid()),
  vehicles: z.array(z.string().uuid()),
});

export type ExportTripFormData = z.infer<typeof exportTripSchema>;
