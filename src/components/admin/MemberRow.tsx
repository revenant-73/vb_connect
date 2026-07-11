"use client";

import { useTransition } from "react";
import { updateUserRole, updateUserApproval } from "@/lib/actions/admin";
import { Shield, ShieldCheck, UserMinus, UserCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberRowProps {
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
    isApproved: boolean;
    image: string | null;
  };
}

export function MemberRow({ member }: MemberRowProps) {
  const [isPending, startTransition] = useTransition();

  const toggleRole = () => {
    const newRole = member.role === "admin" ? "user" : "admin";
    startTransition(async () => {
      await updateUserRole(member.id, newRole);
    });
  };

  const toggleApproval = () => {
    startTransition(async () => {
      await updateUserApproval(member.id, !member.isApproved);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 font-black border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden">
        {member.image ? (
          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">{member.name.charAt(0)}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-gray-900 dark:text-white truncate">
            {member.name}
          </h3>
          {member.role === "admin" && (
            <Shield className="h-3 w-3 text-indigo-600 dark:text-indigo-500" />
          )}
        </div>
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">
          {member.email}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleApproval}
          disabled={isPending}
          className={cn(
            "p-3 rounded-xl transition-all",
            member.isApproved 
              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20" 
              : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20"
          )}
          title={member.isApproved ? "Revoke Approval" : "Approve Member"}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : member.isApproved ? <UserCheck className="h-4 w-4" /> : <UserMinus className="h-4 w-4" />}
        </button>

        <button
          onClick={toggleRole}
          disabled={isPending}
          className={cn(
            "p-3 rounded-xl transition-all",
            member.role === "admin"
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
              : "bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
          )}
          title={member.role === "admin" ? "Demote to User" : "Promote to Admin"}
        >
          {member.role === "admin" ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
