import { useState } from 'react';
import { DASHBOARD_MOCK_DATA } from '../../services/dashboardMockData';

export const useOpenBankingDashboard = () => {
  const [timeInterval, setTimeInterval] = useState('Hour');

  const handleRefresh = () => {
    // Logic to refresh data
    console.log('Refreshing dashboard data...');
  };

  const handleExport = () => {
    // Logic to export data
    console.log('Exporting dashboard data...');
  };

  return {
    timeInterval,
    setTimeInterval,
    handleRefresh,
    handleExport,
    data: DASHBOARD_MOCK_DATA
  };
};
