import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

export const stationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),

  lat: z.coerce.number({
    error: "Latitude must be a number",
  }),

  lng: z.coerce.number({
    error: "Longitude must be a number",
  }),

  address: z.string().optional(),

  /* ================= IMAGE VALIDATION ================= */
  image: z
    .any()
    .optional()
    .nullable()
    .refine(
      (file) => !file || file instanceof File,
      {
        message: "Invalid file format",
      }
    )
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      {
        message: "Image must be less than 5MB",
      }
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      {
        message: "Only JPG, PNG, and WEBP images are allowed",
      }
    ),
})

/**
 * INPUT = raw form data (RHF)
 */
export type StationFormInput = z.input<typeof stationSchema>

/**
 * OUTPUT = validated + safe data
 */
export type StationFormValues = z.output<typeof stationSchema>