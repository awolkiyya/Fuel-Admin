"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"

import {
  stationSchema,
  StationFormInput,
  StationFormValues,
} from "@/lib/schemas/stationSchema"

import { ImageUpload } from "../image-upload"

type Props = {
  defaultValues?: Partial<StationFormInput>
  loading?: boolean
  onSubmit: (data: StationFormValues) => void
}

/* ---------------- UX ERROR TEXT ---------------- */
const ErrorText = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-xs text-red-500 mt-1">{message}</p>
  ) : null

const HelpText = ({ text }: { text: string }) => (
  <p className="text-[11px] text-muted-foreground mt-1">
    {text}
  </p>
)

export function StationForm({
  defaultValues,
  loading,
  onSubmit,
}: Props) {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StationFormInput>({
    resolver: zodResolver(stationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      city: "",
      region: "",
      lat: undefined,
      lng: undefined,
      address: "",
      image: null,
      ...defaultValues,
    },
  })

  const image = watch("image")

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit(data as StationFormValues)
      )}
      className="flex flex-col h-full"
    >

      {/* ================= BODY ================= */}
      <div className="flex-1 overflow-y-auto max-h-[70vh] space-y-6 pr-1 p-4">

        {/* ================= BASIC INFO ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Station Identity
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">

            {/* NAME */}
            <div className="md:col-span-2">
              <Label>
                Station Name <span className="text-red-500">*</span>
              </Label>

              <Input
                placeholder="e.g. Addis Central Fuel Station"
                {...register("name")}
              />

              <HelpText text="This is the public name shown to drivers and operators." />
              <ErrorText message={errors.name?.message} />
            </div>

            {/* CITY */}
            <div>
              <Label>
                City <span className="text-red-500">*</span>
              </Label>

              <Input
                placeholder="e.g. Adama"
                {...register("city")}
              />

              <HelpText text="City where the station operates." />
              <ErrorText message={errors.city?.message} />
            </div>

            {/* REGION */}
            <div>
              <Label>
                Region <span className="text-red-500">*</span>
              </Label>

              <Input
                placeholder="e.g. Oromia"
                {...register("region")}
              />

              <HelpText text="Administrative region of the station." />
              <ErrorText message={errors.region?.message} />
            </div>

          </CardContent>
        </Card>

        {/* ================= LOCATION ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Geographic Location
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">

            {/* LAT */}
            <div>
              <Label>
                Latitude <span className="text-red-500">*</span>
              </Label>

              <Input
                type="number"
                step="any"
                placeholder="e.g. 8.9806"
                {...register("lat", { valueAsNumber: true })}
              />

              <HelpText text="Use GPS latitude (e.g. from Google Maps)." />
              <ErrorText message={errors.lat?.message} />
            </div>

            {/* LNG */}
            <div>
              <Label>
                Longitude <span className="text-red-500">*</span>
              </Label>

              <Input
                type="number"
                step="any"
                placeholder="e.g. 38.7578"
                {...register("lng", { valueAsNumber: true })}
              />

              <HelpText text="Use GPS longitude (precise location required)." />
              <ErrorText message={errors.lng?.message} />
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <Label>Full Address</Label>

              <Input
                placeholder="Street, landmark, nearby reference..."
                {...register("address")}
              />

              <HelpText text="Optional but improves map accuracy and searchability." />
            </div>

          </CardContent>
        </Card>

        {/* ================= MEDIA ================= */}
        <Card>
  <CardHeader>
    <CardTitle className="text-base">
      Station Media
    </CardTitle>
  </CardHeader>

  <CardContent>
    <Label>
      Station Image <span className="text-red-500">*</span>
    </Label>

    <HelpText text="Upload a clear image of the station for identification." />

    <div className="mt-2">
      <ImageUpload
        value={image ?? null}
        onChange={(file) =>
          setValue("image", file, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
    </div>
    {errors.image?.message && (
  <p className="text-xs text-red-500 mt-2">
    {String(errors.image.message)}
  </p>
)}
  </CardContent>
</Card>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="border-t pt-4 flex justify-end bg-background">
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[140px]"
        >
          {loading ? "Creating Station..." : "Create Station"}
        </Button>
      </div>

    </form>
  )
}