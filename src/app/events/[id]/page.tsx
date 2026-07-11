import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  CloudRain,
  Share2,
  Users,
  Info
} from "lucide-react";
import { RSVPButtons } from "@/components/RSVPButtons";
import { EventMessages } from "@/components/EventMessages";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { formatTime } from "@/lib/utils";

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: {
      createdBy: true,
      rsvps: {
        with: {
          user: true,
        }
      },
      eventMessages: {
        with: {
          user: true,
        },
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      }
    }
  });

  if (!event) {
    notFound();
  }

  const goingRsvps = event.rsvps.filter(r => r.status === 'going');
  const userRsvp = session?.user ? event.rsvps.find(r => r.userId === session.user.id) : null;

  return (
    <div className="pb-32 md:pb-12 space-y-6 md:space-y-8 max-w-2xl mx-auto -mt-4 md:mt-0">
      {/* Floating Header for Mobile */}
      <header className="sticky top-0 z-[40] -mx-4 px-4 py-4 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-xl flex justify-between items-center border-b border-gray-100 dark:border-white/5 md:relative md:top-auto md:bg-transparent md:border-none md:px-2 md:py-6">
        <Link 
          href="/" 
          className="bg-white dark:bg-gray-900 p-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div className="flex-1 px-4 text-center md:hidden">
          <h2 className="font-black text-sm text-gray-900 dark:text-white truncate uppercase tracking-tight">{event.title}</h2>
        </div>
        <div className="flex gap-2">
          <button className="bg-white dark:bg-gray-900 p-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 text-gray-500 hover:text-indigo-700 transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="space-y-6 pt-2">
        <div className="space-y-4 px-2">
          <div className="flex items-center gap-3">
             <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 dark:shadow-none">
                {event.format}
             </span>
             <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {event.experienceLevel}
             </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1] tracking-tighter">
            {event.title}
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-gray-500 dark:text-gray-400">
              {event.createdBy.name.charAt(0)}
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Organized by <span className="text-gray-900 dark:text-white">{event.createdBy.name}</span>
            </p>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-4 rounded-[1.5rem] text-indigo-700 dark:text-indigo-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white text-xl leading-tight">
                {format(new Date(event.eventDate), 'EEEE, MMM do')}
              </p>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mt-1">
                {formatTime(event.startTime)} {event.endTime ? ` - ${formatTime(event.endTime)}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm group">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-4 rounded-[1.5rem] text-indigo-700 dark:text-indigo-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 dark:text-white text-xl leading-tight truncate">
                {event.locationName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] truncate">
                  {event.address || "Hillsboro, OR"}
                </p>
                {event.mapUrl && (
                  <a 
                    href={event.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest hover:underline whitespace-nowrap"
                  >
                    Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {event.isWeatherDependent && (
          <div className="mx-2 flex items-center gap-3 text-[10px] font-black text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-400/10 p-4 rounded-[1.5rem] border border-amber-100/50 dark:border-amber-400/20 uppercase tracking-widest">
            <CloudRain className="h-4 w-4" />
            <span>Weather dependent gathering</span>
          </div>
        )}
      </section>

      {/* Interactive Content Tabs/Sections */}
      <div className="space-y-12 pt-4 px-1">
        
        {/* About the Event */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">The Details</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 text-gray-700 dark:text-gray-300 font-medium leading-relaxed shadow-sm text-sm md:text-base">
            {event.description || "No additional details provided."}
          </div>
        </section>

        {/* Attendance - Redesigned for mobile as a mini-grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">The Squad</h2>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">{goingRsvps.length} IN</span>
              {event.maxAttendees && (
                <>
                  <span className="w-1 h-1 bg-indigo-300 dark:bg-indigo-800 rounded-full" />
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-500 uppercase tracking-wider">{event.maxAttendees} MAX</span>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex flex-wrap gap-4">
              {goingRsvps.map((rsvp) => (
                <div key={rsvp.id} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 font-black border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden group hover:scale-105 transition-transform">
                    {rsvp.user.image ? (
                      <img src={rsvp.user.image} alt={rsvp.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{rsvp.user.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tight max-w-[60px] truncate text-center">
                    {rsvp.user.name.split(' ')[0]}
                  </span>
                </div>
              ))}
              {goingRsvps.length === 0 && (
                <div className="w-full py-8 text-center space-y-2">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Waiting for the first player</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Message Discussion */}
        <section id="discussion" className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Share2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Discussion</h2>
          </div>
          <div className="min-h-[400px]">
            <EventMessages 
              eventId={event.id} 
              messages={event.eventMessages.map(m => ({
                ...m,
                user: {
                  ...m.user,
                }
              }))}
              currentUserId={session?.user?.id}
            />
          </div>
        </section>

        {/* Detail Meta */}
        <footer className="py-8 flex flex-col items-center gap-3 text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em]">
          <span>Posted {format(new Date(event.createdAt), 'MMMM do, yyyy')}</span>
          <div className="w-8 h-px bg-gray-100 dark:bg-white/5" />
          <span>VB Connect</span>
        </footer>
      </div>

      {/* Sticky RSVP Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-t border-gray-100 dark:border-white/5 md:bg-gray-900 md:dark:bg-white md:rounded-[3rem] md:static md:mx-0 md:mt-8 md:p-8 md:text-white md:dark:text-gray-900 md:shadow-2xl">
        <div className="max-w-2xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="hidden md:block">
            <h2 className="font-black text-xl tracking-tight">Are you playing?</h2>
            <p className="text-sm opacity-60 font-medium">Let everyone know your status</p>
          </div>
          <div className="flex-1 md:max-w-xs">
            <RSVPButtons eventId={event.id} currentStatus={userRsvp?.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
