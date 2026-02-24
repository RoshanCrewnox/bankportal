import React from 'react';
import { Layers, Server, Package, Users as UsersIcon } from 'lucide-react';
import CircularProgress from '../../../components/common/CircularProgress';
import DataTable from '../../../components/common/DataTable';

/**
 * LaunchPadDashboard - Presentational dashboard view for Asset LaunchPad.
 * Mandatory Rules: Presentational logic only, no business logic, no API calls.
 */
const LaunchPadDashboard = ({ 
  theme, 
  launchpadAssets, 
  setActiveTab, 
  setCurrentPage, 
  setSearchTerm, 
  setVisitedTabs 
}) => {
  const isDark = theme === "dark";

  // State derived from props
  const totalApis = launchpadAssets?.total_apis || 0;
  const totalProducts = (launchpadAssets?.total_products || 0) + (launchpadAssets?.total_sandbox_products || 0);
  const totalTpp = launchpadAssets?.total_tpp || 0;
  const totalCustomers = launchpadAssets?.total_customers || 0;
  const totalAssetsValue = totalApis + totalProducts + totalTpp + totalCustomers;

  const stats = [
    { label: "Total Assets", value: totalAssetsValue, icon: Layers, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
    { label: "Total APIs", value: totalApis, icon: Server, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Total Products", value: totalProducts, icon: Package, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { label: "Total TPP", value: totalTpp, icon: UsersIcon, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Total Customers", value: totalCustomers, icon: UsersIcon, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-900/30" },
  ];

  const headers = [
    { label: "Asset Type", key: "type" },
    { label: "SAVED", key: "saved" },
    { label: "PENDING LAUNCH", key: "pending_launch" },
    { label: "LAUNCHED", key: "launched" },
    { label: "ATTACHED", key: "attached" },
    { label: "SUBSCRIBED", key: "subscribed" },
  ];

  const tableData = [
    { id: "apis", type: "APIs", total: totalApis, stats: launchpadAssets?.api_stats },
    { id: "products", type: "Products", total: totalProducts, stats: launchpadAssets?.product_stats },
    { id: "tpp", type: "TPP", total: totalTpp, stats: launchpadAssets?.tpp_stats },
    { id: "customer", type: "Customer", total: totalCustomers, stats: launchpadAssets?.customer_stats },
  ];

  const handleRowClick = (id) => {
    setActiveTab(id);
    setVisitedTabs(prev => prev.includes(id) ? prev : [...prev, id]);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const renderRow = (row) => (
    <>
      <td 
        className={`px-6 py-4 font-bold cursor-pointer ${isDark ? "text-white" : "text-gray-900"}`}
        onClick={() => handleRowClick(row.id)}
      >
        {row.type}
      </td>
      <td className="px-6 py-4 overflow-visible">
        <div className="flex justify-center">
          <CircularProgress value={row.stats?.saved || 0} total={row.total} color="#3b82f6" />
        </div>
      </td>
      <td className="px-6 py-4 overflow-visible">
        <div className="flex justify-center">
          <CircularProgress value={row.stats?.pending_launch || 0} total={row.total} color="#f59e0b" />
        </div>
      </td>
      <td className="px-6 py-4 overflow-visible">
        <div className="flex justify-center">
          <CircularProgress value={row.stats?.launched || 0} total={row.total} color="#10b981" />
        </div>
      </td>
      <td className="px-6 py-4 overflow-visible">
        <div className="flex justify-center">
          <CircularProgress value={row.stats?.attached || 0} total={row.total} color="#6366f1" />
        </div>
      </td>
      <td className="px-6 py-4 overflow-visible">
        <div className="flex justify-center">
          <CircularProgress value={row.stats?.subscribed || 0} total={row.total} color="#14b8a6" />
        </div>
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-xl shadow-sm flex items-center justify-between border ${isDark ? "bg-secondary-dark-bg border-white/5" : "bg-white border-gray-100"}`}>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon size={22} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Overview Table */}
      <DataTable
        headers={headers}
        data={tableData}
        renderRow={renderRow}
        tableClassName="w-full text-sm"
      />
    </div>
  );
};

export default LaunchPadDashboard;
