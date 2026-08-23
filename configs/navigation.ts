import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  Camera,
  Car,
  ClipboardList,
  Cpu,
  Fuel,
  Layers,
  PieChart,
  Settings,
  ShieldAlert,
  Truck,
  Users,
} from "lucide-react";

import { NavItem } from "@/types/commen";
import { UserRole } from "@/types/user";

/**
 * =====================================================
 * FUEL STATION MANAGEMENT SYSTEM
 * NAVIGATION + FRONTEND AUTHORIZATION
 * =====================================================
 *
 * IMPORTANT
 * =========
 *
 * This file provides FRONTEND authorization only.
 *
 * It is responsible for:
 *
 * 1. Sidebar visibility
 * 2. Frontend route protection
 * 3. Action/button visibility
 *
 * The Express API MUST independently enforce:
 *
 * - Authentication
 * - RBAC
 * - Permissions
 * - Station ownership
 * - Resource ownership
 * - IDOR protection
 * - Business rules
 * - Approval rules
 *
 * NEVER trust this file as the final security boundary.
 *
 *
 * AUTHORIZATION ARCHITECTURE
 * ==========================
 *
 * Frontend:
 *
 *   role
 *     ↓
 *   ROLE_PERMISSIONS
 *     ↓
 *   ROUTE_PERMISSIONS
 *     ↓
 *   canAccessRoute()
 *
 * Backend:
 *
 *   JWT
 *     ↓
 *   authMiddleware
 *     ↓
 *   requirePermission()
 *     ↓
 *   requireStationAccess()
 *     ↓
 *   controller/service
 *
 *
 * IMPORTANT:
 *
 * Station ownership and resource ownership cannot be
 * safely determined by the frontend.
 *
 * The backend MUST remain authoritative.
 */


/**
 * =====================================================
 * 1. APPLICATION PERMISSIONS
 * =====================================================
 */

