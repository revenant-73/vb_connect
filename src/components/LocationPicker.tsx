"use client";

import { useState, useEffect, useCallback } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import { MapPin, Loader2, Search } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
    name: string;
    url: string;
  }) => void;
  defaultAddress?: string;
}

export function LocationPicker({ onLocationSelect, defaultAddress }: LocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-500/10 border-2 border-dashed border-amber-200 dark:border-amber-500/20 rounded-[2rem] text-center space-y-2">
        <p className="text-amber-700 dark:text-amber-400 font-bold text-sm">Google Maps API Key Missing</p>
        <p className="text-amber-600/70 dark:text-amber-400/60 text-[10px] font-black uppercase tracking-widest">
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      <LocationSearch onLocationSelect={onLocationSelect} defaultAddress={defaultAddress} />
    </APIProvider>
  );
}

function LocationSearch({ onLocationSelect, defaultAddress }: LocationPickerProps) {
  const apiIsLoaded = useApiIsLoaded();
  const map = useMap();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
    defaultValue: defaultAddress,
  });

  const handleSelect = async (description: string, placeId: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ placeId });
      const { lat, lng } = await getLatLng(results[0]);
      
      const locationData = {
        address: results[0].formatted_address,
        lat,
        lng,
        name: description.split(',')[0],
        url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${placeId}`,
      };

      setSelectedLocation({ lat, lng });
      onLocationSelect(locationData);
      
      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(15);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
          {ready ? <Search className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Search for a park or court..."
          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
        />

        {status === "OK" && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2">
            {data.map(({ place_id, description }) => (
              <button
                key={place_id}
                onClick={() => handleSelect(description, place_id)}
                className="w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 flex items-start gap-3 transition-colors group"
              >
                <MapPin className="h-4 w-4 mt-1 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="h-48 w-full rounded-[2rem] overflow-hidden border-2 border-gray-100 dark:border-white/10 relative group">
          <Map
            defaultCenter={selectedLocation}
            defaultZoom={15}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"}
          >
            <AdvancedMarker position={selectedLocation} />
          </Map>
          <div className="absolute inset-0 pointer-events-none border-[6px] border-white/20 dark:border-black/20 rounded-[2rem]" />
        </div>
      )}
    </div>
  );
}
