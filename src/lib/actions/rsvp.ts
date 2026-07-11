"use server";

import { db } from "@/db";
import { rsvps } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";

export async function updateRSVP(eventId: string, status: "going" | "maybe" | "not_going") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be signed in to RSVP");
  }

  if (!session.user.isApproved) {
    throw new Error("Your account is pending approval.");
  }

  const existing = await db.query.rsvps.findFirst({
    where: and(
      eq(rsvps.eventId, eventId),
      eq(rsvps.userId, session.user.id)
    ),
  });

  if (existing) {
    await db.update(rsvps)
      .set({ status, updatedAt: new Date() })
      .where(eq(rsvps.id, existing.id));
  } else {
    await db.insert(rsvps).values({
      id: nanoid(),
      eventId,
      userId: session.user.id,
      status,
    });
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
}
