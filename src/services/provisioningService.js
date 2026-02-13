
// Mock data
const mockTPPs = [
  { id: 1, name: "Acme Fintech", status: "Active", apis: 5, lastProvisioned: "2024-02-10", type: "PISP", region: "UK", openBankingType: "PISP" },
  { id: 2, name: "Global Wealth", status: "Pending", apis: 3, lastProvisioned: "2024-02-12", type: "AISP", region: "EU", openBankingType: "AISP" },
  { id: 3, name: "Secure Pay", status: "Suspended", apis: 8, lastProvisioned: "2024-01-28", type: "CBPII", region: "Global", openBankingType: "Both" },
  { id: 4, name: "Fast Finance", status: "Active", apis: 2, lastProvisioned: "2024-02-05", type: "AISP", region: "UK", openBankingType: "AISP" },
  { id: 5, name: "Budget Buddy", status: "Active", apis: 12, lastProvisioned: "2024-02-11", type: "PISP", region: "US", openBankingType: "PISP" },
];

const mockProducts = [
    { id: 1, name: "Payment Initiation", type: "Payments", sandbox: "Enabled", exposure: "Public", status: "Active" },
    { id: 2, name: "Account Info", type: "Accounts", sandbox: "Disabled", exposure: "Internal", status: "Active" },
];

const mockAPIs = [
    { id: 1, name: "Single Payment", type: "Payment", sandbox: "Enabled", exposure: "Public", status: "Active" },
    { id: 2, name: "Account Balances", type: "Account", sandbox: "Enabled", exposure: "Partner", status: "Beta" },
];

const mockCustomers = [
    { id: 1, name: "TechCorp Ltd", type: "Enterprise", region: "UK", exposure: "Public", status: "Active" },
    { id: 2, name: "StartUp Inc", type: "SME", region: "EU", exposure: "Partner", status: "Pending" },
];

const mockResult = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, 500);
  });
};

const provisioningService = {
  getTPPs: async (page = 1, query = "") => {
    return mockResult({
      items: mockTPPs,
      total: mockTPPs.length
    });
  },
  
  getProducts: async () => {
     return mockResult({
      items: mockProducts,
      total: mockProducts.length
    });
  },

  getAPIs: async () => {
     return mockResult({
      items: mockAPIs,
      total: mockAPIs.length
    });
  },
  
  getCustomers: async () => {
     return mockResult({
      items: mockCustomers,
      total: mockCustomers.length
    });
  }
};

export default provisioningService;
