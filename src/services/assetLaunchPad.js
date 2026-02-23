import Axios from "axios";
import AssetLaunchPadEndpoints from "../api/assetLaunchPad";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default {
  FETCH_API_LIST: (page = 1, searchQuery = '') => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = BASE_URL + AssetLaunchPadEndpoints.FETCH_API_LIST() + `?Page-Number=${page}`;
        if (searchQuery) {
          url += `&Lookup-Query=${encodeURIComponent(searchQuery)}`;
        }
        const response = await Axios.get(url);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  FETCH_API_DETAIL: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.get(
          BASE_URL + AssetLaunchPadEndpoints.FETCH_API_DETAIL(id)
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  LAUNCH_API: (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.put(
          BASE_URL + AssetLaunchPadEndpoints.LAUNCH_API(),
          payload
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  FETCH_ASSETS: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.get(
          BASE_URL + AssetLaunchPadEndpoints.FETCH_ASSETS()
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  FETCH_ESTIMATION_RULES: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.get(
          BASE_URL + AssetLaunchPadEndpoints.FETCH_ESTIMATION_RULES()
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  UPDATE_ESTIMATION_RULES: (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.put(
          BASE_URL + AssetLaunchPadEndpoints.UPDATE_ESTIMATION_RULES(),
          payload
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  FETCH_SMARTMETER_LIST: (page = 1, searchQuery = '') => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = BASE_URL + AssetLaunchPadEndpoints.FETCH_SMARTMETER_LIST() + `&Page-Number=${page}`;
        if (searchQuery) {
          url += `&Lookup-Query=${encodeURIComponent(searchQuery)}`;
        }
        const response = await Axios.get(url);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  LAUNCH_SMARTMETER: (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.put(
          BASE_URL + AssetLaunchPadEndpoints.LAUNCH_SMARTMETER(),
          payload
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  FETCH_SB_SMARTMETER_LIST: (page = 1, searchQuery = '') => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = BASE_URL + AssetLaunchPadEndpoints.FETCH_SB_SMARTMETER_LIST() + `&Page-Number=${page}`;
        if (searchQuery) {
          url += `&Lookup-Query=${encodeURIComponent(searchQuery)}`;
        }
        const response = await Axios.get(url);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  LAUNCH_SB_SMARTMETER: (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.put(
          BASE_URL + AssetLaunchPadEndpoints.LAUNCH_SB_SMARTMETER(),
          payload
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  FETCH_PRODUCTS_LIST: (page = 1, searchQuery = '') => {
    return new Promise(async (resolve, reject) => {
      try {
        let url = BASE_URL + AssetLaunchPadEndpoints.FETCH_PRODUCTS_LIST() + `?Page-Number=${page}`;
        if (searchQuery) {
          url += `&Lookup-Query=${encodeURIComponent(searchQuery)}`;
        }
        const response = await Axios.get(url);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  LAUNCH_PRODUCT: (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.put(
          BASE_URL + AssetLaunchPadEndpoints.LAUNCH_PRODUCT(),
          payload
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
};