export const APP_PERMISSIONS = {
  // ===================================================
  // DASHBOARD
  // ===================================================

  DASHBOARD_VIEW: "dashboard.view",

  // ===================================================
  // SYSTEM
  // ===================================================

  SYSTEM_SETTINGS_VIEW: "system.settings.view",
  SYSTEM_SETTINGS_UPDATE: "system.settings.update",

  SYSTEM_USERS_VIEW: "system.users.view",
  SYSTEM_USERS_CREATE: "system.users.create",
  SYSTEM_USERS_UPDATE: "system.users.update",
  SYSTEM_USERS_DELETE: "system.users.delete",

  // ===================================================
  // STATIONS
  // ===================================================

  STATION_VIEW: "station.view",
  STATION_CREATE: "station.create",
  STATION_UPDATE: "station.update",
  STATION_DELETE: "station.delete",

  STATION_ASSIGN_MANAGER: "station.assign_manager",

  // ===================================================
  // STATION STAFF
  // ===================================================

  STAFF_VIEW: "staff.view",
  STAFF_CREATE: "staff.create",
  STAFF_UPDATE: "staff.update",
  STAFF_STATUS_UPDATE: "staff.status.update",
  STAFF_PASSWORD_UPDATE: "staff.password.update",

  // ===================================================
  // DRIVERS
  // ===================================================

  DRIVER_VIEW: "driver.view",
  DRIVER_CREATE: "driver.create",
  DRIVER_UPDATE: "driver.update",
  DRIVER_DELETE: "driver.delete",
  DRIVER_STATUS_UPDATE: "driver.status.update",

  // ===================================================
  // VEHICLES
  // ===================================================

  VEHICLE_VIEW: "vehicle.view",
  VEHICLE_CREATE: "vehicle.create",
  VEHICLE_UPDATE: "vehicle.update",
  VEHICLE_DELETE: "vehicle.delete",
  VEHICLE_ACTIVATE: "vehicle.activate",
  VEHICLE_DEACTIVATE: "vehicle.deactivate",

  // ===================================================
  // VEHICLE TYPES
  // ===================================================

  VEHICLE_TYPE_VIEW: "vehicle_type.view",
  VEHICLE_TYPE_CREATE: "vehicle_type.create",
  VEHICLE_TYPE_UPDATE: "vehicle_type.update",
  VEHICLE_TYPE_DELETE: "vehicle_type.delete",

  // ===================================================
  // FUEL TYPES
  // ===================================================

  FUEL_TYPE_VIEW: "fuel_type.view",
  FUEL_TYPE_CREATE: "fuel_type.create",
  FUEL_TYPE_UPDATE: "fuel_type.update",
  FUEL_TYPE_STATUS_UPDATE: "fuel_type.status.update",

  // ===================================================
  // FUEL PRICING
  // ===================================================

  FUEL_PRICING_VIEW: "fuel_pricing.view",
  FUEL_PRICING_UPDATE: "fuel_pricing.update",

  // ===================================================
  // TANKS
  // ===================================================

  TANK_VIEW: "tank.view",
  TANK_CREATE: "tank.create",
  TANK_REFILL: "tank.refill",
  TANK_ADJUST: "tank.adjust",

  // ===================================================
  // PUMPS / DISPENSERS
  // ===================================================

  PUMP_VIEW: "pump.view",
  PUMP_CREATE: "pump.create",
  PUMP_UPDATE: "pump.update",
  PUMP_STATUS_UPDATE: "pump.status.update",

  // ===================================================
  // NOZZLES
  // ===================================================

  NOZZLE_VIEW: "nozzle.view",
  NOZZLE_CREATE: "nozzle.create",
  NOZZLE_UPDATE: "nozzle.update",
  NOZZLE_STATUS_UPDATE: "nozzle.status.update",

  // ===================================================
  // FUEL MANAGEMENT
  // ===================================================

  FUEL_MANAGEMENT_VIEW: "fuel_management.view",

  // ===================================================
  // FUEL REQUESTS
  // ===================================================

  FUEL_REQUEST_VIEW: "fuel_request.view",
  FUEL_REQUEST_CREATE: "fuel_request.create",
  FUEL_REQUEST_VERIFY: "fuel_request.verify",
  FUEL_REQUEST_REJECT: "fuel_request.reject",
  FUEL_REQUEST_APPROVE: "fuel_request.approve",
  FUEL_REQUEST_START: "fuel_request.start",
  FUEL_REQUEST_COMPLETE: "fuel_request.complete",
  FUEL_REQUEST_CANCEL: "fuel_request.cancel",

  // ===================================================
  // TRANSACTIONS
  // ===================================================

  TRANSACTION_VIEW: "transaction.view",
  TRANSACTION_CREATE: "transaction.create",
  TRANSACTION_SUMMARY_VIEW: "transaction.summary.view",

  // ===================================================
  // AUDIT LOGS
  // ===================================================

  AUDIT_LOG_VIEW: "audit_log.view",

  // ===================================================
  // STATION SETTINGS
  // ===================================================

  STATION_SETTINGS_VIEW: "station.settings.view",
  STATION_SETTINGS_UPDATE: "station.settings.update",

  // ===================================================
  // TRAFFIC
  // ===================================================

  TRAFFIC_VIEW: "traffic.view",
  TRAFFIC_UPDATE: "traffic.update",

  // ===================================================
  // CAMERAS
  // ===================================================

  CAMERA_VIEW: "camera.view",
  CAMERA_CREATE: "camera.create",
  CAMERA_UPDATE: "camera.update",
  CAMERA_DELETE: "camera.delete",
  CAMERA_STATUS_UPDATE: "camera.status.update",

  // ===================================================
  // AI MONITORING
  // ===================================================

  AI_MONITORING_VIEW: "ai_monitoring.view",

  // ===================================================
  // QUEUE ZONES
  // ===================================================

  QUEUE_ZONE_VIEW: "queue_zone.view",
  QUEUE_ZONE_CREATE: "queue_zone.create",
  QUEUE_ZONE_UPDATE: "queue_zone.update",
  QUEUE_ZONE_DELETE: "queue_zone.delete",

  // ===================================================
  // ORGANIZATIONS
  // ===================================================

  ORGANIZATION_VIEW: "organization.view",
  ORGANIZATION_CREATE: "organization.create",
  ORGANIZATION_UPDATE: "organization.update",
  ORGANIZATION_DELETE: "organization.delete",

  // ===================================================
  // QUOTA
  // ===================================================

  QUOTA_VIEW: "quota.view",
  QUOTA_CREATE: "quota.create",
  QUOTA_UPDATE: "quota.update",
  QUOTA_APPROVE: "quota.approve",
  QUOTA_CANCEL: "quota.cancel",

  // ===================================================
  // BUSINESS LICENSE
  // ===================================================

  BUSINESS_LICENSE_VIEW: "business_license.view",
  BUSINESS_LICENSE_CREATE: "business_license.create",
  BUSINESS_LICENSE_UPDATE: "business_license.update",
  BUSINESS_LICENSE_DELETE: "business_license.delete",

  // ===================================================
  // NOTIFICATIONS
  // ===================================================

  NOTIFICATION_VIEW: "notification.view",
  NOTIFICATION_MANAGE: "notification.manage",
} as const;

