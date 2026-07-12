"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, Sparkles, Lock, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/",
        });
        if (error) {
          alert(error.message || "Failed to sign up");
        } else {
          onClose();
          router.refresh();
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });
        if (error) {
          alert(error.message || "Failed to sign in");
        } else {
          onClose();
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl z-[101] overflow-hidden border border-gray-100 dark:border-white/5"
          >
            <div className="p-8 md:p-12 space-y-8">
              <div className="flex justify-center">
                <img src="/vbconnect_logo.png" alt="VB Connect" className="h-12 w-auto" />
              </div>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-xl">
                      <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{isSignUp ? "Create Account" : "Welcome Back"}</span>
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {isSignUp ? "Join Us!" : "Hello Again!"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {isSignUp 
                      ? "Create an account to join the community." 
                      : "Sign in to manage your volleyball sessions."}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <form onSubmit={handleAuth} className="space-y-3">
                  {isSignUp && (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-950 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-950 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-950 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                  </div>
                  {isSignUp && (
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-950 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading || !email || !password || (isSignUp && (!name || !confirmPassword))}
                    className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white dark:hover:bg-indigo-500 dark:hover:text-white hover:bg-indigo-600 font-black py-4 rounded-2xl uppercase tracking-widest text-xs transition-all shadow-xl shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isSignUp ? "Creating..." : "Signing in..."}
                      </>
                    ) : (
                      isSignUp ? "Create Account" : "Sign In"
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-center text-gray-400 font-medium">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
