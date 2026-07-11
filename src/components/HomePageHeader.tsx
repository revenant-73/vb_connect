"use client";

import { PlusCircle, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useAuthModal } from "@/context/AuthModalContext";
import { authClient } from "@/lib/auth-client";

export function HomePageHeader() {
  const { openAuthModal } = useAuthModal();
  const { data: session } = authClient.useSession();

  return (
    <header className="flex justify-between items-end px-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-indigo-500/10 text-indigo-500 p-1 rounded-md">
            <Sparkles className="h-4 w-4 fill-indigo-500" />
          </span>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Live Now</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
          VB <span className="text-indigo-500">Connect</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">
          {session?.user ? (
            <>Welcome back, <span className="text-gray-900 dark:text-white font-bold">{session.user.name.split(' ')[0]}</span></>
          ) : "Community volleyball for all levels and any surface"}
        </p>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        {!session && (
          <>
            <button 
              onClick={openAuthModal}
              className="hidden md:flex bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              Sign In
            </button>
            <button 
              onClick={openAuthModal}
              className="md:hidden flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 text-gray-400 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              <User className="h-5 w-5" />
            </button>
          </>
        )}
        <Link 
          href="/events/new"
          className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all hover:scale-110 active:scale-95 group"
        >
          <PlusCircle className="h-5 w-5 md:h-6 md:w-6 group-hover:rotate-90 transition-transform duration-300" />
        </Link>
      </div>
    </header>
  );
}
