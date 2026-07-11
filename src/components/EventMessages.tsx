"use client";

import { postMessage } from "@/lib/actions/message";
import { useState, useTransition, useRef, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/context/AuthModalContext";

interface Message {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: {
    name: string;
    image: string | null;
  };
}

interface EventMessagesProps {
  eventId: string;
  messages: Message[];
  currentUserId?: string;
}

export function EventMessages({ eventId, messages, currentUserId }: EventMessagesProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();
  const { openAuthModal } = useAuthModal();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      openAuthModal();
      return;
    }
    if (!content.trim() || isPending) return;

    startTransition(async () => {
      try {
        await postMessage(eventId, content);
        setContent("");
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto scroll-smooth max-h-[500px] scrollbar-hide dark:bg-gray-900"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isOwn = msg.userId === currentUserId;
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-2.5 md:gap-3 max-w-[90%] md:max-w-[85%]",
                  isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {!isOwn && (
                  <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400 overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm self-end mb-1">
                    {msg.user.image ? (
                      <img src={msg.user.image} alt={msg.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] md:text-[10px] font-black">{msg.user.name.charAt(0)}</span>
                    )}
                  </div>
                )}
                <div className={cn("space-y-1", isOwn ? "items-end" : "items-start")}>
                  <div className={cn(
                    "p-3.5 md:p-4 text-[13px] md:text-sm leading-relaxed shadow-sm",
                    isOwn 
                      ? "bg-gray-900 dark:bg-indigo-600 text-white rounded-2xl md:rounded-[1.5rem] rounded-br-none" 
                      : "bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-200 rounded-2xl md:rounded-[1.5rem] rounded-bl-none border border-gray-100 dark:border-white/10"
                  )}>
                    {msg.content}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 md:gap-2 px-1 text-[8px] md:text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest",
                    isOwn ? "justify-end text-right" : "justify-start text-left"
                  )}>
                    <span>{msg.user.name}</span>
                    <span className="opacity-40">•</span>
                    <span>{format(new Date(msg.createdAt), 'MMM d, h:mm a')}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-3xl">
              <MessageCircle className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 dark:text-white font-black text-lg">No messages yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Start the conversation!</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-white/10">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="w-full pl-6 pr-14 py-4 rounded-[2rem] border-2 border-transparent bg-white dark:bg-gray-950 focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-0 outline-none transition-all text-sm font-bold text-gray-900 dark:text-white shadow-inner"
            disabled={isPending}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!content.trim() || isPending}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white p-3 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-500 dark:hover:text-white transition-colors disabled:opacity-20 disabled:grayscale shadow-lg shadow-gray-200 dark:shadow-none"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
