"use client";

import React from "react";
import { useParams } from "next/navigation";
import { DriverUser as Driver } from "@/types/driver";

import {
  User,
  Car,
  FileText,
  ShieldAlert,
  Copy,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Calendar,
  Hash,
  BadgeCheck,
  AlertTriangle,
  Clock,
  Fuel,
  Activity,
  LucideIcon,
  Ban,
  CheckCheck,
  Trash2,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TimelineItem } from "@/components/TimelineItem";
import { Panel } from "@/components/Panel";
import { ContactRow } from "@/components/ContactRow";
import { StatCard } from "@/components/StatCard";
import { InfoCell } from "@/components/InfoCell";
import { EmptyState } from "@/components/EmptyState";
import { Pill } from "@/components/Pill";
import { DriverRisks } from "@/components/driver/DriverRisks";
import { DocumentPreview } from "@/components/cards/DocumentPreview";
import { useDriver } from "@/hooks/driver/useDrivers";
import { formatEthiopianDate } from "@/lib/utils";


/* ─── Types ─────────────────────────────────────────────────────────────── */

type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "BLOCKED";


type BusinessLicenseStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "EXPIRED";


type RiskLevel =
  | "low"
  | "medium"
  | "high";


type Tab =
  | "overview"
  | "vehicles"
  | "license"
  | "risks";


/* ─── Helpers ───────────────────────────────────────────────────────────── */

function fmt(raw?: string | null) {
  if (!raw) return "N/A";

  const d = new Date(raw);

  return isNaN(d.getTime())
    ? raw
    : d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}


function fmtDT(raw?: string | null) {
  if (!raw) return "N/A";

  const d = new Date(raw);

  return isNaN(d.getTime())
    ? raw
    : d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}


function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


/* ─── Status Styles ─────────────────────────────────────────────────────── */

const STATUS_CLS: Record<UserStatus, string> = {
  ACTIVE:
    "bg-green-50 text-green-800 border-green-200",

  INACTIVE:
    "bg-gray-100 text-gray-600 border-gray-200",

  SUSPENDED:
    "bg-amber-50 text-amber-800 border-amber-200",

  BLOCKED:
    "bg-red-50 text-red-800 border-red-200",
};


const LICENSE_CLS: Record<BusinessLicenseStatus, string> = {
  PENDING:
    "bg-amber-50 text-amber-800 border-amber-200",

  ACTIVE:
    "bg-green-50 text-green-800 border-green-200",

  REJECTED:
    "bg-red-50 text-red-800 border-red-200",

  EXPIRED:
    "bg-gray-100 text-gray-600 border-gray-200",
};


const RISK_CLS: Record<RiskLevel, string> = {
  low:
    "bg-blue-50 text-blue-800 border-blue-200",

  medium:
    "bg-amber-50 text-amber-800 border-amber-200",

  high:
    "bg-red-50 text-red-800 border-red-200",
};



const TABS: {
  key: Tab;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    key: "overview",
    label: "Overview",
    icon: User,
  },
  {
    key: "vehicles",
    label: "Vehicles",
    icon: Car,
  },
  {
    key: "license",
    label: "License",
    icon: FileText,
  },
  {
    key: "risks",
    label: "Risks",
    icon: ShieldAlert,
  },
];



