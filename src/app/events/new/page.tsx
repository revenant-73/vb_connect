"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormValues } from "@/lib/validations/event";
import { createEvent } from "@/lib/actions/event";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/context/AuthModalContext";

export default function NewEventPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { openAuthModal } = useAuthModal();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      openAuthModal();
    }
  }, [session, isSessionLoading, openAuthModal]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      visibility: "public",
      isWeatherDependent: true,
      format: "Open Play",
      experienceLevel: "Everyone Welcome",
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        await createEvent(data);
      } catch (err: any) {
        // Handle redirect errors properly in transitions
        if (err.message === "NEXT_REDIRECT") {
          return;
        }
        
        // Better error formatting for Zod errors or other objects
        let errorMessage = "Failed to create event";
        if (typeof err.message === "string") {
          try {
            // Check if it's stringified JSON from Zod
            if (err.message.startsWith("[") || err.message.startsWith("{")) {
              const parsed = JSON.parse(err.message);
              if (Array.isArray(parsed)) {
                errorMessage = parsed.map(p => p.message).join(", ");
              } else {
                errorMessage = parsed.message || errorMessage;
              }
            } else {
              errorMessage = err.message;
            }
          } catch {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
      }
    });
  };

  return (
    <div className="py-8 space-y-8 max-w-2xl mx-auto">
      <header className="flex items-center gap-4 px-2">
        <Link 
          href="/" 
          className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Create Event</h1>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
          <div className="bg-red-500 text-white p-1 rounded-full">
            <ChevronLeft className="h-3 w-3 rotate-180" />
          </div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none">
        {/* Title */}
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Event Title</label>
          <input
            {...register("title")}
            placeholder="e.g., Saturday Morning Grass"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
          {errors.title && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">{errors.title.message}</p>}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Date</label>
            <input
              type="date"
              {...register("eventDate")}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold"
            />
            {errors.eventDate && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">{errors.eventDate.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Start</label>
              <input
                type="time"
                {...register("startTime")}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold"
              />
              {errors.startTime && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">{errors.startTime.message}</p>}
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">End (Opt)</label>
              <input
                type="time"
                {...register("endTime")}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Location Name</label>
            <input
              {...register("locationName")}
              placeholder="e.g., 53rd Ave Park"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
            {errors.locationName && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">{errors.locationName.message}</p>}
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Address / Instructions</label>
            <textarea
              {...register("address")}
              placeholder="e.g., Near the playground on the south side"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600 min-h-[100px] resize-none"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Map URL (Google Maps)</label>
            <input
              {...register("mapUrl")}
              placeholder="https://goo.gl/maps/..."
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
            {errors.mapUrl && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">{errors.mapUrl.message}</p>}
          </div>
        </div>

        {/* Format and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Format</label>
            <div className="relative">
              <select
                {...register("format")}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold appearance-none cursor-pointer"
              >
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Open Play</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Doubles</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Triples</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Quads</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Sixes</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">King/Queen</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Tournament</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Other</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronLeft className="h-4 w-4 rotate-270" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Experience Level</label>
            <div className="relative">
              <select
                {...register("experienceLevel")}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold appearance-none cursor-pointer"
              >
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Everyone Welcome</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Beginner-friendly</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Intermediate</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Advanced</option>
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Mixed Level</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronLeft className="h-4 w-4 rotate-270" />
              </div>
            </div>
          </div>
        </div>

        {/* Toggles & Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Player Limit (Opt)</label>
            <input
              type="number"
              {...register("maxAttendees")}
              placeholder="e.g., 20"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
            {errors.maxAttendees && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">{errors.maxAttendees.message}</p>}
          </div>
          <div className="flex items-center h-full pt-6">
            <label className="group flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  {...register("isWeatherDependent")}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 dark:bg-white/10 rounded-full peer peer-checked:bg-indigo-600 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6"></div>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-bold uppercase tracking-widest">Weather dependent</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Additional Details</label>
          <textarea
            {...register("description")}
            placeholder="Anything else people should know? (e.g., bring water, nets needed)"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600 min-h-[140px] resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-gray-200 dark:shadow-none hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
        >
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            "Create Event"
          )}
        </button>
      </form>
    </div>
  );
}
