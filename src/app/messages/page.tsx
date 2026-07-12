import { db } from "@/db";
import { events, eventMessages, rsvps } from "@/db/schema";
import { eq, desc, and, gte, sql, inArray, ne } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Calendar, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  // 1. Get IDs of events the user is involved in (RSVP'd going or maybe)
  const userRsvps = await db.query.rsvps.findMany({
    where: and(
      eq(rsvps.userId, session.user.id),
      ne(rsvps.status, "not_going")
    ),
    columns: {
      eventId: true,
    }
  });

  const involvedEventIds = userRsvps.map(r => r.eventId);

  if (involvedEventIds.length === 0) {
    return (
      <div className="space-y-10 py-8">
        <section className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Messages
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Discussion for upcoming and recent sessions.
          </p>
        </section>

        <section className="space-y-4">
          <div className="bg-white/5 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center space-y-6 backdrop-blur-sm">
            <div className="bg-white dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-400 shadow-sm">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 dark:text-white font-black text-xl">No active chats</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">RSVP to an event to see its discussion!</p>
            </div>
            <Link 
              href="/events" 
              className="inline-block bg-white dark:bg-white dark:text-gray-900 px-8 py-3 rounded-2xl text-indigo-600 text-sm font-black hover:bg-indigo-50 dark:hover:bg-indigo-400 transition-all shadow-lg shadow-black/5"
            >
              Browse Events
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // 2. Fetch those events and their latest messages
  const activeChats = await db.query.events.findMany({
    where: inArray(events.id, involvedEventIds),
    with: {
      eventMessages: {
        orderBy: [desc(eventMessages.createdAt)],
        limit: 1,
        with: {
          user: true,
        }
      },
    },
  });

  // Filter and sort by latest message
  const sortedChats = activeChats
    .filter(event => event.eventMessages.length > 0)
    .sort((a, b) => {
      const dateA = new Date(a.eventMessages[0].createdAt).getTime();
      const dateB = new Date(b.eventMessages[0].createdAt).getTime();
      return dateB - dateA;
    });

  return (
    <div className="space-y-10 py-8">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Messages
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Discussion for upcoming and recent sessions.
        </p>
      </section>

      {/* Chats List */}
      <section className="space-y-4">
        {sortedChats.length > 0 ? (
          <div className="grid gap-4">
            {sortedChats.map((event) => {
              const latestMessage = event.eventMessages[0];
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}#discussion`}
                  className="group block bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-4 rounded-2xl text-indigo-700 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-gray-900 dark:text-white truncate">
                          {event.title}
                        </h3>
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap pt-1">
                          {formatDistanceToNow(new Date(latestMessage.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                        <span className="font-black text-gray-700 dark:text-gray-300">
                          {latestMessage.user.name.split(' ')[0]}:
                        </span>{" "}
                        {latestMessage.content}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/5 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center space-y-6 backdrop-blur-sm">
            <div className="bg-white dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-400 shadow-sm">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 dark:text-white font-black text-xl">No messages yet</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Join an event to start a discussion!</p>
            </div>
            <Link 
              href="/events" 
              className="inline-block bg-white dark:bg-white dark:text-gray-900 px-8 py-3 rounded-2xl text-indigo-600 text-sm font-black hover:bg-indigo-50 dark:hover:bg-indigo-400 transition-all shadow-lg shadow-black/5"
            >
              Browse Events
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
