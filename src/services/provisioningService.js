import apiClient from './apiClient';
import API from '../api';

const provisioningService = {
  getTPPs: async () => {
    // Keeping TPP mock for now as per plan focus on Products/APIs and PartnerOrg
    const mockTPPs = [
      { id: "TPP-001", name: "Acme Fintech", status: "Active", apis: 5, lastProvisioned: "2024-02-10", type: "PISP", region: "UK", openBankingType: "PISP", email: "contact@acme.com", access: "Full", onboardingDate: "2024-01-15" },
      { id: "TPP-002", name: "Global Wealth", status: "Pending", apis: 3, lastProvisioned: "2024-02-12", type: "AISP", region: "EU", openBankingType: "AISP", email: "info@globalwealth.com", access: "Partial", onboardingDate: "2024-02-01" },
      { id: "TPP-003", name: "Secure Pay", status: "Suspended", apis: 8, lastProvisioned: "2024-01-28", type: "CBPII", region: "Global", openBankingType: "Both", email: "support@securepay.io", access: "Limited", onboardingDate: "2023-11-20" },
      { id: "TPP-004", name: "Fast Finance", status: "Active", apis: 2, lastProvisioned: "2024-02-05", type: "AISP", region: "UK", openBankingType: "AISP", email: "hello@fastfinance.uk", access: "Full", onboardingDate: "2024-01-05" },
      { id: "TPP-005", name: "Budget Buddy", status: "Active", apis: 12, lastProvisioned: "2024-02-11", type: "PISP", region: "US", openBankingType: "PISP", email: "app@budgetbuddy.com", access: "Trial", onboardingDate: "2024-02-10" },
    ];
    return { data: { items: mockTPPs, total: mockTPPs.length } };
  },
  
  getProducts: async (page = 1) => {
    try {
      const response = await apiClient.get(API.provisioning.PRODUCT_LIST(), {
        params: { 'Page-Number': page }
      });
      // Handle response structure: it might be an array or an object with TOTAL_RECORDS
      const items = (Array.isArray(response.data) ? response.data : 
                    (response.data.products || response.data.items || [])).map(item => ({
                      ...item,
                      scope: item.scope || (Math.random() > 0.5 ? 'OB' : 'OF'),
                      onboardingDate: item.onboardingDate || '2024-02-15',
                      domain: item.domain || ['BFSI', 'Retail', 'Healthcare'][Math.floor(Math.random() * 3)],
                      subdomain: item.subdomain || ['Loans', 'Retail'],
                      access: item.access || (Math.random() > 0.5 ? 'Full' : 'Partial')
                    }));
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
                    (response.data.apis || response.data.items || []);
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
  },

  getBankCustomers: async () => {
    // Mocking bank customers available for onboarding
    return {
      data: [
        { id: 'BC-001', name: 'John Doe', email: 'john@bank.com', type: 'Retail' },
        { id: 'BC-002', name: 'Jane Smith', email: 'jane@bank.com', type: 'Corporate' },
        { id: 'BC-003', name: 'Robert Brown', email: 'robert@bank.com', type: 'SME' },
        { id: 'BC-004', name: 'Emily Davis', email: 'emily@bank.com', type: 'Retail' },
        { id: 'BC-005', name: 'Michael Wilson', email: 'michael@bank.com', type: 'Corporate' },
        { id: 'BC-006', name: 'Sarah Miller', email: 'sarah@bank.com', type: 'SME' }
      ]
    };
  }
};

export default provisioningService;
