/* eslint-disable import/no-anonymous-default-export */
import apiClient from "./apiClient";
import smartEstimationApi from "../api/smartEstimationRules";

export default {
  FETCH_ESTIMATION_DETAILS: () => {
    return apiClient.get(smartEstimationApi.FETCH_ESTIMATION_DETAILS());
  },
  UPDATE_ESTIMATION_DETAILS: (payload) => {
    return apiClient.put(smartEstimationApi.UPDATE_ESTIMATION_DETAILS(), payload);
  },
  FETCH_THROTTLE_QUOTA_RATIO: () => {
    return apiClient.get(smartEstimationApi.FETCH_THROTTLE_QUOTA_RATIO());
  },
  UPDATE_THROTTLE_QUOTA_RATIO: (payload) => {
    return apiClient.put(smartEstimationApi.UPDATE_THROTTLE_QUOTA_RATIO(), payload);
  },
  FETCH_OTS_TIER: () => {
    return apiClient.get(smartEstimationApi.FETCH_OTS_TIER());
  },
  UPDATE_OTS_TIER: (payload) => {
    return apiClient.put(smartEstimationApi.UPDATE_OTS_TIER(), payload);
  },
};
