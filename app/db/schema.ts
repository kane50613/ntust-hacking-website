import { relations } from "drizzle-orm";
import {
  bigint,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

const createdAt = timestamp().notNull().defaultNow();

export const events = pgTable("events", {
  eventId: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: varchar(),
  description: varchar(),
  date: timestamp(),
  createdAt,
});

export const role = pgEnum("role", ["admin", "user", "guest"]);

export type Role = (typeof role.enumValues)[number];

export const users = pgTable("users", {
  userId: integer().primaryKey().generatedByDefaultAsIdentity(),
  discordId: bigint({ mode: "bigint" }).notNull().unique(),
  role: role().notNull().default("user"),
  name: varchar().notNull(),
  email: varchar().unique(),
  avatar: varchar().notNull(),
  createdAt,
});

export const enrolls = pgTable(
  "enrolls",
  {
    enrollId: integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: integer()
      .notNull()
      .references(() => users.userId, {
        onDelete: "cascade",
      }),
    eventId: integer()
      .notNull()
      .references(() => events.eventId, {
        onDelete: "cascade",
      }),
    createdAt,
    groupId: integer(),
  },
  (table) => [uniqueIndex().on(table.userId, table.eventId)]
);

export const groups = pgTable("groups", {
  groupId: integer().primaryKey().generatedByDefaultAsIdentity(),
  eventId: integer()
    .notNull()
    .references(() => events.eventId, {
      onDelete: "cascade",
    }),
  name: varchar().notNull(),
  createdAt,
});

export const feedbacks = pgTable("feedbacks", {
  feedbackId: integer().primaryKey().generatedByDefaultAsIdentity(),
  enrollId: integer()
    .notNull()
    .unique()
    .references(() => enrolls.enrollId, {
      onDelete: "cascade",
    }),
  comment: varchar(),
  createdAt,
  rating: integer().notNull(),
});

export const eventRelations = relations(events, ({ many }) => ({
  enrolls: many(enrolls),
  groups: many(groups),
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
  feedback: one(feedbacks),
  group: one(groups, {
    fields: [enrolls.groupId],
    references: [groups.groupId],
  }),
}));

export const feedbackRelations = relations(feedbacks, ({ one }) => ({
  enroll: one(enrolls, {
    fields: [feedbacks.enrollId],
    references: [enrolls.enrollId],
  }),
}));

export const groupRelations = relations(groups, ({ many, one }) => ({
  enrolls: many(enrolls),
  event: one(events, {
    fields: [groups.eventId],
    references: [events.eventId],
  }),
}));
