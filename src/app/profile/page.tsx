import { db } from "@/db";
import { user, rsvps, events } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AnimatedEventCard } from "@/components/AnimatedEventCard";
import { Settings, LogOut, Award, Calendar, Users, Shield } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    with: {
      rsvps: {
        with: {
          event: {
            with: {
              rsvps: true,
            }
          }
        },
        orderBy: [desc(rsvps.createdAt)],
        limit: 10,
      },
      events: {
        orderBy: [desc(events.eventDate)],
        limit: 5,
        with: {
            rsvps: true,
        }
      }
    }
  });

  if (!userData) {
    redirect("/");
  }

  // Temporary auto-promotion for the owner
  if (userData.email === "loren.anderson.73@gmail.com" && userData.role !== "admin") {
    await db.update(user)
      .set({ role: "admin" })
      .where(eq(user.id, userData.id));
    userData.role = "admin";
  }

  const upcomingRsvps = userData.rsvps
    .filter(r => new Date(r.event.eventDate) >= new Date())
    .map(r => {
        const goingCount = r.event.rsvps.filter(rv => rv.status === 'going').length;
        const maybeCount = r.event.rsvps.filter(rv => rv.status === 'maybe').length;
        return {
            ...r.event,
            goingCount,
            maybeCount,
            userRsvp: r.status
        };
    });

  return (
    <div className="space-y-10 py-8">
      {/* Profile Header */}
      <section className="relative px-2">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5 relative overflow-hidden group">
          <div className="relative">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-black text-5xl border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                {userData.image ? (
                  <img src={userData.image} alt={userData.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{userData.name.charAt(0)}</span>
                )}
             </div>
             <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white dark:border-gray-900 group-hover:rotate-12 transition-transform">
                <Award className="h-5 w-5" />
             </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                {userData.name}
              </h1>
              <p className="text-gray-400 dark:text-gray-500 font-black text-xs uppercase tracking-[0.3em]">
                {userData.preferredLevel || "Player"} • Joined {new Date(userData.createdAt).getFullYear()}
              </p>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">
              {userData.bio || "No bio added yet. Tell everyone about your volleyball journey!"}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <Link 
                href="/settings"
                className="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit Profile
              </Link>
              {userData.role === 'admin' && (
                <Link 
                  href="/admin/members"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  <Shield className="h-4 w-4" />
                  Manage Members
                </Link>
              )}
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/10 transition-colors duration-500" />
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 px-2">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm text-center space-y-2">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 w-10 h-10 rounded-xl flex items-center justify-center mx-auto text-indigo-700 dark:text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{userData.rsvps.length}</p>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Sessions</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm text-center space-y-2">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 w-10 h-10 rounded-xl flex items-center justify-center mx-auto text-indigo-700 dark:text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{userData.events.length}</p>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Hosted</p>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[2rem] text-center space-y-2 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mx-auto">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-black leading-none">{userData.role === 'admin' ? 'Admin' : 'Regular'}</p>
            <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mt-1">Member Status</p>
          </div>
        </div>
      </section>

      {/* My Upcoming Events */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">My Schedule</h2>
          <div className="h-px bg-gray-100 dark:bg-white/10 w-full" />
        </div>
        
        {upcomingRsvps.length > 0 ? (
          <div className="grid gap-6">
            {upcomingRsvps.map((event, idx) => (
              <AnimatedEventCard key={event.id} event={event} index={idx} />
            ))}
          </div>
        ) : (
          <div className="bg-white/5 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center space-y-6 backdrop-blur-sm mx-2">
            <div className="bg-white dark:bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-400 shadow-sm">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 dark:text-white font-black text-xl">Empty Schedule</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">You haven't signed up for any upcoming sessions.</p>
            </div>
            <Link 
              href="/events" 
              className="inline-block bg-white dark:bg-white dark:text-gray-900 px-8 py-3 rounded-2xl text-indigo-600 text-sm font-black hover:bg-indigo-50 dark:hover:bg-indigo-400 transition-all shadow-lg shadow-black/5"
            >
              Find a Session
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
