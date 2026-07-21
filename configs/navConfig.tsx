import {
    Fuel,
    PieChart,
    Users,
    Settings,
    Truck,
    Activity,
    ClipboardList,
    Camera,
    AlertTriangle,
    Cpu,
    ShieldAlert,
    Building2,
    Layers,
  } from "lucide-react"
/**
 * CLEAN DOMAIN SEPARATION:
 * - Admin: Business + system governance
 * - Manager: Station operations + AI system
 * - Staff: Execution only
 */

import { NavItem } from "@/types/commen";
import { UserRole } from "@/types/user";

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    // ---------------------------------------
    // 1. OVERVIEW
    // ---------------------------------------
    {
      title: "Platform Overview",
      url: "/dashboard",
      icon: PieChart,
    },
  
    // ---------------------------------------
    // 2. USER & VEHICLE MANAGEMENT
    // ---------------------------------------
    {
      title: "User Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "System Users",
          url: "/dashboard/users/system",
        },
        {
          title: "Drivers",
          url: "/dashboard/users/drivers",
        },
        {
          title: "Business License Management",
          url: "/dashboard/users/drivers/business-licenses",
        },
        {
          title: "Vehicle Types",
          url: "/dashboard/vehicle-types",
        },
      ],
    },
  
    // ---------------------------------------
    // 3. ORGANIZATIONS (BULK FUEL ACCOUNTS) ⭐ NEW
    // ---------------------------------------
    {
      title: "Organizations",
      url: "/dashboard/organizations",
      icon: Building2,
    },
  
    // ---------------------------------------
    // 4. STATIONS CONTROL (CORE BUSINESS)
    // ---------------------------------------
    {
      title: "Stations Control",
      url: "#",
      icon: Fuel,
      items: [
        {
          title: "Stations",
          url: "/dashboard/stations",
        },
        {
          title: "Fuel Types & Pricing",
          url: "/dashboard/fuel-types",
        },
      ],
    },
  
    // ---------------------------------------
    // 5. SYSTEM SETTINGS
    // ---------------------------------------
    {
      title: "System Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],

  station_manager: [
    {
      title: "Station Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },

    {
      title: "Operations",
      url: "#",
      icon: Fuel,
      items: [
        {
          title: "Fuel Management",
          url: "/dashboard/fuel-management",
        },
        {
          title: "Tanks (Fuel Stock)",
          url: "/dashboard/tanks",
        },
        {
          title: "Pumps & Nozzles",
          url: "/dashboard/pumps",
        },
        {
          title: "Transactions",
          url: "/dashboard/transactions",
        },
        {
          title: "Fuel Requests",
          url: "/dashboard/fuel-requests",
        },
      ],
    },

    {
      title: "AI Monitoring",
      url: "#",
      icon: Camera,
      items: [
        { title: "Cameras", url: "/dashboard/camera" },
        { title: "Queue Zones", url: "/dashboard/camera/zones" },
      ],
    },

    {
      title: "Staffs",
      url: "/dashboard/staffs",
      icon: Users,
    },

    {
      title: "Station Settings",
      url: "/dashboard/station-settings",
      icon: Settings,
    },
  ],

  station_staff: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },
    // ================= REQUESTS =================
    {
      title: "Incoming Fuel Requests",
      url: "/dashboard/requests",
      icon: ClipboardList,
    },
    {
      title: "OrganizationFuelConsole",
      url: "/dashboard/requests/bulk",
      icon: Layers,
    },
    {
      title: "Fuel Operation",
      url: "/dashboard/requests/operation",
      icon: Fuel,
    },
  ],
}