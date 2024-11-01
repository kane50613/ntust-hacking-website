import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  eventId: integer().primaryKey({ autoIncrement: true }),
  title: text(),
  description: text(),
  date: integer({
    mode: "timestamp",
  }),
});

export const eventLinks = sqliteTable("eventLinks", {
  linkId: integer().primaryKey({ autoIncrement: true }),
  eventId: integer().notNull(),
  link: text().notNull(),
  label: text(),
});
