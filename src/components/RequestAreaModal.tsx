"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitLocationRequest } from "@/lib/actions/location";
import { cn } from "@/lib/utils";

interface RequestAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "metro" | "zone";
  context?: string;
}

export function RequestAreaModal({ isOpen, onClose, defaultType = "metro", context }: RequestAreaModalProps) {
  const [isPending, startTransition] = useTransition();
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || isPending) return;

    setError(null);
    startTransition(async () => {
      try {
        await submitLocationRequest(defaultType, suggestion, context);
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          // Reset after closing animation
          setTimeout(() => {
            setSubmitted(false);
            setSuggestion("");
          }, 500);
        }, 2000);
      } catch (err: any) {
        setError(err.message || "Failed to submit request");
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto border border-gray-100 dark:border-white/5"
            >
              <div className="p-8 md:p-10 space-y-8 relative">
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>

                {submitted ? (
                  <div className="py-12 text-center space-y-6">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="bg-green-100 dark:bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400"
                    >
                      <CheckCircle2 className="h-10 w-10" />
                    </motion.div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">Suggestion Sent!</h2>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">Thanks for helping us grow the community.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 text-center pt-2">
                      <div className="bg-indigo-100 dark:bg-indigo-500/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto text-indigo-700 dark:text-indigo-400 mb-4">
                        <MapPin className="h-8 w-8" />
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                        Suggest a {defaultType === "metro" ? "Metro Area" : "Zone"}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                        {defaultType === "metro" 
                          ? "Want to see your city on the map? Let us know where you play!" 
                          : `Suggest a new activity zone for the ${context} area.`}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                          {defaultType === "metro" ? "City / Metro Name" : "Activity Zone Name"}
                        </label>
                        <input
                          autoFocus
                          value={suggestion}
                          onChange={(e) => setSuggestion(e.target.value)}
                          placeholder={defaultType === "metro" ? "e.g., Seattle, WA" : "e.g., Downtown Parks"}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-bold"
                          disabled={isPending}
                        />
                        {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">{error}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={!suggestion.trim() || isPending}
                        className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black py-5 rounded-[2rem] hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
                      >
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Suggestion
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
