import { z } from "zod";

export const METRO_ZONES = {
  "Portland, OR": {
    "Westside": [
      "North Plains / Banks",
      "Forest Grove / Cornelius",
      "Hillsboro",
      "Orenco / AmberGlen",
      "Tanasbourne / Rock Creek",
      "Aloha",
      "Beaverton / Cedar Hills",
      "Bethany / Cedar Mill",
      "Tigard / Metzger",
      "Tualatin",
      "Sherwood / King City",
      "Newberg / Dundee"
    ],
    "Portland": [
      "Downtown / Northwest Portland",
      "Southwest Portland / Multnomah Village",
      "North Portland / St. Johns",
      "Northeast Portland / Hollywood–Alberta",
      "Southeast Portland / Sellwood–Woodstock",
      "East Portland / Gateway–Parkrose"
    ],
    "South and East Metro": [
      "Lake Oswego",
      "West Linn / Wilsonville",
      "Milwaukie / Oak Grove",
      "Oregon City / Gladstone",
      "Clackamas / Happy Valley",
      "Gresham / Troutdale / Fairview"
    ],
    "Southwest Washington": [
      "Vancouver West/Hazel Dell",
      "Vancouver East",
      "Camas/Washougal",
      "Battle Ground/Ridgefield"
    ]
  },
  "Seattle, WA": {
    "Seattle": ["Downtown", "Capitol Hill", "Ballard", "Fremont", "West Seattle"],
    "Eastside": ["Bellevue", "Redmond", "Kirkland", "Issaquah"],
  },
  "Austin, TX": {
    "Austin": ["Downtown", "South Congress", "East Austin", "Zilker"],
    "Surrounding": ["Round Rock", "Cedar Park", "Pflugerville"],
  },
  "Boise, ID": {
    "Boise": ["North End / East End", "Southeast Boise", "West Boise / Bench", "South Boise"],
    "West Ada": ["Meridian", "Eagle", "Star / Kuna"],
    "Canyon County": ["Nampa", "Caldwell / Middleton"],
    "Garden City": ["Garden City"]
  }
} as const;

export type MetroArea = keyof typeof METRO_ZONES;

export const METRO_OPTIONS = Object.keys(METRO_ZONES) as [MetroArea, ...MetroArea[]];

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  eventDate: z.coerce.date({
    message: "Please select a date",
  }).refine((date) => !isNaN(date.getTime()), "Invalid date"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").optional().or(z.literal("")),
  locationName: z.string().min(2, "Location name is required"),
  metro: z.string().min(2, "Metro area is required"),
  activityZone: z.string().min(2, "Activity zone is required"),
  address: z.string().optional(),
  mapUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  format: z.enum(["Open Play", "Doubles", "Triples", "Quads", "Sixes", "King/Queen", "Tournament", "Other"]),
  experienceLevel: z.enum(["Everyone Welcome", "Beginner-friendly", "Intermediate", "Advanced", "Mixed Level"]),
  maxAttendees: z.preprocess(
    (val) => (val === "" || val === undefined || val === null || val === 0 || val === "0" ? null : Number(val)),
    z.number().int().min(1, "Must be at least 1").nullable().optional()
  ),
  visibility: z.enum(["public", "members"]),
  isWeatherDependent: z.boolean().default(true),
});

export type EventFormValues = z.infer<typeof eventSchema>;
