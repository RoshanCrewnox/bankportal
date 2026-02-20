import apiClient from './apiClient';
import API from '../api';

const partnerService = {
  getPartnerOrgs: async (page = 1) => {
    try {
      const response = await apiClient.get(API.partners.PARTNER_ORG_LIST(), {
        params: { 'Page-Number': page }
      });
      // Safety: ensure it returns an array even if response is like {"TOTAL_RECORDS": 0}
      if (Array.isArray(response.data)) return response.data;
      if (response.data && response.data.items) return response.data.items;
      return [];
    } catch (error) {
      console.error("Error fetching partner organizations:", error);
      return [];
    }
  }
};

export default partnerService;
