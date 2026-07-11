"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";

interface EventCardProps {
  event: any;
  isFeatured?: boolean;
  index?: number;
}

export function AnimatedEventCard({ event, isFeatured = false, index = 0 }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <Link 
        href={`/events/${event.id}`}
        className={cn(
          "block relative overflow-hidden group transition-all duration-300",
          "bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]",
          isFeatured ? "ring-2 ring-indigo-600/20 ring-offset-4 dark:ring-offset-gray-950" : ""
        )}
      >
        {/* Decorative background element for featured cards */}
        {isFeatured && (
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors duration-500" />
        )}

        <div className="p-6 md:p-8 space-y-5 relative z-10">
          <div className="flex justify-between items-start gap-4">
            <h3 className={cn(
              "font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight group-hover:text-indigo-600 transition-colors",
              isFeatured ? "text-2xl md:text-3xl" : "text-xl"
            )}>
              {event.title}
            </h3>
            {event.userRsvp === 'going' && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] flex-shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Going
              </motion.span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm font-bold gap-3 bg-gray-50/50 dark:bg-white/5 py-2 px-3 rounded-xl border border-gray-100/50 dark:border-white/5">
              <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
              </div>
              <span className="truncate">
                {format(new Date(event.eventDate), 'EEE, MMM d')} • {formatTime(event.startTime)}
              </span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm font-bold gap-3 bg-gray-50/50 dark:bg-white/5 py-2 px-3 rounded-xl border border-gray-100/50 dark:border-white/5">
              <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
              </div>
              <span className="truncate">{event.locationName}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(3, event.goingCount))].map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-indigo-200 dark:bg-indigo-500/30 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-black text-indigo-700 dark:text-indigo-400 overflow-hidden">
                      <Users className="h-3 w-3" />
                    </div>
                  ))}
                  {event.goingCount > 3 && (
                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-black text-gray-600 dark:text-gray-400">
                      +{event.goingCount - 3}
                    </div>
                  )}
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="font-black text-gray-900 dark:text-white text-sm">{event.goingCount}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider">Going</span>
                </div>
              </div>

              {event.maybeCount > 0 && (
                <div className="flex flex-col -space-y-1">
                  <span className="font-black text-gray-600 dark:text-gray-400 text-sm">{event.maybeCount}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider">Maybe</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 pr-8">
              <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                {event.format}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
           <div className="bg-indigo-700 p-2 rounded-full text-white shadow-lg">
             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
             </svg>
           </div>
        </div>
      </Link>
    </motion.div>
  );
}