/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function DriverDetailPage() {

  const params = useParams();

  const driverId = params.id as string;


  const {
    data,
    isLoading,
    error,
  } = useDriver(driverId);


  const driver = data?.data;


  const [tab, setTab] =
    React.useState<Tab>("overview");


  const [copied, setCopied] =
    React.useState<string | null>(null);



  const copy = async (
    val: string,
    key: string
  ) => {

    await navigator.clipboard.writeText(val);

    setCopied(key);

    setTimeout(
      () => setCopied(null),
      1400
    );
  };


  



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        Loading driver...
      </div>
    );
  }



  if (error || !driver) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        Driver not found.
      </div>
    );
  }



  const riskCount =
    driver.risks.filter(
      (r) =>
        r.level === "high" ||
        r.level === "medium"
    ).length;

    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
  
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background border-b">
  
          <div className="max-w-6xl mx-auto px-6 flex gap-0 overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  tab === key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
  
                {label}
  
                {key === "risks" && riskCount > 0 && (
                  <span className="ml-1 bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {riskCount}
                  </span>
                )}
  
              </button>
            ))}
          </div>
  
        </header>
  
  
  
        <main className="flex-1 px-6 py-6">
  
          <div className="max-w-4xl mx-auto">
  
  
  {/* =========================================================
      OVERVIEW
  ========================================================= */}
  
  {tab === "overview" && (
  
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
  
  
  {/* PROFILE */}
  
  <div className="lg:col-span-1">
  
  <Panel icon={User} title="Profile">
  
  <div className="flex flex-col items-center text-center gap-3 pb-4 mb-4 border-b">
  
  
  {driver.profile_image ? (
  
  <img
  src={driver.profile_image}
  alt={driver.full_name}
  className="h-20 w-20 rounded-full object-cover border"
  />
  
  ) : (
  
  <div className="h-20 w-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold">
  
  {initials(driver.full_name)}
  
  </div>
  
  )}
  
  
  
  <div>
  
  <p className="text-base font-semibold">
  {driver.full_name}
  </p>
  
  
  <p className="text-xs text-muted-foreground">
  {driver.role} · {driver.gender ?? "N/A"}
  </p>
  
  </div>
  
  
  
  <span
  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_CLS[driver.status]}`}
  >
  {driver.status}
  </span>
  
  
  </div>
  
  
  
  <div className="space-y-3 text-sm">
  
  
  <ContactRow
  icon={Phone}
  label={driver.phone}
  onCopy={() => copy(driver.phone,"phone")}
  copied={copied === "phone"}
  />
  
  
  
  {driver.email && (
  
  <ContactRow
  icon={Mail}
  label={driver.email}
  onCopy={() => copy(driver.email!,"email")}
  copied={copied === "email"}
  />
  
  )}
  
  
  
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
  
  <Calendar className="h-3.5 w-3.5"/>
  
  Joined {fmt(driver.createdAt)}
  
  </div>
  
  
  </div>
  
  
  </Panel>
  
  
  </div>
  
  
  
  
  
  {/* RIGHT SIDE */}
  
  
  <div className="lg:col-span-2 space-y-5">
  
  
  
  <div className="grid grid-cols-2 gap-3">
  
  <StatCard
  label="Vehicles"
  value={String(driver.vehicleCount ?? driver.vehicles.length)}
  />
  
  
  <StatCard
  label="Risk flags"
  value={String(driver.riskSummary?.activeRiskCount ?? driver.risks.length)}
  danger={
  driver.risks.some(
  (r)=>r.level==="high"
  )
  }
  />
  
  
  </div>
  
  
  
  
  {driver.driverProfile && (
  
  <Panel
  icon={BadgeCheck}
  title="Driver profile"
  >
  
  
  <div className="grid sm:grid-cols-2 gap-3">
  
  
  <InfoCell
  icon={Hash}
  label="National ID"
  value={
  driver.driverProfile.nationalId ?? "N/A"
  }
  />
  
  
  
  <InfoCell
  icon={FileText}
  label="Driving License"
  value={
  driver.driverProfile.licenseNumber ?? "N/A"
  }
  />
  
  
  
  <InfoCell
  icon={User}
  label="Age"
  value={
  driver.driverProfile.age
  ? `${driver.driverProfile.age} years`
  : "N/A"
  }
  />
  
  
  
  <InfoCell
  icon={BadgeCheck}
  label="Verification"
  value={
  driver.driverProfile.isVerified
  ? "Verified"
  : "Not verified"
  }
  valueClassName={
  driver.driverProfile.isVerified
  ? "text-green-600"
  : "text-destructive"
  }
  />
  
  
  
  </div>
  
  
  </Panel>
  
  )}
  
  
  
  <Panel
  icon={Activity}
  title="Admin actions"
  >
  
  
  <div className="flex flex-wrap gap-2">
  
  
  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
  <CheckCheck className="h-3.5 w-3.5"/>
  Verify account
  </Button>
  
  
  
  <Button
  size="sm"
  variant="outline"
  className="gap-1.5 text-xs text-amber-700 border-amber-200"
  >
  <AlertTriangle className="h-3.5 w-3.5"/>
  Flag account
  </Button>
  
  
  
  <Button
  size="sm"
  variant="outline"
  className="gap-1.5 text-xs text-orange-700 border-orange-200"
  >
  <Ban className="h-3.5 w-3.5"/>
  Suspend
  </Button>
  
  
  
  <Button
  size="sm"
  variant="outline"
  className="gap-1.5 text-xs text-red-700 border-red-200"
  >
  <ShieldAlert className="h-3.5 w-3.5"/>
  Block account
  </Button>
  
  
  
  <Button
  size="sm"
  variant="outline"
  className="gap-1.5 text-xs text-green-700 border-green-200"
  >
  <CheckCircle2 className="h-3.5 w-3.5"/>
  Reactivate
  </Button>
  
  
  
  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
  <Activity className="h-3.5 w-3.5"/>
  Send warning
  </Button>
  
  
  
  <Button
  size="sm"
  variant="outline"
  className="gap-1.5 text-xs text-destructive"
  >
  <Trash2 className="h-3.5 w-3.5"/>
  Delete account
  </Button>
  
  
  </div>
  
  
  </Panel>
  
  
  </div>
  
  
  </div>
  
  )}
  
  
  
  {/* =========================================================
      VEHICLES
  ========================================================= */}
  
  
  {tab === "vehicles" && (
  
  <div className="space-y-4">
  
  
  {driver.vehicles.length === 0 ? (
  
  <EmptyState
  icon={Car}
  title="No vehicles registered."
  />
  
  ) : (
  
  driver.vehicles.map((v)=>(
  
  
  <div
  key={v.id}
  className="bg-background border rounded-xl overflow-hidden"
  >
  
  
  <div className="flex items-center justify-between px-5 py-3.5 border-b bg-muted/30">
  
  
  <div className="flex items-center gap-2.5">
  
  
  <Car className="h-3.5 w-3.5"/>
  
  
  <span className="font-mono text-sm font-semibold">
  {v.plateNumber}
  </span>
  
  
  <span className="text-xs text-muted-foreground">
  · {v.vehicleType.name}
  </span>
  
  
  </div>
  
  
  
  <div className="flex gap-2">
  
  
  <Pill
  label={v.isVerified ? "Verified":"Unverified"}
  cls={
  v.isVerified
  ?"bg-green-50 text-green-800 border-green-200"
  :"bg-red-50 text-red-800 border-red-200"
  }
  />
  
  
  
  <Pill
  label={v.isActive ? "Active":"Inactive"}
  cls={
  v.isActive
  ?"bg-blue-50 text-blue-800 border-blue-200"
  :"bg-gray-100 text-gray-600 border-gray-200"
  }
  />
  
  
  </div>
  
  
  </div>
  
  
  
  
  
  <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
  
  
  <InfoCell
  icon={Hash}
  label="VIN"
  value={v.vin}
  />
  
  
  <InfoCell
  icon={Fuel}
  label="Fuel type"
  value={v.fuelType.name}
  />
  
  
  <InfoCell
  icon={Activity}
  label="Fuel capacity"
  value={
  v.fuelCapacity
  ? `${v.fuelCapacity} L`
  :"N/A"
  }
  />
  
  
  <InfoCell
  icon={MapPin}
  label="Region"
  value={v.regionCode ?? "N/A"}
  />
  
  
  <InfoCell
  icon={Calendar}
  label="Registered"
  value={formatEthiopianDate(v.createdAt)}
  />
  
  
  
  </div>
  
  
  </div>
  
  
  ))
  
  )}
  
  
  </div>
  
  )}
  {/* =========================================================
    LICENSE
========================================================= */}

{tab === "license" && (

<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">


{!driver.businessLicense ? (

<div className="lg:col-span-3">

<EmptyState
icon={FileText}
title="No business license on file."
/>

</div>


) : (


<>

<div className="lg:col-span-2 space-y-5">


{/* License Header */}

<div className="bg-background border rounded-xl px-6 py-5">


<p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
License number
</p>



<div className="flex items-center gap-2.5 mb-3">


<span className="text-2xl font-bold font-mono tracking-wide">
{driver.businessLicense.licenseNumber}
</span>



<button
onClick={() =>
copy(
driver.businessLicense!.licenseNumber,
"lic"
)
}
className="p-1.5 rounded hover:bg-muted"
>


{copied === "lic" ? (

<CheckCircle2 className="h-3.5 w-3.5 text-green-500"/>

) : (

<Copy className="h-3.5 w-3.5 text-muted-foreground"/>

)}


</button>


</div>



<span
className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${LICENSE_CLS[driver.businessLicense.status]}`}
>
{driver.businessLicense.status}
</span>


