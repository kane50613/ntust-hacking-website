import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const createdAt = integer({
  mode: "timestamp",
})
  .notNull()
  .$defaultFn(() => new Date());

export const events = sqliteTable("events", {
  eventId: integer().primaryKey({ autoIncrement: true }),
  title: text(),
  description: text(),
  date: integer({
    mode: "timestamp",
  }),
  createdAt,
});

export const eventLinks = sqliteTable("eventLinks", {
  linkId: integer().primaryKey({ autoIncrement: true }),
  eventId: integer().notNull(),
  link: text().notNull(),
  label: text(),
  createdAt,
});

export const users = sqliteTable("users", {
  userId: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().unique(),
  createdAt,
});

export const enrolls = sqliteTable("enrolls", {
  enrollId: integer().primaryKey({ autoIncrement: true }),
  userId: integer()
    .notNull()
    .references(() => users.userId),
  eventId: integer().notNull(),
  createdAt,
});

export const feedbacks = sqliteTable("feedbacks", {
  feedbackId: integer().primaryKey({ autoIncrement: true }),
  eventId: integer()
    .notNull()
    .references(() => events.eventId),
  userId: integer()
    .notNull()
    .references(() => users.userId),
  comment: text(),
  createdAt,
});

export const eventRelations = relations(events, ({ many }) => ({
  links: many(eventLinks),
  enrolls: many(enrolls),
  feedbacks: many(feedbacks),
}));

export const userRelations = relations(users, ({ many }) => ({
  enrolls: many(enrolls),
}));

export const enrollRelations = relations(enrolls, ({ one }) => ({
  event: one(events),
}));

export const feedbackRelations = relations(feedbacks, ({ one }) => ({
  event: one(events),
  user: one(users),
}));

export const eventLinkRelations = relations(eventLinks, ({ one }) => ({
  event: one(events),
}));
