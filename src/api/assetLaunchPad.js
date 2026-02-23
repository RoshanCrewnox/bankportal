export default {
  FETCH_API_LIST: () => '/cx/asset-launchpad/apis/list',
  FETCH_API_DETAIL: (id) => `/cx/asset-launchpad/apis/api/${id}`,
  LAUNCH_API: () => '/cx/asset-launchpad/apis/launch',
  FETCH_ASSETS: () => '/cx/asset-launchpad/assets',
  FETCH_ESTIMATION_RULES: () => '/cx/asset-launchpad/smart-estimator/estimate-config',
  UPDATE_ESTIMATION_RULES: () => '/cx/asset-launchpad/smart-estimator/estimate-config',
  FETCH_SMARTMETER_LIST: () => '/cx/asset-launchpad/meters/list?smart-meter-type=LIVE',
  LAUNCH_SMARTMETER: () => '/cx/asset-launchpad/meters/launch',
  FETCH_SB_SMARTMETER_LIST: () => '/cx/asset-launchpad/meters/list?smart-meter-type=SANDBOX',
  LAUNCH_SB_SMARTMETER: () => '/cx/asset-launchpad/meters/launch',
  FETCH_PRODUCTS_LIST: () => '/cx/asset-launchpad/products/list',
  LAUNCH_PRODUCT: () => '/cx/asset-launchpad/products/launch'

};