export type AppPermission =
  (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS];


/**
 * =====================================================
 * 2. ROLE PERMISSIONS
 * =====================================================
 *
 * Backend roles:
 *
 * admin
 * station_manager
 * station_staff
 * driver
 */

export const ROLE_PERMISSIONS: Record<
  UserRole,
  AppPermission[]
> = {
  // ===================================================
  // ADMIN
  // ===================================================

  admin: [
    // Dashboard
    APP_PERMISSIONS.DASHBOARD_VIEW,

    // System
    APP_PERMISSIONS.SYSTEM_SETTINGS_VIEW,
    APP_PERMISSIONS.SYSTEM_SETTINGS_UPDATE,

    APP_PERMISSIONS.SYSTEM_USERS_VIEW,
    APP_PERMISSIONS.SYSTEM_USERS_CREATE,
    APP_PERMISSIONS.SYSTEM_USERS_UPDATE,
    APP_PERMISSIONS.SYSTEM_USERS_DELETE,

    // Stations
    APP_PERMISSIONS.STATION_VIEW,
    APP_PERMISSIONS.STATION_CREATE,
    APP_PERMISSIONS.STATION_UPDATE,
    APP_PERMISSIONS.STATION_DELETE,
    APP_PERMISSIONS.STATION_ASSIGN_MANAGER,

    // Staff
    APP_PERMISSIONS.STAFF_VIEW,
    APP_PERMISSIONS.STAFF_CREATE,
    APP_PERMISSIONS.STAFF_UPDATE,
    APP_PERMISSIONS.STAFF_STATUS_UPDATE,
    APP_PERMISSIONS.STAFF_PASSWORD_UPDATE,

    // Drivers
    APP_PERMISSIONS.DRIVER_VIEW,
    APP_PERMISSIONS.DRIVER_CREATE,
    APP_PERMISSIONS.DRIVER_UPDATE,
    APP_PERMISSIONS.DRIVER_DELETE,
    APP_PERMISSIONS.DRIVER_STATUS_UPDATE,

    // Vehicles
    APP_PERMISSIONS.VEHICLE_VIEW,
    APP_PERMISSIONS.VEHICLE_CREATE,
    APP_PERMISSIONS.VEHICLE_UPDATE,
    APP_PERMISSIONS.VEHICLE_DELETE,
    APP_PERMISSIONS.VEHICLE_ACTIVATE,
    APP_PERMISSIONS.VEHICLE_DEACTIVATE,

    // Vehicle types
    APP_PERMISSIONS.VEHICLE_TYPE_VIEW,
    APP_PERMISSIONS.VEHICLE_TYPE_CREATE,
    APP_PERMISSIONS.VEHICLE_TYPE_UPDATE,
    APP_PERMISSIONS.VEHICLE_TYPE_DELETE,

    // Fuel types
    APP_PERMISSIONS.FUEL_TYPE_VIEW,
    APP_PERMISSIONS.FUEL_TYPE_CREATE,
    APP_PERMISSIONS.FUEL_TYPE_UPDATE,
    APP_PERMISSIONS.FUEL_TYPE_STATUS_UPDATE,

    // Fuel pricing
    APP_PERMISSIONS.FUEL_PRICING_VIEW,
    APP_PERMISSIONS.FUEL_PRICING_UPDATE,

    // Fuel management
    APP_PERMISSIONS.FUEL_MANAGEMENT_VIEW,

    // Tanks
    APP_PERMISSIONS.TANK_VIEW,
    APP_PERMISSIONS.TANK_CREATE,
    APP_PERMISSIONS.TANK_REFILL,
    APP_PERMISSIONS.TANK_ADJUST,

    // Pumps
    APP_PERMISSIONS.PUMP_VIEW,
    APP_PERMISSIONS.PUMP_CREATE,
    APP_PERMISSIONS.PUMP_UPDATE,
    APP_PERMISSIONS.PUMP_STATUS_UPDATE,

    // Nozzles
    APP_PERMISSIONS.NOZZLE_VIEW,
    APP_PERMISSIONS.NOZZLE_CREATE,
    APP_PERMISSIONS.NOZZLE_UPDATE,
    APP_PERMISSIONS.NOZZLE_STATUS_UPDATE,

    // Fuel requests
    APP_PERMISSIONS.FUEL_REQUEST_VIEW,
    APP_PERMISSIONS.FUEL_REQUEST_CREATE,
    APP_PERMISSIONS.FUEL_REQUEST_VERIFY,
    APP_PERMISSIONS.FUEL_REQUEST_REJECT,
    APP_PERMISSIONS.FUEL_REQUEST_APPROVE,
    APP_PERMISSIONS.FUEL_REQUEST_START,
    APP_PERMISSIONS.FUEL_REQUEST_COMPLETE,
    APP_PERMISSIONS.FUEL_REQUEST_CANCEL,

    // Transactions
    APP_PERMISSIONS.TRANSACTION_VIEW,
    APP_PERMISSIONS.TRANSACTION_CREATE,
    APP_PERMISSIONS.TRANSACTION_SUMMARY_VIEW,

    // Audit
    APP_PERMISSIONS.AUDIT_LOG_VIEW,

    // Station settings
    APP_PERMISSIONS.STATION_SETTINGS_VIEW,
    APP_PERMISSIONS.STATION_SETTINGS_UPDATE,

    // Traffic
    APP_PERMISSIONS.TRAFFIC_VIEW,
    APP_PERMISSIONS.TRAFFIC_UPDATE,

    // Cameras
    APP_PERMISSIONS.CAMERA_VIEW,
    APP_PERMISSIONS.CAMERA_CREATE,
    APP_PERMISSIONS.CAMERA_UPDATE,
    APP_PERMISSIONS.CAMERA_DELETE,
    APP_PERMISSIONS.CAMERA_STATUS_UPDATE,

    // AI monitoring
    APP_PERMISSIONS.AI_MONITORING_VIEW,

    // Queue zones
    APP_PERMISSIONS.QUEUE_ZONE_VIEW,
    APP_PERMISSIONS.QUEUE_ZONE_CREATE,
    APP_PERMISSIONS.QUEUE_ZONE_UPDATE,
    APP_PERMISSIONS.QUEUE_ZONE_DELETE,

    // Organizations
    APP_PERMISSIONS.ORGANIZATION_VIEW,
    APP_PERMISSIONS.ORGANIZATION_CREATE,
    APP_PERMISSIONS.ORGANIZATION_UPDATE,
    APP_PERMISSIONS.ORGANIZATION_DELETE,

    // Quota
    APP_PERMISSIONS.QUOTA_VIEW,
    APP_PERMISSIONS.QUOTA_CREATE,
    APP_PERMISSIONS.QUOTA_UPDATE,
    APP_PERMISSIONS.QUOTA_APPROVE,
    APP_PERMISSIONS.QUOTA_CANCEL,

    // Business licenses
    APP_PERMISSIONS.BUSINESS_LICENSE_VIEW,
    APP_PERMISSIONS.BUSINESS_LICENSE_CREATE,
    APP_PERMISSIONS.BUSINESS_LICENSE_UPDATE,
    APP_PERMISSIONS.BUSINESS_LICENSE_DELETE,

    // Notifications
    APP_PERMISSIONS.NOTIFICATION_VIEW,
    APP_PERMISSIONS.NOTIFICATION_MANAGE,
  ],


  // ===================================================
  // STATION MANAGER
  // ===================================================

  station_manager: [
    // Dashboard
    APP_PERMISSIONS.DASHBOARD_VIEW,

    // Station
    APP_PERMISSIONS.STATION_VIEW,
    APP_PERMISSIONS.STATION_UPDATE,

    // Staff
    APP_PERMISSIONS.STAFF_VIEW,
    APP_PERMISSIONS.STAFF_CREATE,
    APP_PERMISSIONS.STAFF_UPDATE,
    APP_PERMISSIONS.STAFF_STATUS_UPDATE,
    APP_PERMISSIONS.STAFF_PASSWORD_UPDATE,

    // Fuel management
    APP_PERMISSIONS.FUEL_MANAGEMENT_VIEW,

    // Fuel types / pricing
    APP_PERMISSIONS.FUEL_TYPE_VIEW,
    APP_PERMISSIONS.FUEL_PRICING_VIEW,

    // Tanks
    APP_PERMISSIONS.TANK_VIEW,
    APP_PERMISSIONS.TANK_CREATE,
    APP_PERMISSIONS.TANK_REFILL,
    APP_PERMISSIONS.TANK_ADJUST,

    // Pumps
    APP_PERMISSIONS.PUMP_VIEW,
    APP_PERMISSIONS.PUMP_CREATE,
    APP_PERMISSIONS.PUMP_UPDATE,
    APP_PERMISSIONS.PUMP_STATUS_UPDATE,

    // Nozzles
    APP_PERMISSIONS.NOZZLE_VIEW,
    APP_PERMISSIONS.NOZZLE_CREATE,
    APP_PERMISSIONS.NOZZLE_UPDATE,
    APP_PERMISSIONS.NOZZLE_STATUS_UPDATE,

    // Fuel requests
    APP_PERMISSIONS.FUEL_REQUEST_VIEW,
    APP_PERMISSIONS.FUEL_REQUEST_VERIFY,
    APP_PERMISSIONS.FUEL_REQUEST_REJECT,
    APP_PERMISSIONS.FUEL_REQUEST_APPROVE,
    APP_PERMISSIONS.FUEL_REQUEST_START,
    APP_PERMISSIONS.FUEL_REQUEST_COMPLETE,
    APP_PERMISSIONS.FUEL_REQUEST_CANCEL,

    // Transactions
    APP_PERMISSIONS.TRANSACTION_VIEW,
    APP_PERMISSIONS.TRANSACTION_SUMMARY_VIEW,

    // Audit
    APP_PERMISSIONS.AUDIT_LOG_VIEW,

    // Station settings
    APP_PERMISSIONS.STATION_SETTINGS_VIEW,
    APP_PERMISSIONS.STATION_SETTINGS_UPDATE,

    // Traffic
    APP_PERMISSIONS.TRAFFIC_VIEW,
    APP_PERMISSIONS.TRAFFIC_UPDATE,

    // Cameras
    APP_PERMISSIONS.CAMERA_VIEW,
    APP_PERMISSIONS.CAMERA_CREATE,
    APP_PERMISSIONS.CAMERA_UPDATE,
    APP_PERMISSIONS.CAMERA_STATUS_UPDATE,

    // AI monitoring
    APP_PERMISSIONS.AI_MONITORING_VIEW,

    // Queue zones
    APP_PERMISSIONS.QUEUE_ZONE_VIEW,
    APP_PERMISSIONS.QUEUE_ZONE_CREATE,
    APP_PERMISSIONS.QUEUE_ZONE_UPDATE,
    APP_PERMISSIONS.QUEUE_ZONE_DELETE,

    // Notifications
    APP_PERMISSIONS.NOTIFICATION_VIEW,
  ],


  // ===================================================
  // STATION STAFF
  // ===================================================

  station_staff: [
    // Dashboard
    APP_PERMISSIONS.DASHBOARD_VIEW,

    // Fuel requests
    APP_PERMISSIONS.FUEL_REQUEST_VIEW,
    APP_PERMISSIONS.FUEL_REQUEST_VERIFY,
    APP_PERMISSIONS.FUEL_REQUEST_REJECT,
    APP_PERMISSIONS.FUEL_REQUEST_START,
    APP_PERMISSIONS.FUEL_REQUEST_COMPLETE,

    // Transactions
    APP_PERMISSIONS.TRANSACTION_VIEW,
    APP_PERMISSIONS.TRANSACTION_CREATE,

    // Fuel operation
    APP_PERMISSIONS.FUEL_MANAGEMENT_VIEW,

    // Station operational resources
    APP_PERMISSIONS.STATION_VIEW,
    APP_PERMISSIONS.TANK_VIEW,
    APP_PERMISSIONS.PUMP_VIEW,
    APP_PERMISSIONS.NOZZLE_VIEW,

    // Notifications
    APP_PERMISSIONS.NOTIFICATION_VIEW,
  ],
};


