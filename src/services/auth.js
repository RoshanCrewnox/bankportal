import apiClient from "./apiClient";
import api from "../api";
import { saveSessionData } from "../components/auth/localStorage";
import toast from "react-hot-toast";

const authService = {
  REGISTER_USER: async (data) => {
    const response = await apiClient.post(api.auth.REGISTER(), data);
    if (response?.data?.tokens?.access?.token) {
      localStorage.setItem("access_token", response.data.tokens.access.token);
    }
    return response;
  },

  UPDATE_USER: async (data) => {
    return await apiClient.post(api.auth.UPDATE(), data);
  },

  LOGIN_USER: async (data) => {
    const response = await apiClient.post(api.auth.LOGIN(), data);
    if (response?.data?.access_token) {
      saveSessionData(response?.data, true);
      localStorage.setItem("access_token", response?.data?.access_token);
      localStorage.setItem("refresh_token", response?.data?.refresh_token);
    }
    return response;
  },

  LOGIN_MFA: async (data) => {
    try {
      const response = await apiClient.post(api.auth.LOGIN_MFA(), data);
      if (response?.data?.access_token) {
        saveSessionData(response?.data, true);
        localStorage.setItem("access_token", response?.data?.access_token);
        localStorage.setItem("refresh_token", response?.data?.refresh_token);
      }
      return response;
    } catch (err) {
      toast.error("Invalid MFA Code");
      throw err;
    }
  },

  LOGOUT: async () => {
    const response = await apiClient.delete(api.auth.LOGOUT());
    localStorage.clear();
    return response;
  },

  FORGOT_PASSWORD: async (data) => {
    return await apiClient.post(api.auth.FORGOT_PASSWORD(), data);
  },

  RESET_PASSWORD: async (data) => {
    return await apiClient.post(api.auth.RESET_PASSWORD(), data);
  },

  REFRESH_TOKEN: async (data) => {
    try {
      const response = await apiClient.post(api.auth.REFRESH_JWT_TOKEN(), data);
      if (response?.data) {
        saveSessionData(response?.data, true);
        localStorage.setItem("access_token", response?.data?.access_token);
        localStorage.setItem("refresh_token", response?.data?.refresh_token);
      }
      return response;
    } catch (err) {
      toast.error("Session expired. Please log in again.");
      throw err;
    }
  },
};

export default authService;
