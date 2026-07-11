import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

// Better Auth tables
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  // Custom profile fields
  bio: text("bio"),
  preferredLevel: text("preferred_level"), // beginner, intermediate, advanced, etc.
  isApproved: integer("is_approved", { mode: "boolean" }).notNull().default(true),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// App specific tables
export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  location: text("location"),
  allowMemberEvents: integer("allow_member_events", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const memberships = sqliteTable("memberships", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id),
  role: text("role", { enum: ["member", "organizer"] }).notNull().default("member"),
  status: text("status", { enum: ["pending", "active", "suspended"] }).notNull().default("pending"),
  joinedAt: integer("joined_at", { mode: "timestamp" }),
  approvedBy: text("approved_by").references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: integer("event_date", { mode: "timestamp" }).notNull(),
  startTime: text("start_time").notNull(), // HH:mm
  endTime: text("end_time"), // HH:mm
  locationName: text("location_name").notNull(),
  address: text("address"),
  mapUrl: text("map_url"),
  format: text("format").notNull(), // open play, doubles, etc.
  experienceLevel: text("experience_level").notNull(), // beginner, intermediate, etc.
  maxAttendees: integer("max_attendees"),
  visibility: text("visibility", { enum: ["public", "members"] }).notNull().default("public"),
  isWeatherDependent: integer("is_weather_dependent", { mode: "boolean" }).default(true),
  isCancelled: integer("is_cancelled", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => {
  return {
    eventDateIdx: index("event_date_idx").on(table.eventDate),
  };
});

export const rsvps = sqliteTable("rsvps", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  status: text("status", { enum: ["going", "maybe", "not_going"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => {
  return {
    eventUserIdx: index("event_user_idx").on(table.eventId, table.userId),
  };
});

export const eventMessages = sqliteTable("event_messages", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  content: text("content").notNull(),
  isEdited: integer("is_edited", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  publishDate: integer("publish_date", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  isPinned: integer("is_pinned", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  type: text("type").notNull(), // event_created, event_updated, etc.
  title: text("title").notNull(),
  body: text("body").notNull(),
  link: text("link"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
});

// Define relations
export const userRelations = relations(user, ({ many }) => ({
  memberships: many(memberships),
  events: many(events),
  rsvps: many(rsvps),
  eventMessages: many(eventMessages),
  announcements: many(announcements),
  notifications: many(notifications),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  memberships: many(memberships),
  events: many(events),
  announcements: many(announcements),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(user, {
    fields: [memberships.userId],
    references: [user.id],
  }),
  group: one(groups, {
    fields: [memberships.groupId],
    references: [groups.id],
  }),
  approvedBy: one(user, {
    fields: [memberships.approvedBy],
    references: [user.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  group: one(groups, {
    fields: [events.groupId],
    references: [groups.id],
  }),
  createdBy: one(user, {
    fields: [events.createdBy],
    references: [user.id],
  }),
  rsvps: many(rsvps),
  eventMessages: many(eventMessages),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  event: one(events, {
    fields: [rsvps.eventId],
    references: [events.id],
  }),
  user: one(user, {
    fields: [rsvps.userId],
    references: [user.id],
  }),
}));

export const eventMessagesRelations = relations(eventMessages, ({ one }) => ({
  event: one(events, {
    fields: [eventMessages.eventId],
    references: [events.id],
  }),
  user: one(user, {
    fields: [eventMessages.userId],
    references: [user.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  group: one(groups, {
    fields: [announcements.groupId],
    references: [groups.id],
  }),
  createdBy: one(user, {
    fields: [announcements.createdBy],
    references: [user.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id],
  }),
}));
