import { z } from "zod";

export const upsertProfileSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "name-must-have-at-least-2-characters" }),
  last_name: z
    .string()
    .min(2, { message: "name-must-have-at-least-2-characters" }),
});

export type UpsertProfileFormData = z.infer<typeof upsertProfileSchema>;
