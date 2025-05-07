import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { organization } from "@/lib/db/schema/auth";
import { relations } from "drizzle-orm";

export const vehicles = pgTable("vehicles", {
  id: uuid().primaryKey().defaultRandom(),

  organization_id: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  name: varchar().notNull(),
  licence_plate: varchar().notNull(),
});

export const vehicleRelations = relations(vehicles, ({ one }) => ({
  organization: one(organization, {
    fields: [vehicles.organization_id],
    references: [organization.id],
  }),
}));
