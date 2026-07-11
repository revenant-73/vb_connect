import { Calendar as CalendarIcon, Megaphone } from "lucide-react";
import Link from "next/link";
import { startOfToday } from "date-fns";
import { db } from "@/db";
import { events, announcements } from "@/db/schema";
import { desc, gte, and, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AnimatedEventCard } from "@/components/AnimatedEventCard";
import { HomePageHeader } from "@/components/HomePageHeader";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const today = startOfToday();

  // Fetch upcoming events
  const upcomingEventsData = await db.query.events.findMany({
    where: gte(events.eventDate, today),
    orderBy: [asc(events.eventDate), asc(events.startTime)],
    with: {
      rsvps: true,
    }
  });

  // Fetch active announcement
  const activeAnnouncement = await db.query.announcements.findFirst({
    where: and(
      gte(announcements.publishDate, today),
    ),
    orderBy: [desc(announcements.isPinned), desc(announcements.publishDate)],
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

  const nextEvent = formattedEvents[0];
  const otherEvents = formattedEvents.slice(1, 3);

  return (
    <div className="space-y-10 py-8">
      {/* Header */}
      <HomePageHeader />

      {/* Featured Announcement */}
      {activeAnnouncement && (
        <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100 relative overflow-hidden text-white group">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3">
               <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                 <Megaphone className="h-5 w-5 text-white" />
               </div>
               <h2 className="font-black text-lg uppercase tracking-widest">{activeAnnouncement.title}</h2>
            </div>
            <p className="text-indigo-50 text-base font-medium leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
              {activeAnnouncement.body}
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute right-4 bottom-4 opacity-10">
             <Megaphone className="h-32 w-32 rotate-12" />
          </div>
        </section>
      )}

      {/* Next Event */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Next Gathering</h2>
          <div className="h-px bg-gray-100 w-full" />
        </div>
        
        {nextEvent ? (
          <AnimatedEventCard event={nextEvent} isFeatured index={0} />
        ) : (
          <div className="bg-white/5 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center space-y-6 backdrop-blur-sm">
            <div className="bg-white dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-400 shadow-sm">
              <CalendarIcon className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 dark:text-white font-black text-xl">No sessions yet</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Be the one to start the next gathering!</p>
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

      {/* Upcoming List */}
      {otherEvents.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Upcoming</h2>
              <div className="h-px bg-gray-100 w-full" />
            </div>
            <Link href="/events" className="text-indigo-700 text-xs font-black uppercase tracking-widest ml-4 hover:underline">
              All
            </Link>
          </div>
          <div className="grid gap-6">
            {otherEvents.map((event, idx) => (
              <AnimatedEventCard key={event.id} event={event} index={idx + 1} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