/**
 * =====================================================
 * 3. ROUTE PERMISSIONS
 * =====================================================
 *
 * Every protected frontend route should be registered.
 *
 * SECURITY DEFAULT:
 *
 * Unknown protected routes are DENIED.
 *
 * More specific routes MUST appear before generic routes.
 */

export const ROUTE_PERMISSIONS: Array<{
  pattern: RegExp;
  permission: AppPermission;
}> = [

  // ===================================================
  // DASHBOARD
  // ===================================================

  {
    pattern: /^\/dashboard$/,
    permission: APP_PERMISSIONS.DASHBOARD_VIEW,
  },


  // ===================================================
  // ADMIN — SYSTEM USERS
  // ===================================================

  {
    pattern: /^\/dashboard\/users\/system(?:\/.*)?$/,
    permission: APP_PERMISSIONS.SYSTEM_USERS_VIEW,
  },

  {
    pattern: /^\/dashboard\/users\/drivers\/business-licenses(?:\/.*)?$/,
    permission: APP_PERMISSIONS.BUSINESS_LICENSE_VIEW,
  },

  {
    pattern: /^\/dashboard\/users\/drivers(?:\/.*)?$/,
    permission: APP_PERMISSIONS.DRIVER_VIEW,
  },


  // ===================================================
  // ADMIN — VEHICLE TYPES
  // ===================================================

  {
    pattern: /^\/dashboard\/vehicle-types(?:\/.*)?$/,
    permission: APP_PERMISSIONS.VEHICLE_TYPE_VIEW,
  },


  // ===================================================
  // ORGANIZATIONS
  // ===================================================

  {
    pattern: /^\/dashboard\/organizations(?:\/.*)?$/,
    permission: APP_PERMISSIONS.ORGANIZATION_VIEW,
  },


  // ===================================================
  // STATIONS
  // ===================================================

  {
    pattern: /^\/dashboard\/stations\/create(?:\/.*)?$/,
    permission: APP_PERMISSIONS.STATION_CREATE,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/edit(?:\/.*)?$/,
    permission: APP_PERMISSIONS.STATION_UPDATE,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/staff(?:\/.*)?$/,
    permission: APP_PERMISSIONS.STAFF_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/tanks(?:\/.*)?$/,
    permission: APP_PERMISSIONS.TANK_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/pumps(?:\/.*)?$/,
    permission: APP_PERMISSIONS.PUMP_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/nozzles(?:\/.*)?$/,
    permission: APP_PERMISSIONS.NOZZLE_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/fuel-config(?:\/.*)?$/,
    permission: APP_PERMISSIONS.FUEL_PRICING_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/settings(?:\/.*)?$/,
    permission: APP_PERMISSIONS.STATION_SETTINGS_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/traffic(?:\/.*)?$/,
    permission: APP_PERMISSIONS.TRAFFIC_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/audit-logs(?:\/.*)?$/,
    permission: APP_PERMISSIONS.AUDIT_LOG_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+\/fuel-transactions(?:\/.*)?$/,
    permission: APP_PERMISSIONS.TRANSACTION_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations\/[^/]+$/,
    permission: APP_PERMISSIONS.STATION_VIEW,
  },

  {
    pattern: /^\/dashboard\/stations$/,
    permission: APP_PERMISSIONS.STATION_VIEW,
  },


  // ===================================================
  // FUEL TYPES
  // ===================================================

  {
    pattern: /^\/dashboard\/fuel-types(?:\/.*)?$/,
    permission: APP_PERMISSIONS.FUEL_TYPE_VIEW,
  },


  // ===================================================
  // FUEL MANAGEMENT
  // ===================================================

  {
    pattern: /^\/dashboard\/fuel-management(?:\/.*)?$/,
    permission: APP_PERMISSIONS.FUEL_MANAGEMENT_VIEW,
  },


  // ===================================================
  // TANKS
  // ===================================================

  {
    pattern: /^\/dashboard\/tanks(?:\/.*)?$/,
    permission: APP_PERMISSIONS.TANK_VIEW,
  },


  // ===================================================
  // PUMPS / DISPENSERS / NOZZLES
  // ===================================================

  {
    pattern: /^\/dashboard\/pumps(?:\/.*)?$/,
    permission: APP_PERMISSIONS.PUMP_VIEW,
  },


  // ===================================================
  // TRANSACTIONS
  // ===================================================

  {
    pattern: /^\/dashboard\/transactions(?:\/.*)?$/,
    permission: APP_PERMISSIONS.TRANSACTION_VIEW,
  },


  // ===================================================
  // FUEL REQUESTS
  // ===================================================

  {
    pattern: /^\/dashboard\/requests\/bulk(?:\/.*)?$/,
    permission: APP_PERMISSIONS.FUEL_REQUEST_VIEW,
  },

  {
    pattern: /^\/dashboard\/requests\/operation(?:\/.*)?$/,
    permission: APP_PERMISSIONS.FUEL_REQUEST_START,
  },

  {
    pattern: /^\/dashboard\/requests(?:\/.*)?$/,
    permission: APP_PERMISSIONS.FUEL_REQUEST_VIEW,
  },


  // ===================================================
  // LEGACY / GENERAL FUEL REQUEST ROUTE
  // ===================================================

  {
    pattern: /^\/dashboard\/fuel-requests(?:\/.*)?$/,
    permission: APP_PERMISSIONS.FUEL_REQUEST_VIEW,
  },


  // ===================================================
  // VEHICLES
  // ===================================================

  {
    pattern: /^\/dashboard\/vehicles\/create(?:\/.*)?$/,
    permission: APP_PERMISSIONS.VEHICLE_CREATE,
  },

  {
    pattern: /^\/dashboard\/vehicles\/[^/]+\/edit(?:\/.*)?$/,
    permission: APP_PERMISSIONS.VEHICLE_UPDATE,
  },

  {
    pattern: /^\/dashboard\/vehicles\/[^/]+$/,
    permission: APP_PERMISSIONS.VEHICLE_VIEW,
  },

  {
    pattern: /^\/dashboard\/vehicles$/,
    permission: APP_PERMISSIONS.VEHICLE_VIEW,
  },


  // ===================================================
  // AI MONITORING
  // ===================================================

  {
    pattern: /^\/dashboard\/camera\/zones(?:\/.*)?$/,
    permission: APP_PERMISSIONS.QUEUE_ZONE_VIEW,
  },

  {
    pattern: /^\/dashboard\/camera(?:\/.*)?$/,
    permission: APP_PERMISSIONS.CAMERA_VIEW,
  },


  // ===================================================
  // CAMERAS — NEW ROUTE
  // ===================================================

  {
    pattern: /^\/dashboard\/cameras(?:\/.*)?$/,
    permission: APP_PERMISSIONS.CAMERA_VIEW,
  },


  // ===================================================
  // STAFF
  // ===================================================

  {
    pattern: /^\/dashboard\/staffs(?:\/.*)?$/,
    permission: APP_PERMISSIONS.STAFF_VIEW,
  },


  // ===================================================
  // STATION SETTINGS
  // ===================================================

  {
    pattern: /^\/dashboard\/station-settings(?:\/.*)?$/,
    permission: APP_PERMISSIONS.STATION_SETTINGS_VIEW,
  },


  // ===================================================
  // SYSTEM SETTINGS
  // ===================================================

  {
    pattern: /^\/dashboard\/settings(?:\/.*)?$/,
    permission: APP_PERMISSIONS.SYSTEM_SETTINGS_VIEW,
  },


  // ===================================================
  // QUOTAS
  // ===================================================

  {
    pattern: /^\/dashboard\/quotas(?:\/.*)?$/,
    permission: APP_PERMISSIONS.QUOTA_VIEW,
  },


  // ===================================================
  // BUSINESS LICENSES
  // ===================================================

  {
    pattern: /^\/dashboard\/business-licenses(?:\/.*)?$/,
    permission: APP_PERMISSIONS.BUSINESS_LICENSE_VIEW,
  },


  // ===================================================
  // NOTIFICATIONS
  // ===================================================

  {
    pattern: /^\/dashboard\/notifications(?:\/.*)?$/,
    permission: APP_PERMISSIONS.NOTIFICATION_VIEW,
  },
];


