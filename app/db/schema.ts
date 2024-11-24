import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const createdAt = timestamp({ mode: "date" }).notNull().defaultNow();

export const events = pgTable("events", {
  eventId: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: varchar(),
  description: varchar(),
  date: timestamp({ mode: "date" }),
  createdAt,
});

export const eventLinks = pgTable("eventLinks", {
  linkId: integer().primaryKey().generatedByDefaultAsIdentity(),
  eventId: integer().notNull(),
  link: varchar().notNull(),
  label: varchar(),
  createdAt,
});

export const users = pgTable("users", {
  userId: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar().notNull(),
  email: varchar().unique(),
  createdAt,
});

export const enrolls = pgTable("enrolls", {
  enrollId: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.userId),
  eventId: integer()
    .notNull()
    .references(() => events.eventId),
  createdAt,
});

export const feedbacks = pgTable("feedbacks", {
  feedbackId: integer().primaryKey().generatedByDefaultAsIdentity(),
  eventId: integer()
    .notNull()
    .references(() => events.eventId),
  userId: integer()
    .notNull()
    .references(() => users.userId),
  comment: varchar(),
  createdAt,
  rating: integer().notNull(),
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
  event: one(events, {
    fields: [enrolls.eventId],
    references: [events.eventId],
  }),
  user: one(users, {
    fields: [enrolls.userId],
    references: [users.userId],
  }),
}));

export const feedbackRelations = relations(feedbacks, ({ one }) => ({
  event: one(events, {
    fields: [feedbacks.eventId],
    references: [events.eventId],
  }),
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.userId],
  }),
}));

export const eventLinkRelations = relations(eventLinks, ({ one }) => ({
  event: one(events, {
    fields: [eventLinks.eventId],
    references: [events.eventId],
  }),
}));
