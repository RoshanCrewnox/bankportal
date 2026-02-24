/**
 * launchpadUtils.js - Data mapping and pure functions for Asset LaunchPad.
 * Mandatory Rules: Pure functions, no side effects, < 40 lines per function.
 */

export const mapApiResponseToApiAsset = (api) => ({
  id: api.api_uuid,
  api_uuid: api.api_uuid,
  name: api.api_name,
  api_name: api.api_name,
  status: api.api_status,
  lastUpdated: api.updated_at,
  subOrgs: [],
  version: api.api_version,
  commercial_type: api.commercial_type,
  is_public: api.is_public_apis,
  api_status: api.api_status,
  is_shared_object: api.is_shared_object || false,
  cross_shared_object: api.cross_shared_object || false,
  description: api.api_description,
  api_description: api.api_description,
  updatedBy: api.updated_by,
  createdBy: api.created_by,
  createdAt: api.created_at,
  updatedAt: api.updated_at,
  api_type: api.api_type,
  api_category_uuid: api.api_category_uuid,
  amount: api.api_amount || 0,
  min_amount: api.min_amount || 0,
  max_amount: api.max_amount || 100,
  api_category_type: api.api_category_type,
  api_visibility: api.is_public_apis,
  api_category: api.api_type || "N/A",
  upstream_uri: api.upstream_uri,
  downstream_uri: api.downstream_uri,
  downstream_domain_uuid: api.downstream_domain_uuid,
  sandbox_domain_uuid: api.sandbox_domain_uuid,
  api_key_location: api.api_key_location,
  api_key_name: api.api_key_name,
  ds_header_config: api.ds_header_config || [],
  methods: api.methods || [],
  mock_config: api.mock_config || {},
  pl_method_count: api.pl_method_count || 0,
  organisation_name: api.organisation_name,
  sub_org_name: api.sub_org_name,
});

export const mapApiResponseToProductAsset = (product) => ({
  id: product.product_uuid,
  product_uuid: product.product_uuid,
  name: product.product_name,
  status: product.status,
  lastUpdated: product.updated_at,
  updatedBy: product.updated_by,
  category: product.category || "-",
  visibility: product.is_public_products ? "Public" : "Private",
  subscriptionCount: product.subscription_count || 0,
  subOrgs: [],
  is_public: product.is_public_products,
  commercial_type: product.commercial_type,
  sandbox_enabled: product.sandbox_enabled,
  product_status: product.status,
  is_shared_object: product.is_shared_object,
  cross_shared_object: product.cross_shared_object,
  work_flow_attached: product.work_flow_attached,
  apis_count: product.apis_count || 0,
  live_sm_count: product.live_sm_count || 0,
  sb_sm_count: product.sb_sm_count || 0,
});

export const processLaunchpadStats = (launchpadAssets) => {
  const stats = {};
  if (Array.isArray(launchpadAssets)) {
    launchpadAssets.forEach((item) => {
      const key = `${item.asset_type}_${item.status}`.toLowerCase();
      stats[key] = item.total_count;
    });
  }
  return stats;
};

export const getAssetColumnName = (activeTab) => {
  switch (activeTab) {
    case "apis": return "API Name";
    case "products": return "Product Name";
    case "tpp": return "TPP Name";
    case "customer": return "Customer Name";
    default: return "Asset Name";
  }
};
