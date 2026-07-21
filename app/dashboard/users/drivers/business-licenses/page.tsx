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
import { DataTablePagination } from "@/components/tables/data-pagination";

import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Check,
  X,
  Search,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";


type BusinessLicenseStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

type BusinessLicense = {
  id: string;
  userId: string;
  licenseNumber: string;
  documentUrl?: string;
  expiryDate?: string;
  status: BusinessLicenseStatus;
  issuedBy?: string;
  issuedAt?: string;
  createdAt: string;
  updatedAt: string;
};

// ---------------- MOCK DATA ----------------
const mockLicenses: BusinessLicense[] = [
  {
    id: "1",
    userId: "user_101",
    licenseNumber: "LIC-2026-0001",
    documentUrl: "https://imgv2-1-f.scribdassets.com/img/document/769977446/original/f92a91b5f4/1?v=1",
    expiryDate: "2027-01-10",
    status: "PENDING",
    issuedBy: "Ministry of Trade",
    issuedAt: "2026-01-10",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
  },
  {
    id: "2",
    userId: "user_102",
    licenseNumber: "LIC-2026-0002",
    documentUrl: "https://imgv2-1-f.scribdassets.com/img/document/769977446/original/f92a91b5f4/1?v=1",
    expiryDate: "2026-12-01",
    status: "APPROVED",
    issuedBy: "City Administration",
    issuedAt: "2026-02-15",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-15",
  },
  {
    id: "3",
    userId: "user_103",
    licenseNumber: "LIC-2026-0003",
    documentUrl: "https://imgv2-1-f.scribdassets.com/img/document/769977446/original/f92a91b5f4/1?v=1",
    expiryDate: "2025-10-01",
    status: "EXPIRED",
    issuedBy: "Ministry of Trade",
    issuedAt: "2024-10-01",
    createdAt: "2024-09-20",
    updatedAt: "2025-10-02",
  },
];

// ---------------- STATUS BADGE ----------------
const StatusBadge = ({ status }: { status: BusinessLicenseStatus }) => {
  const map: Record<BusinessLicenseStatus, any> = {
    PENDING: "secondary",
    APPROVED: "default",
    REJECTED: "destructive",
    EXPIRED: "outline",
  };

  const iconMap = {
    PENDING: <Clock className="w-3 h-3 mr-1" />,
    APPROVED: <CheckCircle className="w-3 h-3 mr-1" />,
    REJECTED: <XCircle className="w-3 h-3 mr-1" />,
    EXPIRED: <AlertTriangle className="w-3 h-3 mr-1" />,
  };

  return (
    <Badge variant={map[status]} className="flex items-center gap-1">
      {iconMap[status]}
      {status}
    </Badge>
  );
};

// ---------------- STATS ----------------
function getStats(data: BusinessLicense[]) {
  return {
    total: data.length,
    pending: data.filter((d) => d.status === "PENDING").length,
    approved: data.filter((d) => d.status === "APPROVED").length,
    rejected: data.filter((d) => d.status === "REJECTED").length,
    expired: data.filter((d) => d.status === "EXPIRED").length,
  };
}

// ---------------- CONDITIONAL ACTIONS ----------------
const ActionButtons = ({   license ,onView }: { license: BusinessLicense;  onView: (license: BusinessLicense) => void;
}) => {
  switch (license.status) {
    case "PENDING":
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>{
              onView(license)}
           }
            >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>

          <Button size="sm">
            <Check className="w-4 h-4 mr-1" />
            Approve
          </Button>

          <Button size="sm" variant="destructive">
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      );

    case "APPROVED":
    case "REJECTED":
    case "EXPIRED":
      return (
        <div className="flex justify-end">
         <Button
            size="sm"
            variant="outline"
            onClick={() =>{
               onView(license)}
            }
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      );

    default:
      return null;
  }
};

// ---------------- PAGE ----------------
function BusinesslicensePage() {
  const router= useRouter();


  const stats = getStats(mockLicenses);

  return (
    <div className="p-6 space-y-6">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-xl font-bold">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-xl font-bold">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Expired</p>
              <p className="text-xl font-bold">{stats.expired}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================= HEADER ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Business Licenses
          </CardTitle>
          <CardDescription>
            Manage all business license applications and approvals
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

          {/* SEARCH */}
          <div className="relative md:max-w-sm w-full">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search license number..." />
          </div>

          {/* FILTER */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ================= TABLE ================= */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>License #</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockLicenses.map((license, index) => (
                <TableRow key={license.id}>

                  <TableCell>{index + 1}</TableCell>

                  <TableCell className="font-medium">
                    {license.licenseNumber}
                  </TableCell>

                  <TableCell className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {license.userId}
                  </TableCell>

                  <TableCell>{license.expiryDate || "—"}</TableCell>


                  <TableCell>
                    <StatusBadge status={license.status} />
                  </TableCell>

                  <TableCell>
                  <ActionButtons
                    license={license}
                    onView={(license) => {
                      router.push(`/dashboard/users/drivers/business-licenses/${license.id}`)
                      
                    }}
/>                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= PAGINATION ================= */}
      <DataTablePagination
        page={1}
        pageSize={10}
        total={mockLicenses.length}
        onPageChange={(page: number) => console.log(page)}
        onPageSizeChange={(size: number) => console.log(size)}
      />
    </div>
  );
}

export default BusinesslicensePage;