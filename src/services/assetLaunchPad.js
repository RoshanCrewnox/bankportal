import apiClient from "./apiClient";
import AssetLaunchPadEndpoints from "../api/assetLaunchPad";

export default {
  FETCH_API_LIST: (page = 1, searchQuery = '') => {
    return apiClient.get(AssetLaunchPadEndpoints.FETCH_API_LIST(), {
      params: {
        'Page-Number': page,
        ...(searchQuery && { 'Lookup-Query': searchQuery })
      }
    });
  },

  FETCH_API_DETAIL: (id) => {
    return apiClient.get(AssetLaunchPadEndpoints.FETCH_API_DETAIL(id));
  },

  LAUNCH_API: (payload) => {
    return apiClient.put(AssetLaunchPadEndpoints.LAUNCH_API(), payload);
  },

  FETCH_ASSETS: () => {
    return apiClient.get(AssetLaunchPadEndpoints.FETCH_ASSETS());
  },

  FETCH_ESTIMATION_RULES: () => {
    return apiClient.get(AssetLaunchPadEndpoints.FETCH_ESTIMATION_RULES());
  },

  UPDATE_ESTIMATION_RULES: (payload) => {
    return apiClient.put(AssetLaunchPadEndpoints.UPDATE_ESTIMATION_RULES(), payload);
  },

  FETCH_SMARTMETER_LIST: (page = 1, searchQuery = '') => {
    // Note: FETCH_SMARTMETER_LIST endpoint already includes ?smart-meter-type=LIVE
    // We append Page-Number and Lookup-Query as additional params
    return apiClient.get(AssetLaunchPadEndpoints.FETCH_SMARTMETER_LIST(), {
      params: {
        'Page-Number': page,
        ...(searchQuery && { 'Lookup-Query': searchQuery })
      }
    });
  },

  LAUNCH_SMARTMETER: (payload) => {
    return apiClient.put(AssetLaunchPadEndpoints.LAUNCH_SMARTMETER(), payload);
  },

  FETCH_SB_SMARTMETER_LIST: (page = 1, searchQuery = '') => {
    return apiClient.get(AssetLaunchPadEndpoints.FETCH_SB_SMARTMETER_LIST(), {
      params: {
        'Page-Number': page,
        ...(searchQuery && { 'Lookup-Query': searchQuery })
      }
    });
  },

  LAUNCH_SB_SMARTMETER: (payload) => {
    return apiClient.put(AssetLaunchPadEndpoints.LAUNCH_SB_SMARTMETER(), payload);
  },

  FETCH_PRODUCTS_LIST: (page = 1, searchQuery = '') => {
    return apiClient.get(AssetLaunchPadEndpoints.FETCH_PRODUCTS_LIST(), {
      params: {
        'Page-Number': page,
        ...(searchQuery && { 'Lookup-Query': searchQuery })
      }
    });
  },

  LAUNCH_PRODUCT: (payload) => {
    return apiClient.put(AssetLaunchPadEndpoints.LAUNCH_PRODUCT(), payload);
  },
};
