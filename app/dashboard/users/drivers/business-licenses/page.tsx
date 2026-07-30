"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { DataTablePagination } from "@/components/tables/data-pagination";

import {
  FileText,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Check,
  X,
  Search,
  Inbox,
  BadgeCheck,
  RotateCcw,
  FilePlus2,
  CalendarClock,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  BusinessLicense,
  BusinessLicenseStatus,
  BusinessLicenseRequestType,
} from "@/types/business-license";
import { useBusinessLicenses } from "@/hooks/business-license/useBusinessLicenses";

// ================= STATUS CONFIG =================
// Centralized so badges, summary cards, and any future usage
// (filters, exports, etc.) stay visually consistent.

const STATUS_CONFIG: Record<
  BusinessLicenseStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  },
  ACTIVE: {
    label: "Active",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
  },
  EXPIRED: {
    label: "Expired",
    icon: AlertTriangle,
    className:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800",
  },
};

const REQUEST_TYPE_CONFIG: Record<
  BusinessLicenseRequestType,
  { label: string; icon: React.ElementType }
> = {
  NEW: { label: "New license", icon: FilePlus2 },
  RENEWAL: { label: "Renewal", icon: RotateCcw },
};

// ================= STATUS BADGE =================

const StatusBadge = ({ status }: { status: BusinessLicenseStatus }) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};

// ================= REQUEST TYPE PILL =================

const RequestTypeBadge = ({
  type,
}: {
  type: BusinessLicenseRequestType;
}) => {
  const config = REQUEST_TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <span className="flex w-fit items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

// ================= SUMMARY CARD =================

const SummaryCard = ({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  tone: "slate" | "amber" | "emerald" | "red" | "gray";
}) => {
  const toneMap: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    emerald:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    red: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    gray: "bg-gray-100 text-gray-600 dark:bg-gray-900/60 dark:text-gray-400",
  };

  return (
    <Card className="border-muted/60 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneMap[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">
            {value}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
};

// ================= ACTIONS =================

const IconActionButton = ({
  label,
  variant,
  onClick,
  icon: Icon,
}: {
  label: string;
  variant: "outline" | "default" | "destructive";
  onClick?: () => void;
  icon: React.ElementType;
}) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant={variant}
          className="h-8 w-8"
          onClick={onClick}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ActionButtons = ({
  license,
  onView,
}: {
  license: BusinessLicense;
  onView: (license: BusinessLicense) => void;
}) => {
  return (
    <div className="flex justify-end gap-2">
      <IconActionButton
        label="View details"
        variant="outline"
        icon={Eye}
        onClick={() => onView(license)}
      />

      {license.status === "PENDING" && (
        <>
          <IconActionButton label="Approve" variant="default" icon={Check} />
          <IconActionButton
            label="Reject"
            variant="destructive"
            icon={X}
          />
        </>
      )}
    </div>
  );
};

// ================= TABLE SKELETON =================

const TableSkeletonRows = ({ rows = 6 }: { rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: 7 }).map((__, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4 w-full max-w-[140px]" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

// ================= EMPTY STATE =================

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={7} className="py-16 text-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">No license requests found</p>
        <p className="text-xs">Try adjusting your search or filters.</p>
      </div>
    </TableCell>
  </TableRow>
);

// ================= PAGE =================

export default function BusinesslicensePage() {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const [search, setSearch] = React.useState("");

  const [status, setStatus] = React.useState<
    BusinessLicenseStatus | undefined
  >();

  const [requestType, setRequestType] = React.useState<
    BusinessLicenseRequestType | undefined
  >();

  const { data, isLoading } = useBusinessLicenses({
    page,
    limit,
    search,
    status,
    requestType,
  });

  const licenses = data?.data ?? [];
  const meta = data?.meta;
  const summary = data?.summary;

  return (
    <div className="space-y-6 max-w-5xl m-auto p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Business Licenses
        </h1>
        <p className="text-sm text-muted-foreground">
          Review, approve, and track license requests from drivers.
        </p>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <SummaryCard
          label="Total"
          value={summary?.total ?? 0}
          icon={FileText}
          tone="slate"
        />
        <SummaryCard
          label="Pending"
          value={summary?.pending ?? 0}
          icon={Clock}
          tone="amber"
        />
        <SummaryCard
          label="Active"
          value={summary?.active ?? 0}
          icon={BadgeCheck}
          tone="emerald"
        />
        <SummaryCard
          label="Rejected"
          value={summary?.rejected ?? 0}
          icon={XCircle}
          tone="red"
        />
        <SummaryCard
          label="Expired"
          value={summary?.expired ?? 0}
          icon={CalendarClock}
          tone="gray"
        />
      </div>

      {/* ================= FILTER ================= */}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Requests</CardTitle>
          <CardDescription>
            Search by license number or applicant, then narrow down by status
            or type.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search license number or applicant"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => {
              setPage(1);
              setStatus(v === "all" ? undefined : (v as BusinessLicenseStatus));
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={requestType}
            onValueChange={(v) => {
              setPage(1);
              setRequestType(
                v === "all" ? undefined : (v as BusinessLicenseRequestType)
              );
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Request type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="NEW">New license</SelectItem>
              <SelectItem value="RENEWAL">Renewal</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ================= TABLE ================= */}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-12">#</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && <TableSkeletonRows />}

              {!isLoading && licenses.length === 0 && <EmptyState />}

              {!isLoading &&
                licenses.map((license, index) => (
                  <TableRow key={license.id} className="hover:bg-muted/30">
                    <TableCell className="text-muted-foreground">
                      {(page - 1) * limit + index + 1}
                    </TableCell>

                    <TableCell className="font-medium">
                      {license.licenseNumber}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="truncate">
                          {license.user?.full_name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <RequestTypeBadge type={license.requestType} />
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {license.expiryDate
                        ? new Date(license.expiryDate).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={license.status} />
                    </TableCell>

                    <TableCell>
                      <ActionButtons
                        license={license}
                        onView={(item) =>
                          router.push(
                            `/dashboard/users/drivers/business-licenses/${item.id}`
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DataTablePagination
        page={meta?.page ?? 1}
        pageSize={meta?.limit ?? 10}
        total={meta?.total ?? 0}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
      />
    </div>
  );
}