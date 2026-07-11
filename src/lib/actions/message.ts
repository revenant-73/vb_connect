"use server";

import { db } from "@/db";
import { eventMessages } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function postMessage(eventId: string, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be signed in to post a message");
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
