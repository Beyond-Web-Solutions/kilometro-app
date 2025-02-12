import { z } from "zod";

export const editTripSchema = z
  .object({
    started_at: z.date(),
    ended_at: z.date(),

    vehicle_id: z.string().uuid(),

    start_odometer: z.coerce.number().positive(),
    end_odometer: z.coerce.number().positive(),

    start_place_id: z.string().nonempty(),
    start_address: z.string().nonempty(),

    end_place_id: z.string().nonempty(),
    end_address: z.string().nonempty(),
  })
  .refine((data) => data.started_at < data.ended_at, {
    path: ["started_at"],
    message: "start-date-must-be-before-end-date",
  })
  .refine((data) => data.end_odometer > data.start_odometer, {
    message: "new-odometer-cannot-be-less-than-previous",
    path: ["end_odometer"],
  });

export type EditTripFormData = z.infer<typeof editTripSchema>;
