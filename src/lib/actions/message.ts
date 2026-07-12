"use server";

import { db } from "@/db";
import { eventMessages, rsvps } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { and, eq, ne } from "drizzle-orm";

export async function postMessage(eventId: string, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be signed in to post a message");
  }

  // Check if user is RSVP'd
  const rsvp = await db.query.rsvps.findFirst({
    where: and(
      eq(rsvps.eventId, eventId),
      eq(rsvps.userId, session.user.id),
      ne(rsvps.status, "not_going")
    )
  });

  if (!rsvp) {
    throw new Error("You must RSVP 'Going' or 'Maybe' to participate in this discussion.");
  }

  if (!session.user.isApproved) {
    throw new Error("Your account is pending approval.");
  }

  if (!content.trim()) {
    throw new Error("Message cannot be empty");
  }

  await db.insert(eventMessages).values({
    id: nanoid(),
    eventId,
    userId: session.user.id,
    content: content.trim(),
  });

  revalidatePath(`/events/${eventId}`);
}
