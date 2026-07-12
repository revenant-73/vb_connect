"use client";

import { METRO_ZONES, METRO_OPTIONS, type MetroArea } from "@/lib/validations/event";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X, MapPin, ArrowRight, PlusCircle } from "lucide-react";
import { RequestAreaModal } from "./RequestAreaModal";

export function ActivityZoneFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedZones = searchParams.getAll("zone");
  const currentMetro = (searchParams.get("metro") as MetroArea) || "Portland, OR";
  
  const [isZonesOpen, setIsZonesOpen] = useState(selectedZones.length > 0);
  const [isMetroOpen, setIsMetroOpen] = useState(false);
  const [requestModal, setRequestModal] = useState<{ open: boolean; type: "metro" | "zone" }>({
    open: false,
    type: "metro"
  });

  const handleMetroChange = (metro: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("metro", metro);
    params.delete("zone"); // Clear zones when switching metros
    setIsMetroOpen(false);
    router.push(`/events?${params.toString()}`);
  };

  const handleZoneChange = (zone: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (zone === "All") {
      params.delete("zone");
    } else {
      const currentZones = params.getAll("zone");
      if (currentZones.includes(zone)) {
        const newZones = currentZones.filter(z => z !== zone);
        params.delete("zone");
        newZones.forEach(z => params.append("zone", z));
      } else {
        params.append("zone", zone);
      }
    }
    router.push(`/events?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("zone");
    router.push(`/events?${params.toString()}`);
  };

  const zonesForMetro = METRO_ZONES[currentMetro] || {};

  return (
    <div className="space-y-4">
      {/* Primary Header Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Metro Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsMetroOpen(!isMetroOpen);
              if (!isMetroOpen) setIsZonesOpen(false);
            }}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all",
              isMetroOpen
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl"
                : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>{currentMetro} Area</span>
            <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", isMetroOpen && "rotate-180")} />
          </button>

          {/* Metro Dropdown Overlay */}
          <AnimatePresence>
            {isMetroOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsMetroOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl z-50 p-2 overflow-hidden"
                >
                  <div className="p-3 mb-1">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">Select Region</p>
                  </div>
                  {METRO_OPTIONS.map((metro) => (
                    <button
                      key={metro}
                      onClick={() => handleMetroChange(metro)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl text-xs font-bold transition-all group",
                        currentMetro === metro
                          ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                      )}
                    >
                      <span>{metro}</span>
                      <ArrowRight className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        currentMetro === metro ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      )} />
                    </button>
                  ))}
                  
                  <div className="p-1 mt-1 border-t border-gray-100 dark:border-white/5">
                    <button
                      onClick={() => setRequestModal({ open: true, type: "metro" })}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Request new area...
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Zone Filter Toggle */}
        <button
          onClick={() => {
            setIsZonesOpen(!isZonesOpen);
            if (!isZonesOpen) setIsMetroOpen(false);
          }}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
            isZonesOpen 
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl" 
              : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filter Zones</span>
          {selectedZones.length > 0 && (
            <span className="flex items-center justify-center bg-indigo-500 text-white w-5 h-5 rounded-full text-[10px]">
              {selectedZones.length}
            </span>
          )}
        </button>

        {/* Clear Button */}
        {selectedZones.length > 0 && (
          <button 
            onClick={clearAll}
            className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-colors px-2 ml-auto"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Activity Zones Collapsible */}
      <AnimatePresence>
        {isZonesOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8 mt-2 shadow-sm backdrop-blur-sm">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleZoneChange("All")}
                  className={cn(
                    "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                    selectedZones.length === 0
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                      : "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                  )}
                >
                  All {currentMetro} Zones
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {Object.entries(zonesForMetro).map(([region, zones]) => (
                  <div key={region} className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] px-1 flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-indigo-500" />
                      {region}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(zones as string[]).map((zone) => (
                        <button
                          key={zone}
                          onClick={() => handleZoneChange(zone)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-[10px] font-bold transition-all border",
                            selectedZones.includes(zone)
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                              : "bg-white dark:bg-gray-800 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/10"
                          )}
                        >
                          {zone}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => setRequestModal({ open: true, type: "zone" })}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all mx-auto"
                >
                  <PlusCircle className="h-4 w-4" />
                  Request new zone in {currentMetro}...
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RequestAreaModal 
        isOpen={requestModal.open}
        onClose={() => setRequestModal({ ...requestModal, open: false })}
        defaultType={requestModal.type}
        context={currentMetro}
      />
    </div>
  );
}
