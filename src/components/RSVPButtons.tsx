"use client";

import { updateRSVP } from "@/lib/actions/rsvp";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check, X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/context/AuthModalContext";

interface RSVPButtonsProps {
  eventId: string;
  currentStatus?: string;
}

export function RSVPButtons({ eventId, currentStatus }: RSVPButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { data: session } = authClient.useSession();
  const { openAuthModal } = useAuthModal();

  const handleRSVP = (status: "going" | "maybe" | "not_going") => {
    if (!session) {
      openAuthModal();
      return;
    }
    if (isPending || currentStatus === status) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateRSVP(eventId, status);
      } catch (err: any) {
        setError(err.message || "Failed to update RSVP");
      }
    });
  };

  const statuses = [
    { value: "going", label: "Going", icon: Check, activeClass: "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" },
    { value: "maybe", label: "Maybe", icon: HelpCircle, activeClass: "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-none" },
    { value: "not_going", label: "No", icon: X, activeClass: "bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900 shadow-lg shadow-gray-200 dark:shadow-none" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl md:rounded-[1.5rem] border border-gray-200 dark:border-white/5">
        {statuses.map((s) => {
          const isActive = currentStatus === s.value;
          const Icon = s.icon;
          
          return (
            <motion.button
              key={s.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRSVP(s.value)}
              disabled={isPending}
              className={cn(
                "relative flex-1 py-3.5 md:py-3 px-2 rounded-xl md:rounded-2xl border text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 overflow-hidden",
                isActive 
                  ? s.activeClass 
                  : "bg-white dark:bg-gray-900 border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="rsvp-active-bg"
                  className="absolute inset-0 z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-1">
                <AnimatePresence mode="wait">
                  {isPending && isActive ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-300")} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span>{s.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
