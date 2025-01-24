import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(2, { message: "org-name-must-be-2-50-characters" }),
  email: z.string().email("invalid-email"),
});
