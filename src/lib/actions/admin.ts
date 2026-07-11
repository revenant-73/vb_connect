"use server";

import { db } from "@/db";
import { user, memberships } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  await verifyAdmin();

  await db.update(user)
    .set({ role })
    .where(eq(user.id, userId));

  revalidatePath("/admin/members");
}

export async function updateUserApproval(userId: string, isApproved: boolean) {
  await verifyAdmin();

  await db.update(user)
    .set({ isApproved })
    .where(eq(user.id, userId));

  revalidatePath("/admin/members");
}

export async function updateMembershipStatus(membershipId: string, status: "pending" | "active" | "suspended") {
  await verifyAdmin();

  await db.update(memberships)
    .set({ 
        status,
        joinedAt: status === "active" ? new Date() : null,
        updatedAt: new Date(),
    })
    .where(eq(memberships.id, membershipId));

  revalidatePath("/admin/members");
}

export async function updateMembershipRole(membershipId: string, role: "member" | "organizer") {
  await verifyAdmin();

  await db.update(memberships)
    .set({ 
        role,
        updatedAt: new Date(),
    })
    .where(eq(memberships.id, membershipId));

  revalidatePath("/admin/members");
}
