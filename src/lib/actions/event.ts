"use server";

import { db } from "@/db";
import { events, groups, memberships, rsvps } from "@/db/schema";
import { eventSchema, type EventFormValues } from "@/lib/validations/event";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

async function getOrCreateDefaultGroup() {
  const defaultSlug = "vb-connect";
  let group = await db.query.groups.findFirst({
    where: eq(groups.slug, defaultSlug),
  });

  if (!group) {
    const groupId = nanoid();
    [group] = await db.insert(groups).values({
      id: groupId,
      name: "VB Connect",
      slug: defaultSlug,
      description: "Casual volleyball gatherings for everyone",
      location: "Local Courts",
    }).returning();
  }

  return group;
}

export async function createEvent(values: EventFormValues) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.isApproved) {
    throw new Error("Your account is pending approval.");
  }

  const validatedFields = eventSchema.parse(values);
  const group = await getOrCreateDefaultGroup();

  const eventId = nanoid();
  
  await db.transaction(async (tx) => {
    await tx.insert(events).values({
      id: eventId,
      groupId: group.id,
      createdBy: session.user.id,
      title: validatedFields.title,
      description: validatedFields.description,
      eventDate: validatedFields.eventDate,
      startTime: validatedFields.startTime,
      endTime: validatedFields.endTime || null,
      locationName: validatedFields.locationName,
      metro: validatedFields.metro,
      activityZone: validatedFields.activityZone,
      address: validatedFields.address || null,
      mapUrl: validatedFields.mapUrl || null,
      latitude: validatedFields.latitude || null,
      longitude: validatedFields.longitude || null,
      format: validatedFields.format,
      experienceLevel: validatedFields.experienceLevel,
      maxAttendees: validatedFields.maxAttendees || null,
      visibility: validatedFields.visibility,
      isWeatherDependent: validatedFields.isWeatherDependent,
    });

    // Auto-RSVP the creator as 'going'
    await tx.insert(rsvps).values({
      id: nanoid(),
      eventId: eventId,
      userId: session.user.id,
      status: "going",
    });
  });

  revalidatePath("/");
  revalidatePath("/events");
  redirect("/");
}
