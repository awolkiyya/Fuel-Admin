import { FuelRequest } from "@/types/fuel-reques";
import { InfoRow, initials } from "./RequestTab";
import {
  BadgeCheck,
  Calendar,
  CreditCard,
  Fingerprint,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

export function DriverTab({ request }: { request: FuelRequest }) {
  const user = request.user;
  const driverProfile = user?.driverProfile;

  // ───────────────── STATUS STYLE ─────────────────
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "SUSPENDED":
        return "text-red-600 bg-red-50 border-red-200";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "BLOCKED":
        return "text-red-700 bg-red-100 border-red-300";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  // ───────────────── RISK STYLE ─────────────────
  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "HIGH":
        return "text-red-600 bg-red-50 border-red-200";
      case "MEDIUM":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "LOW":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  // ───────────────── VERIFICATION BADGE ─────────────────
  const isVerified = driverProfile?.isVerified;

  const VerificationBadge = () => {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
          isVerified
            ? "text-emerald-600 bg-emerald-50 border-emerald-200"
            : "text-amber-600 bg-amber-50 border-amber-200"
        }`}
      >
        {isVerified ? (
          <ShieldCheck className="w-3.5 h-3.5" />
        ) : (
          <ShieldAlert className="w-3.5 h-3.5" />
        )}

        {isVerified ? "Verified Driver" : "Not Verified"}
      </span>
    );
  };

  return (
    <div className="space-y-4">

      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/40 border">

        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {user ? initials(user.full_name) : "?"}
            </span>
          )}
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">
            {user?.full_name ?? "Unknown driver"}
          </p>

          <p className="text-xs text-muted-foreground">
            {user?.gender ?? "—"}
          </p>
        </div>

        {/* USER STATUS */}
        {user?.status && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(
              user.status
            )}`}
          >
            {user.status}
          </span>
        )}
      </div>


      {/* ───────────────── RISK ───────────────── */}
      {user?.riskLevel && (
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border w-full ${getRiskColor(
            user.riskLevel
          )}`}
        >
          <Shield className="w-3.5 h-3.5" />
          Risk: {user.riskLevel}
        </div>
      )}

      {/* ───────────────── DRIVER PROFILE ───────────────── */}
      {driverProfile && (
        <div className="p-3 rounded-lg border bg-muted/20 space-y-2">

          <p className="text-xs font-medium text-muted-foreground uppercase">
            Driver Profile
          </p>

          <div className="flex items-center justify-between rounded-md border-b py-2 ">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <BadgeCheck className="w-3.5 h-3.5" />
              Verification
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${
                driverProfile.isVerified
                  ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                  : "text-amber-600 bg-amber-50 border-amber-200"
              }`}
            >
              {driverProfile.isVerified ? (
                <ShieldCheck className="w-3 h-3" />
              ) : (
                <ShieldAlert className="w-3 h-3" />
              )}

              {driverProfile.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>

          <InfoRow
            icon={<Fingerprint className="w-3.5 h-3.5" />}
            label="National ID"
            value={driverProfile.nationalId ?? "—"}
          />

          <InfoRow
            icon={<CreditCard className="w-3.5 h-3.5" />}
            label="License Number"
            value={driverProfile.licenseNumber ?? "—"}
          />

          <InfoRow
            icon={<Calendar className="w-3.5 h-3.5" />}
            label="License Expiry"
            value={driverProfile.licenseExpiry ?? "—"}
          />
        </div>
      )}
    </div>
  );
}