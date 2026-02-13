export const DASHBOARD_MOCK_DATA = {
  traffic: {
    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    series: [
      { name: 'Success', data: [850, 940, 1100, 1200, 1150, 1080, 950] },
      { name: 'Error', data: [50, 45, 60, 80, 70, 55, 40] },
      { name: 'Total', data: [900, 985, 1160, 1280, 1220, 1135, 990] }
    ],
    stats: {
      success: { value: '8,270' },
      error: { value: '400' },
      total: { value: '8,670' }
    }
  },
  matrix: {
    api: {
      labels: ['Accounts API', 'Payments API', 'Cards API', 'Transfers API', 'Auth API', 'User Info API', 'Notification API', 'Limits API', 'Consent API', 'Metadata API'],
      data: [12500, 11200, 9800, 8500, 7200, 6500, 5000, 4200, 3100, 1500]
    },
    product: {
      labels: ['Retail Banking', 'Corporate Banking', 'Wealth Management', 'SME Lending', 'Insurance'],
      data: [4500, 3200, 2100, 1800, 900]
    },
    tpp: {
      labels: ['FinTech One', 'BudgetApp', 'QuickPay', 'SecureBank', 'EasyInvest'],
      data: [3500, 2800, 2100, 1500, 900]
    },
    aispPisp: {
      labels: ['AISP (Account Info)', 'PISP (Payment Init)'],
      data: [65, 35]
    },
    consent: {
      labels: ['Active', 'Revoked', 'Expired', 'Suspended'],
      data: [850, 120, 230, 45]
    }
  }
};
