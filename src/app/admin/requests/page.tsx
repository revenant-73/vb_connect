import { db } from "@/db";
import { locationRequests, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MapPin, ChevronLeft, Clock, CheckCircle2, XCircle, Users } from "lucide-react";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { RequestStatusButtons } from "@/components/admin/RequestStatusButtons";

export default async function AdminRequestsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  const requests = await db.query.locationRequests.findMany({
    with: {
      user: true,
    },
    orderBy: [desc(locationRequests.createdAt)],
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
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Location Requests</h1>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">User Suggestions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/members"
            className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-500/20 px-4 py-2 rounded-2xl text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
          >
            <Users className="h-4 w-4" />
            Member Management
          </Link>
          <div className="bg-amber-100 dark:bg-amber-500/20 p-4 rounded-3xl text-amber-700 dark:text-amber-400">
             <MapPin className="h-6 w-6" />
          </div>
        </div>
      </header>

      {/* Requests List */}
      <section className="space-y-4 px-2">
        <div className="flex items-center gap-4 px-2">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Pending & Past Suggestions ({requests.length})</h2>
          <div className="h-px bg-gray-100 dark:bg-white/10 w-full" />
        </div>

        <div className="grid gap-4">
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
              <p className="text-gray-400 font-bold">No requests found</p>
            </div>
          ) : (
            requests.map((request) => (
              <div 
                key={request.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        request.type === "metro" 
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                      }`}>
                        {request.type}
                      </span>
                      {request.status === "pending" && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                      {request.status === "approved" && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Approved
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                      {request.suggestion}
                    </h3>
                    {request.context && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Context: {request.context}
                      </p>
                    )}
                  </div>
                  
                  {request.status === "pending" && (
                    <RequestStatusButtons requestId={request.id} />
                  )}
                </div>

                <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Suggested by {request.user.name}</span>
                  <span>{new Date(request.createdAt!).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
