import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MemberRow } from "@/components/admin/MemberRow";
import { Users, ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";

export default async function AdminMembersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  const allUsers = await db.query.user.findMany({
    orderBy: (users, { asc }) => [asc(users.name)],
  });

  return (
    <div className="space-y-10 py-8">
      {/* Header */}
      <header className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Link 
            href="/profile" 
            className="bg-white dark:bg-gray-900 p-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Member Management</h1>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Admin Controls</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/requests"
            className="flex items-center gap-2 bg-amber-100 dark:bg-amber-500/20 px-4 py-2 rounded-2xl text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Location Requests
          </Link>
          <div className="bg-indigo-100 dark:bg-indigo-500/20 p-4 rounded-3xl text-indigo-700 dark:text-indigo-400">
             <Users className="h-6 w-6" />
          </div>
        </div>
      </header>

      {/* Member List */}
      <section className="space-y-4 px-2">
        <div className="flex items-center gap-4 px-2">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">All Members ({allUsers.length})</h2>
          <div className="h-px bg-gray-100 dark:bg-white/10 w-full" />
        </div>

        <div className="grid gap-4">
          {allUsers.map((member) => (
            <MemberRow key={member.id} member={member as any} />
          ))}
        </div>
      </section>
    </div>
  );
}