</div>




<Panel
icon={ShieldAlert}
title="License details"
>


<div className="grid sm:grid-cols-2 gap-3">


<InfoCell
icon={Calendar}
label="Expiry"
value={driver.businessLicense.expiryDate?formatEthiopianDate(driver.businessLicense.expiryDate):"_"}
/>



<InfoCell
icon={Activity}
label="Status"
value={driver.businessLicense.status}
/>



<InfoCell
icon={FileText}
label="Request type"
value={driver.businessLicense.requestType}
/>



{driver.businessLicense.rejectionReason && (

<InfoCell
icon={AlertTriangle}
label="Rejected reason"
value={driver.businessLicense.rejectionReason}
/>

)}


</div>


</Panel>




<Panel
icon={FileText}
title="Document preview"
>


<DocumentPreview

url={
driver.businessLicense.documentUrl ?? undefined
}

title="Business License"

emptyIcon={
<FileText className="w-6 h-6 text-muted-foreground"/>
}

emptyText="No document uploaded."

/>


</Panel>



</div>





{/* Sidebar */}

<div className="space-y-5">


<Panel
icon={Clock}
title="Audit trail"
>


<ol className="space-y-0">


<TimelineItem
label="Created"
value={formatEthiopianDate(driver.businessLicense.createdAt)}
/>



