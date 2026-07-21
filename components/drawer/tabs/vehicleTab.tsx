/* ─────────────────────────────────────────────────────────────────────────────
   VEHICLE TAB
───────────────────────────────────────────────────────────────────────────── */

import { FuelRequest } from "@/types/fuel-reques"
import { AlertTriangle, Car, Fuel, Gauge, Hash, MapPin } from "lucide-react"
import { InfoRow } from "./RequestTab"
import { cn } from "@/lib/utils"

export function VehicleTab({ request }: { request: FuelRequest }) {
    const { vehicle } = request
    return (
      <div className="space-y-0">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 mb-4">
          <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Car className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{vehicle.plateNumber}</p>
            <p className="text-xs text-muted-foreground">{vehicle.vehicleType.name}</p>
          </div>
          <div className="ml-auto">
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full border font-medium",
                vehicle.isVerified
                  ? "bg-teal-50 text-teal-700 border-teal-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              )}
            >
              {vehicle.isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
  
        <InfoRow icon={<Car className="w-3.5 h-3.5" />}           label="Plate number"  value={vehicle.plateNumber}    mono />
        <InfoRow icon={<Hash className="w-3.5 h-3.5" />}          label="Code Type"            value={vehicle.vehicleType.code}            mono />

        <InfoRow icon={<Hash className="w-3.5 h-3.5" />}          label="VIN"            value={vehicle.vin}            mono />
        <InfoRow icon={<MapPin className="w-3.5 h-3.5" />}        label="Region code"   value={vehicle.regionCode ?? "—"}   />
        <InfoRow icon={<Gauge className="w-3.5 h-3.5" />}         label="Tank capacity" value={`${vehicle.fuelCapacity} L`} />
        <InfoRow icon={<Fuel className="w-3.5 h-3.5" />}          label="Fuel type"     value={vehicle.fuelType.name}            />
        <InfoRow icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Active"        value={vehicle.isActive ? "Yes" : "No"} />
      </div>
    )
  }