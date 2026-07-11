import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  eventDate: z.coerce.date({
    message: "Please select a date",
  }).refine((date) => !isNaN(date.getTime()), "Invalid date"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format").optional().or(z.literal("")),
  locationName: z.string().min(2, "Location name is required"),
  address: z.string().optional(),
  mapUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
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