<TimelineItem
label="Last updated"
value={formatEthiopianDate(driver.businessLicense.updatedAt)}
isLast
/>



</ol>


</Panel>





<div
className={`rounded-xl border px-4 py-3.5 ${LICENSE_CLS[driver.businessLicense.status]}`}
>


<p className="text-[10px] font-semibold uppercase tracking-wide mb-1 opacity-70">
Current status
</p>



<p className="text-sm font-semibold mb-1">
{driver.businessLicense.status}
</p>



<p className="text-xs opacity-75">


{driver.businessLicense.status === "PENDING" &&
"Awaiting admin review."}



{driver.businessLicense.status === "ACTIVE" &&
"License is verified and active."}



{driver.businessLicense.status === "REJECTED" &&
"License was rejected."}



{driver.businessLicense.status === "EXPIRED" &&
"License has passed its expiry date."}


</p>


</div>





{driver.businessLicense.status === "PENDING" && (

<div className="flex flex-col gap-2">


<Button
size="sm"
className="w-full gap-1.5"
>

<CheckCircle2 className="h-3.5 w-3.5"/>

Approve license

</Button>




<Button
size="sm"
variant="destructive"
className="w-full gap-1.5"
>

<XCircle className="h-3.5 w-3.5"/>

Reject license

</Button>


</div>

)}



</div>


</>


)}


</div>

)}







{/* =========================================================
    RISKS
========================================================= */}

{tab === "risks" && (

<DriverRisks

                RISK_CLS={RISK_CLS}

                fmt={fmt}

                InfoCell={InfoCell}

                Pill={Pill}

                limit={5}
                risks={driver.risks}
/>

)}



        </div>

      </main>

    </div>
  );
}