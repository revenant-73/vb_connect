"use server";

import { db } from "@/db";
import { locationRequests } from "@/db/schema";
import { sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

import { revalidatePath } from "next/cache";

export async function submitLocationRequest(type: "metro" | "zone", suggestion: string, context?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be signed in to submit a request");
  }

  if (!suggestion.trim()) {
    throw new Error("Suggestion cannot be empty");
  }

  await db.insert(locationRequests).values({
    id: nanoid(),
    userId: session.user.id,
    type,
    suggestion: suggestion.trim(),
    context: context?.trim(),
  });

  return { success: true };
}

export async function updateLocationRequestStatus(requestId: string, status: "approved" | "rejected") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }

  await db.update(locationRequests)
    .set({ status })
    .where(sql`id = ${requestId}`);

  revalidatePath("/admin/requests");
  return { success: true };
}
