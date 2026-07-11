"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ChevronLeft, User, MessageSquare, Shield, LogOut, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState(session?.user?.name || "");
  const [bio, setBio] = useState((session?.user as any)?.bio || "");
  const [preferredLevel, setPreferredLevel] = useState((session?.user as any)?.preferredLevel || "intermediate");

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccess(false);

    try {
      await authClient.updateUser({
        name,
        // @ts-ignore - bio and preferredLevel are custom fields
        bio,
        preferredLevel,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-10 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Link 
            href="/profile" 
            className="bg-white dark:bg-gray-900 p-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Settings</h1>
        </div>
      </header>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Profile Settings</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Display Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900 dark:text-white"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-gray-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl px-6 py-4 outline-none transition-all font-medium text-gray-900 dark:text-white resize-none"
                placeholder="Tell us about your game..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Experience Level</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["beginner", "intermediate", "advanced", "pro"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPreferredLevel(level)}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                      preferredLevel === level 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                        : "bg-gray-50 dark:bg-gray-950 border-transparent text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : null}
              {isUpdating ? "Saving..." : success ? "Saved!" : "Update Profile"}
            </button>
          </form>
        </section>

        {/* Account Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Shield className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">Account</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
             <button 
               onClick={handleSignOut}
               className="w-full px-8 py-6 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
             >
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 dark:bg-red-500/20 p-3 rounded-xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 dark:text-white text-sm">Sign Out</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">End your current session</p>
                  </div>
                </div>
             </button>
          </div>
        </section>
      </div>
    </div>
  );
}
