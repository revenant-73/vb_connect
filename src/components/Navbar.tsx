"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, MessageSquare, User, Settings, PlusCircle, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useAuthModal } from "@/context/AuthModalContext";

export function Navbar() {
  const pathname = usePathname();
  const { openAuthModal } = useAuthModal();
  const { data: session } = authClient.useSession();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { 
      href: session ? "/profile" : "#", 
      label: "Profile", 
      icon: User,
      onClick: !session ? (e: React.MouseEvent) => {
        e.preventDefault();
        openAuthModal();
      } : undefined
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-white/10 pb-safe md:top-0 md:bottom-auto md:border-t-0 md:border-b">
        <div className="max-w-md mx-auto px-6 md:max-w-4xl">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link href="/" className="hidden md:flex items-center space-x-2 font-black text-2xl text-indigo-600 dark:text-indigo-500 tracking-tighter">
              <img src="/vbconnect_logo.png" alt="VB Connect" className="h-8 w-auto" />
            </Link>
            
            <div className="flex justify-around w-full md:w-auto md:space-x-10">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={item.onClick}
                    className={cn(
                      "relative flex flex-col items-center justify-center space-y-1 py-1 transition-colors group",
                      isActive ? "text-indigo-600 dark:text-indigo-500" : "text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative z-10"
                    >
                      <Icon className={cn("h-6 w-6 md:h-5 md:w-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                    </motion.div>
                    <span className={cn(
                      "text-[10px] font-bold md:text-xs tracking-tight relative z-10",
                      isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                    )}>
                      {item.label}
                    </span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -top-1 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-500 rounded-full md:top-auto md:-bottom-1"
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/events/new" className="transition-transform hover:scale-110 active:scale-90">
                <PlusCircle className="h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" />
              </Link>
              {!session ? (
                <button 
                  onClick={openAuthModal}
                  className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all flex items-center gap-2"
                >
                  <LogIn className="h-3 w-3" />
                  Sign In
                </button>
              ) : (
                <Link href="/settings" className="transition-transform hover:scale-110 active:scale-90">
                  <Settings className="h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
