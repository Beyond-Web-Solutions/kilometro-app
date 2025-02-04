import { z } from "zod";

export const joinOrganizationSchema = z.object({
  code: z
    .string()
    .length(6, { message: "organization-code-must-be-6-characters" }),
});

export type JoinOrganizationFormData = z.infer<typeof joinOrganizationSchema>;
