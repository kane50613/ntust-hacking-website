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
  title: varchar().notNull(),
  description: varchar(),
  date: timestamp().notNull(),
  createdAt,
});

export const invites = pgTable("invites", {
  inviteId: integer().primaryKey().generatedByDefaultAsIdentity(),
  createdBy: integer()
    .notNull()
    .references(() => users.userId),
  code: varchar()
    .notNull()
    .unique()
    .$defaultFn(() =>
      Array.from({ length: 6 })
        .map(() => Math.floor(Math.random() * 10))
        .join("")
    ),
  createdAt,
  maxUsages: integer().notNull().default(1),
});

export const inviteUses = pgTable("invite_uses", {
  inviteUseId: integer().primaryKey().generatedByDefaultAsIdentity(),
  inviteId: integer()
    .notNull()
    .references(() => invites.inviteId),
  userId: integer()
    .notNull()
    .references(() => users.userId),
  createdAt,
});

export const roles = pgEnum("role", ["guest", "user", "admin"]);

export type Role = (typeof roles.enumValues)[number];

export const users = pgTable("users", {
  userId: integer().primaryKey().generatedByDefaultAsIdentity(),
  discordId: bigint({ mode: "bigint" }).notNull().unique(),
  role: roles().notNull().default("guest"),
  name: varchar().notNull(),
  email: varchar().unique().notNull(),
  avatar: varchar().notNull(),
  createdAt,
});

export const teachers = pgTable(
  "teachers",
  {
    teacherId: integer().primaryKey().generatedByDefaultAsIdentity(),
    eventId: integer()
      .notNull()
      .references(() => events.eventId, {
        onDelete: "cascade",
      }),
    userId: integer()
      .notNull()
      .references(() => users.userId, {
        onDelete: "cascade",
      }),
    createdAt,
  },
  (teacher) => [uniqueIndex().on(teacher.eventId, teacher.userId)]
);

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
    groupId: integer().references(() => groups.groupId, {
      onDelete: "set null",
    }),
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
  teachers: many(teachers),
  groups: many(groups),
}));

export const userRelations = relations(users, ({ many, one }) => ({
  enrolls: many(enrolls),
  teaching: many(teachers),
  createdInvites: many(invites),
  usedInvites: one(inviteUses),
}));

export const teacherRelations = relations(teachers, ({ one }) => ({
  event: one(events, {
    fields: [teachers.eventId],
    references: [events.eventId],
  }),
  user: one(users, {
    fields: [teachers.userId],
    references: [users.userId],
  }),
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

export const inviteRelations = relations(invites, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [invites.createdBy],
    references: [users.userId],
  }),
  uses: many(inviteUses),
}));

export const inviteUseRelations = relations(inviteUses, ({ one }) => ({
  invite: one(invites, {
    fields: [inviteUses.inviteId],
    references: [invites.inviteId],
  }),
  user: one(users, {
    fields: [inviteUses.userId],
    references: [users.userId],
  }),
}));
