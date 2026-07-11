import { Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { startOfToday } from "date-fns";
import { db } from "@/db";
import { events } from "@/db/schema";
import { gte, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AnimatedEventCard } from "@/components/AnimatedEventCard";

export default async function EventsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const today = startOfToday();

  // Fetch all upcoming events
  const upcomingEventsData = await db.query.events.findMany({
    where: gte(events.eventDate, today),
    orderBy: [asc(events.eventDate), asc(events.startTime)],
    with: {
      rsvps: true,
    }
  });

  const formattedEvents = upcomingEventsData.map(event => {
    const goingCount = event.rsvps.filter(r => r.status === 'going').length;
    const maybeCount = event.rsvps.filter(r => r.status === 'maybe').length;
    const userRsvp = session?.user ? event.rsvps.find(r => r.userId === session.user.id)?.status : null;
    
    return {
      ...event,
      goingCount,
      maybeCount,
      userRsvp,
    };
  });

  return (
    <div className="space-y-10 py-8">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Events
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Discover and join upcoming volleyball sessions.
        </p>
      </section>

      {/* Events List */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">
            Upcoming Gatherings
          </h2>
          <div className="h-px bg-gray-100 dark:bg-white/10 w-full" />
        </div>
        
        {formattedEvents.length > 0 ? (
          <div className="grid gap-6">
            {formattedEvents.map((event, idx) => (
              <AnimatedEventCard key={event.id} event={event} index={idx} />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center space-y-6 backdrop-blur-sm">
            <div className="bg-white dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-400 shadow-sm">
              <CalendarIcon className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 dark:text-white font-black text-xl">No upcoming sessions</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Check back later or host your own!</p>
            </div>
            <Link 
              href="/events/new" 
              className="inline-block bg-white dark:bg-white dark:text-gray-900 px-8 py-3 rounded-2xl text-indigo-600 text-sm font-black hover:bg-indigo-50 dark:hover:bg-indigo-400 transition-all shadow-lg shadow-black/5"
            >
              Host Session
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
