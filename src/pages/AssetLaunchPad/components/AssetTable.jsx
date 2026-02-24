import React from "react";
import { Edit, Eye, Rocket, Check, X, FileCode } from "lucide-react";
import StatusBadge from "../../../components/common/StatusBadge";
import DataTable from "../../../components/common/DataTable";

/**
 * AssetTable - Standardized table for Asset LaunchPad using common DataTable.
 * Mandatory Rules: Presentational logic only, logic-less component.
 */
const AssetTable = ({ activeTab, paginatedAssets, onEdit, onView, onLaunch }) => {

  const getHeaders = () => {
    switch (activeTab) {
      case 'apis':
        return [
          { label: 'API Name', key: 'name' },
          { label: 'Version', key: 'version' },
          { label: 'Commercial Type', key: 'commercial_type' },
          { label: 'Is Shared', key: 'is_shared_object' },
          { label: 'Is Public', key: 'is_public' },
          { label: 'Header Policy', key: 'header_policy' },
          { label: 'API Type', key: 'api_type' },
          { label: 'Amount', key: 'amount' },
          { label: 'Status', key: 'status' },
          { label: 'Updated By', key: 'updatedBy' },
          { label: 'Actions', key: 'actions' }
        ];
      case 'products':
        return [
          { label: 'Name', key: 'name' },
          { label: 'Category', key: 'category' },
          { label: 'Commercial Type', key: 'commercial_type' },
          { label: 'Is Shared', key: 'is_shared_object' },
          { label: 'Visibility', key: 'visibility' },
          { label: 'Status', key: 'status' },
          { label: 'Subscription Count', key: 'subscriptionCount' },
          { label: 'Updated By', key: 'updatedBy' },
          { label: 'Actions', key: 'actions' }
        ];
      case 'smartMeters':
      case 'sandboxSmartMeters':
        return [
          { label: 'Meter Name', key: 'name' },
          { label: 'SM Type', key: 'sm_type' },
          { label: 'Is Shared', key: 'is_shared_object' },
          { label: 'Meter Type', key: 'meter_type' },
          { label: 'Commercial Type', key: 'commercial_type' },
          { label: 'Est. Cost', key: 'estimated_cost' },
          { label: 'Actual Cost', key: 'actual_cost' },
          { label: 'Status', key: 'status' },
          { label: 'Updated By', key: 'updatedBy' },
          { label: 'Actions', key: 'actions' }
        ];
      default:
        return [
          { label: 'Asset Name', key: 'name' },
          { label: 'Status', key: 'status' },
          { label: 'Updated By', key: 'updatedBy' },
          { label: 'Actions', key: 'actions' }
        ];
    }
  };

  const renderRow = (asset) => {
    const status = asset.status || asset.api_status || asset.product_status || asset.meter_status || '';
    const isLaunchDisabled = status.toString().toUpperCase() !== 'PENDING_LAUNCH';

    return (
      <>
        {/* Common first column: Name */}
        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
          <div className="flex flex-col gap-0.5">
            <span>{asset.name}</span>
            {asset.subOrgs?.length > 0 && (
              <span className="text-blue-500 text-[10px] font-bold">Shared with {asset.subOrgs.length} org(s)</span>
            )}
          </div>
        </td>

        {/* Tab specific columns */}
        {activeTab === 'apis' && (
          <>
            <td className="px-6 py-4 text-xs dark:text-gray-400 font-mono italic">{asset.version || '-'}</td>
            <td className="px-6 py-4"><StatusBadge status={asset.commercial_type === 'ELITE' ? 'Elite' : (asset.commercial_type || 'Free')} /></td>
            <td className="px-6 py-4">{asset.is_shared_object ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}</td>
            <td className="px-6 py-4">{asset.is_public ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}</td>
            <td className="px-6 py-4 text-center">
              {asset.ds_header_config?.length > 0 ? (
                <div className="flex items-center justify-center gap-1 text-blue-500"><FileCode className="w-4 h-4" /><span className="text-[10px] font-bold">{asset.ds_header_config.length}</span></div>
              ) : "-"}
            </td>
            <td className="px-6 py-4 text-xs dark:text-gray-400">{asset.api_type || '-'}</td>
            <td className="px-6 py-4 text-xs font-bold dark:text-gray-300">{asset.amount || '0'}</td>
          </>
        )}

        {activeTab === 'products' && (
          <>
            <td className="px-6 py-4 text-xs dark:text-gray-400">{asset.category || '-'}</td>
            <td className="px-6 py-4"><StatusBadge status={asset.commercial_type === 'ELITE' ? 'Elite' : (asset.commercial_type || 'Free')} /></td>
            <td className="px-6 py-4">{asset.is_shared_object ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}</td>
            <td className="px-6 py-4"><StatusBadge status={asset.visibility} /></td>
          </>
        )}

        {(activeTab === 'smartMeters' || activeTab === 'sandboxSmartMeters') && (
          <>
            <td className="px-6 py-4 text-xs dark:text-gray-400">{asset.sm_type || "Standard"}</td>
            <td className="px-6 py-4">{asset.is_shared_object ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}</td>
            <td className="px-6 py-4 text-xs font-mono text-green-500 italic">{asset.meter_type || asset.cluster || '-'}</td>
            <td className="px-6 py-4"><StatusBadge status={asset.actual_cost == 0 || asset.meter_amount == 0 ? 'Free' : 'Elite'} /></td>
            <td className="px-6 py-4 text-xs dark:text-gray-400">{asset.estimated_cost || '-'}</td>
            <td className="px-6 py-4 text-xs dark:text-gray-400 font-bold">{asset.actual_cost || '-'}</td>
          </>
        )}

        {/* Status (Shared across all) */}
        <td className="px-6 py-4"><StatusBadge status={status} /></td>

        {/* Tail columns */}
        {activeTab === 'products' && (
          <td className="px-6 py-4 text-xs font-bold dark:text-gray-300 text-center">{asset.subscriptionCount || 0}</td>
        )}

        <td className="px-6 py-4 text-xs dark:text-gray-400">{asset.updatedBy || '-'}</td>

        {/* Actions Column */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => !isLaunchDisabled && onLaunch?.(asset)}
              disabled={isLaunchDisabled}
              className={`transition-all hover:scale-110 ${isLaunchDisabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-orange-600 active:scale-95'}`}
              title={isLaunchDisabled ? "Please use edit option" : "Launch Asset"}
            >
              <Rocket size={18} />
            </button>
            <button onClick={() => onView?.(asset)} className="text-gray-400 hover:text-green-600 transition-all hover:scale-110 active:scale-95" title="View"><Eye size={18} /></button>
            <button onClick={() => onEdit?.(asset)} className="text-gray-400 hover:text-blue-600 transition-all hover:scale-110 active:scale-95" title="Edit"><Edit size={18} /></button>
          </div>
        </td>
      </>
    );
  };

  return (
    <DataTable
      headers={getHeaders()}
      data={paginatedAssets}
      renderRow={renderRow}
      emptyMessage={`No ${activeTab} found`}
    />
  );
};

export default AssetTable;