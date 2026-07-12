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
          "bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-[1.5rem] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
        )}
      >
        {/* Decorative background element for featured cards */}
        {isFeatured && (
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors duration-500" />
        )}

        <div className="p-4 md:p-6 flex items-center justify-between gap-4 relative z-10">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-gray-900 dark:text-white text-lg truncate group-hover:text-indigo-600 transition-colors">
                {event.title}
              </h3>
              {event.userRsvp === 'going' && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" title="You are going" />
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-700 dark:text-indigo-400" />
                <span>
                  {format(new Date(event.eventDate), 'MM/dd/yy')} • {formatTime(event.startTime)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-indigo-700 dark:text-indigo-400" />
                <span className="truncate">{event.locationName}{event.activityZone ? ` (${event.activityZone})` : ""}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
             <div className="flex flex-col items-end">
                <span className="font-black text-gray-900 dark:text-white text-sm">{event.goingCount}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-tight">Going</span>
             </div>
             <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-full text-gray-300 dark:text-gray-600 group-hover:bg-indigo-700 group-hover:text-white transition-all duration-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
             </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
