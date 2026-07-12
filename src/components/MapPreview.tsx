"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

interface MapPreviewProps {
  lat: string;
  lng: string;
}

export function MapPreview({ lat, lng }: MapPreviewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || !lat || !lng) return null;

  const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

  if (isNaN(position.lat) || isNaN(position.lng)) return null;

  return (
    <div className="h-64 w-full rounded-[2.5rem] overflow-hidden border-2 border-gray-100 dark:border-white/5 relative group shadow-sm">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={position}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"}
        >
          <AdvancedMarker position={position} />
        </Map>
      </APIProvider>
      <div className="absolute inset-0 pointer-events-none border-[8px] border-white/20 dark:border-black/20 rounded-[2.5rem]" />
    </div>
  );
}
