import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().nonempty(),
});

export type CreateOrganizationFormData = z.infer<
  typeof createOrganizationSchema
>;
