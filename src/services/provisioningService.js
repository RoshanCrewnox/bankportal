import apiClient from './apiClient';
import API from '../api';

const provisioningService = {
  getTPPs: async () => {
    // Keeping TPP mock for now as per plan focus on Products/APIs and PartnerOrg
    const mockTPPs = [
      { id: 1, name: "Acme Fintech", status: "Active", apis: 5, lastProvisioned: "2024-02-10", type: "PISP", region: "UK", openBankingType: "PISP" },
      { id: 2, name: "Global Wealth", status: "Pending", apis: 3, lastProvisioned: "2024-02-12", type: "AISP", region: "EU", openBankingType: "AISP" },
      { id: 3, name: "Secure Pay", status: "Suspended", apis: 8, lastProvisioned: "2024-01-28", type: "CBPII", region: "Global", openBankingType: "Both" },
      { id: 4, name: "Fast Finance", status: "Active", apis: 2, lastProvisioned: "2024-02-05", type: "AISP", region: "UK", openBankingType: "AISP" },
      { id: 5, name: "Budget Buddy", status: "Active", apis: 12, lastProvisioned: "2024-02-11", type: "PISP", region: "US", openBankingType: "PISP" },
    ];
    return { data: { items: mockTPPs, total: mockTPPs.length } };
  },
  
  getProducts: async (page = 1) => {
    try {
      const response = await apiClient.get(API.provisioning.PRODUCT_LIST(), {
        params: { 'Page-Number': page }
      });
      // Handle response structure: it might be an array or an object with TOTAL_RECORDS
      const items = Array.isArray(response.data) ? response.data : 
                    (response.data.items || []);
      const total = response.data.TOTAL_RECORDS !== undefined ? response.data.TOTAL_RECORDS : 
                    (response.data.total || items.length);
                    
      return {
        data: {
          items: items,
          total: total
        }
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { data: { items: [], total: 0 } };
    }
  },

  getAPIs: async (page = 1) => {
    try {
      const response = await apiClient.get(API.provisioning.APIS_LIST(), {
        params: { 'Page-Number': page }
      });
      const items = Array.isArray(response.data) ? response.data : 
                    (response.data.items || []);
      const total = response.data.TOTAL_RECORDS !== undefined ? response.data.TOTAL_RECORDS : 
                    (response.data.total || items.length);

      return {
        data: {
          items: items,
          total: total
        }
      };
    } catch (error) {
      console.error("Error fetching APIs:", error);
      return { data: { items: [], total: 0 } };
    }
  },
  
  getCustomers: async () => {
    const mockCustomers = [
        { id: 1, name: "TechCorp Ltd", type: "Enterprise", region: "UK", exposure: "Public", status: "Active" },
        { id: 2, name: "StartUp Inc", type: "SME", region: "EU", exposure: "Partner", status: "Pending" },
    ];
    return { data: { items: mockCustomers, total: mockCustomers.length } };
  }
};

export default provisioningService;
