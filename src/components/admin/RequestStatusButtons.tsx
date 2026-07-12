"use client";

import { useState, useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { updateLocationRequestStatus } from "@/lib/actions/location";

interface RequestStatusButtonsProps {
  requestId: string;
}

export function RequestStatusButtons({ requestId }: RequestStatusButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = (status: "approved" | "rejected") => {
    setError(null);
    startTransition(async () => {
      try {
        await updateLocationRequestStatus(requestId, status);
      } catch (err: any) {
        setError(err.message || "Failed to update status");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleStatusUpdate("approved")}
          disabled={isPending}
          className="p-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-xl transition-colors shadow-lg shadow-green-500/20"
          title="Approve"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
        <button
          onClick={() => handleStatusUpdate("rejected")}
          disabled={isPending}
          className="p-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-xl transition-colors shadow-lg shadow-red-500/20"
          title="Reject"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-[8px] font-black text-red-500 uppercase tracking-tighter">{error}</p>}
    </div>
  );
}