/**
 * =====================================================
 * 4. PERMISSION HELPERS
 * =====================================================
 */

export function hasPermission(
  role: UserRole,
  permission: AppPermission,
): boolean {
  const permissions = ROLE_PERMISSIONS[role];

  if (!permissions) {
    return false;
  }

  return permissions.includes(permission);
}


/**
 * =====================================================
 * 5. ROUTE ACCESS CHECK
 * =====================================================
 */

export function canAccessRoute(
  role: UserRole,
  pathname: string,
): boolean {
  const route = ROUTE_PERMISSIONS.find(
    ({ pattern }) => pattern.test(pathname),
  );

  /**
   * Security default:
   *
   * If a protected route is not registered,
   * access is denied.
   */
  if (!route) {
    return false;
  }

  return hasPermission(
    role,
    route.permission,
  );
}


/**
 * =====================================================
 * 6. GET REQUIRED ROUTE PERMISSION
 * =====================================================
 */

export function getRoutePermission(
  pathname: string,
): AppPermission | null {
  const route = ROUTE_PERMISSIONS.find(
    ({ pattern }) => pattern.test(pathname),
  );

  return route?.permission ?? null;
}


/**
 * =====================================================
 * 7. ROLE PERMISSION CHECK
 * =====================================================
 */

export function canUser(
  role: UserRole,
  permission: AppPermission,
): boolean {
  return hasPermission(
    role,
    permission,
  );
}


