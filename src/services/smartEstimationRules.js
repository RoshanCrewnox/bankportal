/* eslint-disable import/no-anonymous-default-export */
import Axios from "axios";
import api from "../api";
import smartEstimationApi from "../api/smartEstimationRules";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default {
  FETCH_ESTIMATION_DETAILS: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.get(
          BASE_URL + smartEstimationApi.FETCH_ESTIMATION_DETAILS(),
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
  UPDATE_ESTIMATION_DETAILS: (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.put(
          BASE_URL + smartEstimationApi.UPDATE_ESTIMATION_DETAILS(),
          payload,
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
  FETCH_THROTTLE_QUOTA_RATIO: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.get(
          BASE_URL + smartEstimationApi.FETCH_THROTTLE_QUOTA_RATIO(),
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
  UPDATE_THROTTLE_QUOTA_RATIO: (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.put(
          BASE_URL + smartEstimationApi.UPDATE_THROTTLE_QUOTA_RATIO(),
          payload,
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
  FETCH_OTS_TIER: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.get(
          BASE_URL + smartEstimationApi.FETCH_OTS_TIER(),
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
  UPDATE_OTS_TIER: (payload) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.put(
          BASE_URL + smartEstimationApi.UPDATE_OTS_TIER(),
          payload,
        );
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
};
