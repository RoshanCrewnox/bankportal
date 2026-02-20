import React from 'react';
import { Building2, LayoutDashboard, Settings2, ShieldCheck, FileJson } from "lucide-react";

/**
 * Sidebar navigation configuration
 * Each item can have an icon, pathname, or a submenu
 */
export const sidebarItems = [
  {
    id: "open-banking",
    name: "Open Banking",
    icon: <Building2 className="w-5 h-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: "ob-dashboard",
        name: "Dashboard",
        pathname: "/open-banking/dashboard",
      },
      {
        id: "ob-provisioning",
        name: "Provisioning",
        pathname: "/open-banking/provisioning",
      },
      {
        id: "ob-consent",
        name: "Consent Center",
        pathname: "/open-banking/consent-center",
      },
    ],
  },
  {
    id: "schema-registry",
    name: "Schema Registry",
    icon: <FileJson className="w-5 h-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: "sr-builder",
        name: "Schema Builder",
        pathname: "/schema-registry/builder",
      },
      {
        id: "sr-fields",
        name: "Fields Registry",
        pathname: "/schema-registry/fields",
      },
      {
        id: "sr-flow",
        name: "Schema Flow",
        pathname: "/schema-registry/flow",
      },
    ],
  },
];
