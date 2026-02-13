export const navigationItems = [
  // Watch Tower
  { name: "Watch Tower -N", path: "/watch-tower" },

  // Asset Center and its sub-items
  { name: "Asset Center", path: "/asset-center" },
  { name: "API Center", path: "/cx/api-center", parent: "Asset Center" },
  { name: "API Security Policies - N", path: "/asset-center/api-security-policies", parent: "Asset Center" },
  { name: "Product Center", path: "/cx/asset-center/product-center", parent: "Asset Center" },
  { name: "Smart Metering", path: "/asset-center/smartmeterslist", parent: "Asset Center" },

  // Infra Administration and its sub-items
  { name: "Infra Administration -N", path: "/infra" },
  { name: "Infra Health -N", path: "/infra/infra-health", parent: "Infra Administration -N" },
  { name: "Knob Controllers -N", path: "/cx/infraAdministration/knoobController", parent: "Infra Administration -N" },

  // Observability and its sub-items
  { name: "Observability -N", path: "/observability" },
  { name: "Asset Observability -N", path: "/cx/observability/asset-observability", parent: "Observability -N" },
  { name: "Self Service Analytics -N", path: "/observability/self-service", parent: "Observability -N" },
  { name: "Event Logs -N", path: "/cx/observability/event-logs", parent: "Observability -N" },

  // Administration and its sub-items
  { name: "Administration", path: "/administration" },
  { name: "Cx Portal", path: "/administration/cx-portal", parent: "Administration" },
  { name: "Activity Log", path: "/administration/activity-logs", parent: "Administration" },

  // Partners and its sub-items
  { name: "Partners", path: "/cx/partners" },
  { name: "Organization", path: "/cx/partners/organizationPartner", parent: "Partners" },
  { name: "Developers Hub", path: "/infra/developer-portal", parent: "Partners" },

  // Smart Estimation and its sub-items
  { name: "Smart Estimation", path: "/smart-estimation" },
  { name: "Estimation Rules", path: "/estimation-rules", parent: "Smart Estimation" },
  { name: "Meter Cost Center", path: "/smartbudgeting", parent: "Smart Estimation" },
  { name: "API Budgeting", path: "/cx/apibudgeting", parent: "Smart Estimation" },

  // Notification Manager and its sub-items
  { name: "Notification Manager -N", path: "/notification-manager" },
  { name: "Notification Group -N", path: "/cx/notification-manager/NotificationGroups", parent: "Notification Manager -N" },
  { name: "Notification Templates -N", path: "/cx/notification-manager/NotificationTemplates", parent: "Notification Manager -N" },
  { name: "Ledger -N", path: "/cx/notification-manager/ledger", parent: "Notification Manager -N" },

  // Governance Center and its sub-items
  { name: "Governance Center", path: "/governance-center" },
  { name: "Policy configuration", path: "/Security-policy-configration", parent: "Governance Center" },
  { name: "Asset Sharing Center", path: "/cx/Governance-center/sharing-center", parent: "Governance Center" },
  { name: "Subscription Center", path: "/cx/administration/subscriptionsetting", parent: "Governance Center" },

  // Sandbox Plane and its sub-items
  { name: "Sandbox Plane -N", path: "/cx/sandbox-plan" },

  // Interceptor
  { name: "Interceptor", path: "/cx/session-data" },

  // Marketplace and its sub-items
  { name: "Marketplace", path: "/marketplace" },
  { name: "APIs", path: "/cx/Governance-center/api-catalogue", parent: "Marketplace" },
  { name: "Products", path: "/cx/Governance-center/product-catalogue", parent: "Marketplace" },

  // API Flow and its sub-items
  { name: "API FLow", path: "/cx/apiflow" }
];