/**
 * =====================================================
 * 8. NAVIGATION
 * =====================================================
 *
 * CLEAN DOMAIN SEPARATION:
 *
 * Admin
 *   → Business + system governance
 *
 * Station Manager
 *   → Station operations + AI monitoring
 *
 * Station Staff
 *   → Execution only
 *
 * Driver
 *   → Own vehicles + own fuel requests
 *
 *
 * IMPORTANT:
 *
 * NAV_BY_ROLE is UI authorization only.
 * Backend permissions remain authoritative.
 */

export const NAV_BY_ROLE: Record<
  UserRole,
  NavItem[]
> = {

  // ===================================================
  // ADMIN
  // ===================================================

  admin: [

    // -----------------------------------------------
    // 1. OVERVIEW
    // -----------------------------------------------

    {
      title: "Platform Overview",
      url: "/dashboard",
      icon: PieChart,
    },


    // -----------------------------------------------
    // 2. USER & VEHICLE MANAGEMENT
    // -----------------------------------------------

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

        {
          title: "Vehicles",
          url: "/dashboard/vehicles",
        },
      ],
    },


    // -----------------------------------------------
    // 3. ORGANIZATIONS
    // -----------------------------------------------

    {
      title: "Organizations",
      url: "/dashboard/organizations",
      icon: Building2,
    },


    // -----------------------------------------------
    // 4. STATIONS CONTROL
    // -----------------------------------------------

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


    // -----------------------------------------------
    // 5. SYSTEM SETTINGS
    // -----------------------------------------------

    {
      title: "System Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },


    // -----------------------------------------------
    // 6. NOTIFICATIONS
    // -----------------------------------------------

    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
  ],


  // ===================================================
  // STATION MANAGER
  // ===================================================

  station_manager: [

    // -----------------------------------------------
    // DASHBOARD
    // -----------------------------------------------

    {
      title: "Station Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },


    // -----------------------------------------------
    // OPERATIONS
    // -----------------------------------------------

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
          title: "Dispenser & Nozzles",
          url: "/dashboard/pumps",
        },

        {
          title: "Transactions",
          url: "/dashboard/transactions",
        },
      ],
    },


    // -----------------------------------------------
    // AI MONITORING
    // -----------------------------------------------

    {
      title: "AI Monitoring",
      url: "#",
      icon: Camera,
      items: [

        {
          title: "Cameras",
          url: "/dashboard/camera",
        },

        {
          title: "Queue Zones",
          url: "/dashboard/camera/zones",
        },
      ],
    },


    // -----------------------------------------------
    // STAFF
    // -----------------------------------------------

    {
      title: "Staffs",
      url: "/dashboard/staffs",
      icon: Users,
    },


    // -----------------------------------------------
    // STATION SETTINGS
    // -----------------------------------------------

    {
      title: "Station Settings",
      url: "/dashboard/station-settings",
      icon: Settings,
    },


    // -----------------------------------------------
    // NOTIFICATIONS
    // -----------------------------------------------

    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
  ],


  // ===================================================
  // STATION STAFF
  // ===================================================

  station_staff: [

    // -----------------------------------------------
    // DASHBOARD
    // -----------------------------------------------

    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },


    // -----------------------------------------------
    // INCOMING REQUESTS
    // -----------------------------------------------

    {
      title: "Incoming Fuel Requests",
      url: "/dashboard/requests",
      icon: ClipboardList,
    },


    // -----------------------------------------------
    // ORGANIZATION BULK FUEL
    // -----------------------------------------------

    {
      title: "Organization Fuel Console",
      url: "/dashboard/requests/bulk",
      icon: Layers,
    },


    // -----------------------------------------------
    // FUEL OPERATION
    // -----------------------------------------------

    {
      title: "Fuel Operation",
      url: "/dashboard/requests/operation",
      icon: Fuel,
    },


    // -----------------------------------------------
    // TRANSACTIONS
    // -----------------------------------------------

    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: Activity,
    },


    // -----------------------------------------------
    // NOTIFICATIONS
    // -----------------------------------------------

    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
  ],
};