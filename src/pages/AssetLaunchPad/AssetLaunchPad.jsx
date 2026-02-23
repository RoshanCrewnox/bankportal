

import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Search,
  Lock,
  Server,
  Package,
  Zap,
  Users,
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  Rocket,
  Link,
  Layers,
} from "lucide-react";
import { ThemeContext } from "../../components/common/ThemeContext";
import Pagination from "../../components/common/Pagination";
import services from "../../services";
import { useSelector } from "react-redux";
import { hasPermissionById } from "../../utils/rbacUtils";
import CustomButton from "./components/CustomButton";
import AssetTable from "./components/AssetTable";
import Drawer from "../../components/common/Drawer";
import NewAlertBox from "../../components/common/NewAlertBox";
import AccessDenied from "../../components/common/AccessDenied";
import EditBudgetForm from "./components/EditBudgetForm";
import EditProductForm from "./components/EditProductForm";
import EditApiForm from "./components/EditApiForm";
import EstimationRules from "./components/EstimationRules";
import ApiFlowdiagram from "./components/ApiFlowdiagram";
import { Calculator } from "lucide-react";

// --- Helper Component: Circular Chart for Table Cells ---
const CircularProgress = ({ value, total, size = 36, color = "#3b82f6" }) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Value inside the circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">
          {value}
        </span>
      </div>
    </div>
  );
};

// --- Component: Lifecycle Flow ---
const LifecycleFlow = ({ theme }) => {
  const [activeTab, setActiveTab] = useState("API");

  // Percentage based coordinates for responsiveness (viewBox is 1000x400)
  // X-coords: 12%, 34%, 56%, 75%, 92%
  // Y-coords: 25%, 75%
  const nodes = [
    { id: "create", name: "Create", icon: CheckCircle, color: "text-green-600", x: 120, y: 100 },
    { id: "pending", name: "Pending\nLaunch", icon: Clock, color: "text-yellow-600", x: 340, y: 100 },
    { id: "launch", name: "Launch", icon: Rocket, color: "text-orange-600", x: 560, y: 100 },
    { id: "attached", name: "Attached", icon: Layers, color: "text-purple-600", x: 740, y: 100 },
    { id: "subscribe", name: "Subscribe", icon: Users, color: "text-pink-600", x: 920, y: 100 },
    { id: "draft", name: "Draft", icon: Activity, color: "text-gray-600", x: 120, y: 300 },
    { id: "reject", name: "Reject", icon: Lock, color: "text-red-600", x: 340, y: 300 },
    { id: "amend", name: "Amend", icon: Link, color: "text-blue-600", x: 560, y: 300 },
  ];

  const R = 30; // Node radius

  return (
    <div
      className={`mt-4 p-6 rounded-3xl border shadow-sm ${theme === "dark" ? "bg-[#1e293b] border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center gap-2 ">
        <div className={`flex p-1 rounded-lg ${theme === "dark" ? "bg-[#0f172a]" : "bg-gray-100"}`}>
          <button
            onClick={() => setActiveTab("API")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md ${activeTab === "API"
              ? "bg-blue-600 text-white shadow-sm"
              : theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            API
          </button>
          <button
            onClick={() => setActiveTab("Product")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md ${activeTab === "Product"
              ? theme === "dark" ? "bg-blue-600 text-white shadow-sm" : "bg-blue-600 text-white shadow-sm border border-blue-200"
              : theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            PRODUCT
          </button>
          <button
            onClick={() => setActiveTab("Meter")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md ${activeTab === "Meter"
              ? theme === "dark" ? "bg-blue-600 text-white shadow-sm" : "bg-blue-600 text-white shadow-sm border border-blue-200"
              : theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            METERS
          </button>
          {/* <button
            onClick={() => setActiveTab("SandboxSmartMeters")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md ${activeTab === "SandboxSmartMeters"
              ? theme === "dark" ? "bg-blue-600 text-white shadow-sm" : "bg-blue-600 text-white shadow-sm border border-blue-200"
              : theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            SANDBOX SMART METERS
          </button>
          <button
            onClick={() => setActiveTab("SandboxProduct")}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md ${activeTab === "SandboxProduct"
              ? theme === "dark" ? "bg-blue-600 text-white shadow-sm" : "bg-blue-600 text-white shadow-sm border border-blue-200"
              : theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}
          >
           SANDBOX PRODUCT
          </button> */}
        </div>
      </div>

      {/* Main Responsive Container with fixed aspect ratio */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1000 / 400' }}>
        <style>
          {`
            @keyframes flow {
              from { stroke-dashoffset: 40; }
              to { stroke-dashoffset: 0; }
            }
            .flow-line {
              stroke-dasharray: 8 12;
              animation: flow 2s linear infinite;
              color: orange;
            }
            .flow-line:hover {
              filter: drop-shadow(0 0 1px rgba(255,255,255,0.1));
             color: orange;
            }
          `}
        </style>
        {/* SVG Layer */}
        <svg
          viewBox="0 0 1000 400"
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
            </marker>
          </defs>

          <g className="flow-line">
            {/* Common Static Paths */}
            {/* Draft (Gray) -> Create */}
            <path d="M 120 270 L 120 137" stroke="#4b5563" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Pending (Yellow) -> Reject */}
            <path d="M 340 130 L 340 263" stroke="#ca8a04" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Reject (Red) -> Draft */}
            <path d="M 307 300 L 157 300" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Launch (Orange) -> Amend */}
            <path d="M 560 130 L 560 263" stroke="#ea580c" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Attached (Purple) -> Subscribe - Hidden in Product mode */}
            {activeTab !== "Product" && (
              <path d="M 770 100 L 883 100" stroke="#9333ea" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            )}

            {/* NEW: Amend (Blue) -> Pending Launch (Return Path) */}
            <path
              d="M 525 300 L 450 300 L 450 200 L 340 200 L 340 137"
              stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowhead)" fill="none"
            />

            {activeTab === "API" ? (
              <>
                {/* Create (Green) -> Pending */}
                <path d="M 152 100 L 305 100" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                {/* Pending (Yellow) -> Launch */}
                <path d="M 372 100 L 525 100" stroke="#ca8a04" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                {/* Launch (Orange) -> Attached */}
                <path d="M 592 100 L 705 100" stroke="#ea580c" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

                {/* Return Path: Mid(L,A) (Orange lead) -> loop back to join Amend's return path */}
                <path
                  d="M 650 100 L 650 200 L 450 200"
                  stroke="#ea580c" strokeWidth="1.5" fill="none"
                />
              </>
            ) : (
              <>
                {/* Pending (Yellow) <- Create (Backwards logic but follows Pending's lead) */}
                <path d="M 308 100 L 157 100" stroke="#ca8a04" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                {/* Mid(P,L) bidirectional (Yellow <-> Orange) */}
                <path d="M 450 100 L 377 100" stroke="#ca8a04" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <path d="M 450 100 L 525 100" stroke="#ea580c" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                {/* Mid(P,L) branch to Amend (Purple/Blue lead) */}
                <path d="M 450 100 L 450 300 L 525 300" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowhead)" fill="none" />
                {/* Launch (Orange) -> Attached Logic */}
                {activeTab === "Product" ? (
                  /* Skips Attached in Product mode */
                  <path d="M 592 100 L 883 100" stroke="#ea580c" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                ) : (
                  /* Standard path for other modes */
                  <path d="M 592 100 L 705 100" stroke="#ea580c" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                )}
              </>
            )}
          </g>
        </svg>

        {/* Nodes Layer */}
        <div className="absolute inset-0 z-10">
          {nodes?.map((node) => {
            const Icon = node.icon;
            const isAttached = node.id === "attached";
            const isProductTab = activeTab === "Product";

            // Hide the Attached node in Product tab
            if (isAttached && isProductTab) return null;

            return (
              <div
                key={node.id}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${(node.x / 1000) * 100}%`,
                  top: `${(node.y / 400) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '10%' // Responsive width basis
                }}
              >
                <div
                  className={`p-3 rounded-full border shadow-sm mb-1 flex items-center justify-center transition-all ${theme === "dark"
                    ? "bg-[#0f172a] border-gray-600"
                    : (isAttached && isProductTab ? "bg-white border-gray-300" : "bg-[#dcfce7] border-[#10b981]")
                    }`}
                  style={{ width: '10vw', height: '10vw', minWidth: '40px', minHeight: '40px', maxWidth: '65px', maxHeight: '65px' }}
                >
                  <Icon className={`${node.color} w-[80%] h-[80%]`} />
                </div>
                <span
                  className={`text-[clamp(8px,1vw,10px)] font-bold text-center  leading-tight ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  {node.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive API Flow Diagram */}

    </div>
  );
};



// --- Component: Launch Pad Dashboard ---
const LaunchPadDashboard = ({ theme, launchpadAssets, activeTab, setActiveTab, setCurrentPage, setSearchTerm, setVisitedTabs }) => {
  // Use API data or fallback to mock data
  const stats = [
    {
      label: "TOTAL APIs",
      value: launchpadAssets?.total_apis || 0,
      icon: Server,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "TOTAL PRODUCTS",
      value:
        (launchpadAssets?.total_products || 0) +
        (launchpadAssets?.total_sandbox_products || 0),
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "TOTAL METERS",
      value:
        (launchpadAssets?.total_smart_meters || 0) +
        (launchpadAssets?.total_sandbox_smart_meters || 0),
      icon: Zap,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "SANDBOX SMART METERS",
      value:
        (launchpadAssets?.total_sandbox_smart_meters || 0),
      icon: Zap,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "SANDBOX PRODUCTS",
      value:
        (launchpadAssets?.total_sandbox_products || 0),
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    // {
    //   label: "ACTIVE SUBSCRIPTIONS",
    //   value: "1,402",
    //   icon: Users,
    //   color: "text-green-500",
    //   bg: "bg-green-100 dark:bg-green-900/30",
    // },
  ];

  const tableData = [
    {
      id: "apis",
      type: "APIs",
      total: launchpadAssets?.total_apis || 0,
      saved: launchpadAssets?.api_stats?.saved || 0,
      pendingLaunch: launchpadAssets?.api_stats?.pending_launch || 0,
      launched: launchpadAssets?.api_stats?.launched || 0,
      attached: launchpadAssets?.api_stats?.attached || 0,
      subscribed: launchpadAssets?.api_stats?.subscribed || 0,
    },
    {
      id: "products",
      type: "Products",
      total: launchpadAssets?.total_products || 0,
      saved: launchpadAssets?.product_stats?.saved || 0,
      pendingLaunch: launchpadAssets?.product_stats?.pending_launch || 0,
      launched: launchpadAssets?.product_stats?.launched || 0,
      attached: launchpadAssets?.product_stats?.attached || 0,
      subscribed: launchpadAssets?.product_stats?.subscribed || 0,
    },
    {
      id: "smartMeters",
      type: "Smart Meters",
      total: launchpadAssets?.total_smart_meters || 0,
      saved: launchpadAssets?.smart_meter_stats?.saved || 0,
      pendingLaunch: launchpadAssets?.smart_meter_stats?.pending_launch || 0,
      launched: launchpadAssets?.smart_meter_stats?.launched || 0,
      attached: launchpadAssets?.smart_meter_stats?.attached || 0,
      subscribed: launchpadAssets?.smart_meter_stats?.subscribed || 0,
    },
    {
      id: "sandboxSmartMeters",
      type: "Sandbox Smart Meters",
      total: launchpadAssets?.total_sandbox_smart_meters || 0,
      saved: launchpadAssets?.sandbox_smart_meter_stats?.saved || 0,
      pendingLaunch:
        launchpadAssets?.sandbox_smart_meter_stats?.pending_launch || 0,
      launched: launchpadAssets?.sandbox_smart_meter_stats?.launched || 0,
      attached: launchpadAssets?.sandbox_smart_meter_stats?.attached || 0,
      subscribed: launchpadAssets?.sandbox_smart_meter_stats?.subscribed || 0,
    },
    {
      id: "sandboxProducts",
      type: "Sandbox Products",
      total: launchpadAssets?.total_sandbox_products || 0,
      saved: launchpadAssets?.sandbox_product_stats?.saved || 0,
      pendingLaunch:
        launchpadAssets?.sandbox_product_stats?.pending_launch || 0,
      launched: launchpadAssets?.sandbox_product_stats?.launched || 0,
      attached: launchpadAssets?.sandbox_product_stats?.attached || 0,
      subscribed: launchpadAssets?.sandbox_product_stats?.subscribed || 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats?.map((stat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg shadow-sm flex items-center justify-between ${theme === "dark" ? "bg-darkbg" : "bg-white"}`}
          >
            <div>
              <p
                className={`text-xs font-medium uppercase ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                {stat.label}
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Table with Circular Charts */}
      <div
        className={`rounded-lg shadow-sm border overflow-hidden ${theme === "dark" ? "bg-darkbg border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className={`border-b ${theme === "dark" ? "border-gray-700 bg-slate-700" : "border-gray-200 bg-gray-50"}`}
              >
                <th
                  className={`p-4 font-semibold text-start ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Asset Type
                </th>
                <th
                  className={`p-4 font-semibold text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  SAVED
                </th>
                <th
                  className={`p-4 font-semibold text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  PENDING LAUNCH
                </th>
                <th
                  className={`p-4 font-semibold text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  LAUNCHED
                </th>
                <th
                  className={`p-4 font-semibold text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  ATTACHED
                </th>
                <th
                  className={`p-4 font-semibold text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  SUBSCRIBED
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {tableData?.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${theme === "dark" ? "hover:bg-dark-input" : "hover:bg-gray-50"}`}
                  onClick={() => {
                    setActiveTab(row?.id)
                    setVisitedTabs(prev => prev.includes(row?.id) ? prev : [...prev, row?.id])
                    setCurrentPage(1)
                    setSearchTerm('')
                  }}
                >
                  <td
                    className={`p-4 font-medium text-start ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {row.type}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <CircularProgress
                        value={row?.saved}
                        total={row.total}
                        color="#2563EB"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <CircularProgress
                        value={row.pendingLaunch}
                        total={row.total}
                        color="#f59e0b"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <CircularProgress
                        value={row?.launched}
                        total={row.total}
                        color="#16A34A"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <CircularProgress
                        value={row.attached}
                        total={row.total}
                        color="#F59E0B"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <CircularProgress
                        value={row.subscribed}
                        total={row.total}
                        color="#134E4A"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards displaying table data below the table - 2x2 Layout with compact internal 2x2 grid */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {tableData?.map((row, rowIdx) => (
                    <div key={rowIdx} className={`p-5 rounded-xl shadow-sm border ${theme === 'dark' ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-gray-200'}`}>
             
                        <div className={`flex items-center justify-between mb-4 pb-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {row.type}
                            </h4>
                            <div className={`flex items-center gap-3 px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-pink-900/20 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>
                                <Users size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Subscribed:</span>
                                <span className="text-lg font-bold">{row.subscribed}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                            <div className="flex items-center justify-between group">
                                <div className="flex-1">
                                    <p className={`text-[12px] font-bold uppercase tracking-tight mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        SAVED
                                    </p>
                                </div>
                                <CircularProgress value={row.saved} total={row.total} size={36} color="#3b82f6" />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex-1">
                                    <p className={`text-[12px] font-bold uppercase tracking-tight mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        PENDING LAUNCH
                                    </p>
                                </div>
                                <CircularProgress value={row.pendingLaunch} total={row.total} size={36} color="#f59e0b" />
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex-1">
                                    <p className={`text-[12px] font-bold uppercase tracking-tight mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        LAUNCHED
                                    </p>
                                </div>
                                <CircularProgress value={row.launched} total={row.total} size={36} color="#10b981" />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex-1">
                                    <p className={`text-[12px] font-bold uppercase tracking-tight mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        ATTACHED
                                    </p>
                                </div>
                                <CircularProgress value={row?.attached} total={row?.total} size={36} color="#6366f1" />
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}

      {/* Bottom Lifecycle Flow */}

      <ApiFlowdiagram theme={theme} activeTab={activeTab} />
    </div>
  );
};

export default function AssetLaunchPad() {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("launchpad"); // Default to launchpad immediately
  const [visitedTabs, setVisitedTabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;
  const roleData = useSelector((state) => state.role.roleData);
  const [screens, setScreens] = useState([]);

  const prevSearchTermRef = useRef(searchTerm);

  useEffect(() => {
    if (roleData) {
      // Added "Launch Pad" at the start. Set permissionId to null to always allow access.
      const subModules = [
        { name: "Launch Pad", id: "launchpad", permissionId: null },
        { name: "API", id: "apis", permissionId: "CX-015-001" },
        { name: "Product", id: "products", permissionId: "CX-015-002" },
        { name: "Smart Meter", id: "smartMeters", permissionId: "CX-015-003" },
        {
          name: "Sandbox Smart Meter",
          id: "sandboxSmartMeters",
          permissionId: "CX-015-004",
        },
        {
          name: "Sandbox Product",
          id: "sandboxProducts",
          permissionId: "CX-015-005",
        },
      ];

      const mappedScreens = subModules.map((sub) => {
        // Check permission. If permissionId is null, allow everyone.
        const isDisabled = sub.permissionId
          ? !hasPermissionById(roleData, sub.permissionId)
          : false;

        return {
          id: sub.id,
          name:
            sub.name === "Sandbox Smart Meter"
              ? "Sandbox Smart Meters"
              : sub.name === "Smart Meter"
                ? "Smart Meters"
                : sub.name === "Launch Pad"
                  ? "Launch Pad"
                  : sub.name + "s",
          disabled: isDisabled,
          component: null,
        };
      });

      setScreens(mappedScreens);

      // If no active tab is set, set it to launchpad
      if (!activeTab) {
        setActiveTab("launchpad");
      }
    }
  }, [roleData, activeTab]); // Keep activeTab in dependencies to update if it changes manually

  const canEditEstimationRules =
    hasPermissionById(roleData, "CX-015-005") &&
    hasPermissionById(roleData, "CX-015-005-002");
  const canViewEstimationRules =
    hasPermissionById(roleData, "CX-015-005") &&
    hasPermissionById(roleData, "CX-015-005-001");

  const [assets, setAssets] = useState({
    apis: [],
    products: [],
    smartMeters: [],
    sandboxSmartMeters: [],
    sandBoxProducts: [],
  });

  // State for launchpad assets data
  const [launchpadAssets, setLaunchpadAssets] = useState({
    total_apis: 0,
    total_products: 0,
    total_smart_meters: 0,
    total_sandbox_smart_meters: 0,
    total_sandbox_products: 0,
    pending_apis: 0,
    pending_products: 0,
    pending_smart_meters: 0,
    pending_sandbox_smart_meters: 0,
    pending_sandbox_products: 0,
    api_stats: {},
    product_stats: {},
    smart_meter_stats: {},
    sandbox_smart_meter_stats: {},
    sandbox_product_stats: {},
  });

  const fetchAssets = useCallback(
    async (page = 1, query = "") => {
      // Do not fetch if on launchpad tab
      if (!activeTab || activeTab === "launchpad") return;

      let response;
      try {
        setAssets((prev) => ({ ...prev, [activeTab]: [] }));
        setTotalRecords(0);

        switch (activeTab) {
          case "apis":
            response = await services.assetLaunchPad.FETCH_API_LIST(
              page,
              query,
            );
            if (response.data && Array.isArray(response.data.apis)) {
              const mappedApis = response.data.apis.map((api) => ({
                id: api.api_uuid,
                api_uuid: api.api_uuid,
                name: api.api_name,
                api_name: api.api_name,
                status: api.api_status,
                lastUpdated: api.updated_at,
                subOrgs: [],
                version: api.api_version,
                commercial_type: api.commercial_type,
                is_public: api.is_public_apis,
                api_status: api.api_status,
                is_shared_object: api.is_shared_object || false,
                cross_shared_object: api.cross_shared_object || false,
                description: api.api_description,
                api_description: api.api_description,
                updatedBy: api.updated_by,
                createdBy: api.created_by,
                createdAt: api.created_at,
                updatedAt: api.updated_at,
                api_type: api.api_type,
                api_category_uuid: api.api_category_uuid,
                amount: api.api_amount || 0,
                min_amount: api.min_amount || 0,
                max_amount: api.max_amount || 100,
                api_category_type: api.api_category_type,
                api_visibility: api.is_public_apis,
                api_category: api.api_type || "N/A",
                upstream_uri: api.upstream_uri,
                downstream_uri: api.downstream_uri,
                downstream_domain_uuid: api.downstream_domain_uuid,
                sandbox_domain_uuid: api.sandbox_domain_uuid,
                api_key_location: api.api_key_location,
                api_key_name: api.api_key_name,
                ds_header_config: api.ds_header_config || [],
                methods: api.methods || [],
                mock_config: api.mock_config || {},
                pl_method_count: api.pl_method_count || 0,
                organisation_name: api.organisation_name,
                sub_org_name: api.sub_org_name,
              }));
              setAssets((prev) => ({ ...prev, apis: mappedApis }));
              setTotalRecords(response.data.TOTAL_RECORDS || 0);
            }
            break;
          case "products":
            response = await services.assetLaunchPad.FETCH_PRODUCTS_LIST(
              page,
              query,
            );
            if (response.data && Array.isArray(response.data.products)) {
              const mappedProducts = response.data.products.map((product) => ({
                id: product.product_uuid,
                product_uuid: product.product_uuid,
                name: product.product_name,
                status: product.status,
                lastUpdated: product.updated_at,
                updatedBy: product.updated_by,
                category: product.category || "-",
                visibility: product.is_public_products ? "Public" : "Private",
                subscriptionCount: product.subscription_count || 0,
                subOrgs: [],
                is_public: product.is_public_products,
                commercial_type: product.commercial_type,
                sandbox_enabled: product.sandbox_enabled,
                product_status: product.status,
                is_shared_object: product.is_shared_object,
                cross_shared_object: product.cross_shared_object,
                work_flow_attached: product.work_flow_attached,
                apis_count: product.apis_count || 0,
                live_sm_count: product.live_sm_count || 0,
                sb_sm_count: product.sb_sm_count || 0,
              }));
              setAssets((prev) => ({ ...prev, products: mappedProducts }));
              setTotalRecords(response.data.TOTAL_RECORDS || 0);
            }
            break;
          case "smartMeters":
            response = await services.assetLaunchPad.FETCH_SMARTMETER_LIST(
              page,
              query,
            );
            if (response.data && Array.isArray(response.data.smart_meters)) {
              const mappedMeters = response.data.smart_meters.map((meter) => ({
                id: meter.meter_uuid,
                meter_uuid: meter.meter_uuid,
                name: meter.meter_name,
                status: meter.meter_status,
                lastUpdated: meter.updated_at,
                updatedBy: meter.updated_by,
                cluster: meter.cluster,
                tier: meter.tier,
                description: meter.meter_desc,
                subOrgs: [],
                meter_type: meter.meter_type,
                meter_status: meter.meter_status,
                is_shared_object: meter.is_shared_object,
                cross_shared_object: meter.cross_shared_object,
                quota: meter.allowed_quota,
                throttle: meter.throttle_limit,
                estimated_cost: meter.estimated_meter_amount,
                actual_cost: meter.meter_amount,
                is_custom_meter: meter.is_custom_meter,
                elite_api_cost_factor: meter.elite_api_cost_factor,
                quota_duration: meter.quota_duration,
              }));
              setAssets((prev) => ({ ...prev, smartMeters: mappedMeters }));
              setTotalRecords(response.data.TOTAL_RECORDS || 0);
            }
            break;
          case "sandboxSmartMeters":
            response = await services.assetLaunchPad.FETCH_SB_SMARTMETER_LIST(
              page,
              query,
            );
            if (response.data && Array.isArray(response.data.smart_meters)) {
              const mappedSandboxMeters = response.data.smart_meters.map(
                (meter) => ({
                  id: meter.meter_uuid,
                  meter_uuid: meter.meter_uuid,
                  name: meter.meter_name,
                  status: meter.meter_status,
                  lastUpdated: meter.updated_at,
                  updatedBy: meter.updated_by,
                  cluster: meter.cluster,
                  tier: meter.tier,
                  description: meter.meter_desc,
                  subOrgs: [],
                  meter_type: meter.meter_type,
                  meter_status: meter.meter_status,
                  is_shared_object: meter.is_shared_object,
                  cross_shared_object: meter.cross_shared_object,
                  quota: meter.allowed_quota,
                  throttle: meter.throttle_limit,
                  estimated_cost: meter.estimated_meter_amount,
                  actual_cost: meter.meter_amount,
                  is_custom_meter: meter.is_custom_meter,
                  elite_api_cost_factor: meter.elite_api_cost_factor,
                  quota_duration: meter.quota_duration,
                }),
              );
              setAssets((prev) => ({
                ...prev,
                sandboxSmartMeters: mappedSandboxMeters,
              }));
              setTotalRecords(response.data.TOTAL_RECORDS || 0);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} assets:`, error);
        setAssets((prev) => ({ ...prev, [activeTab]: [] }));
        setTotalRecords(0);
      }
    },
    [activeTab],
  );

  // Fetch launchpad assets data
  const fetchLaunchpadAssets = useCallback(async () => {
    if (activeTab !== "launchpad") return;

    try {
      const response = await services.assetLaunchPad.FETCH_ASSETS();
      if (response.data) {
        const apiData = response.data;

        // Process launchpad_assets array to create stats by status
        const launchpadStats = {};
        if (Array.isArray(apiData.launchpad_assets)) {
          apiData.launchpad_assets.forEach((item) => {
            const key = `${item.asset_type}_${item.status}`.toLowerCase();
            launchpadStats[key] = item.total_count;
          });
        }

        setLaunchpadAssets({
          total_apis: apiData.totals?.api_count || 0,
          total_products: apiData.totals?.product_count || 0,
          total_smart_meters: apiData.totals?.live_meter_count || 0,
          total_sandbox_smart_meters: apiData.totals?.sb_meter_count || 0,
          total_sandbox_products: apiData.totals?.sb_product_count || 0,
          pending_apis: apiData.total_pending?.api_count || 0,
          pending_products: apiData.total_pending?.product_count || 0,
          pending_smart_meters: apiData.total_pending?.live_meter_count || 0,
          pending_sandbox_smart_meters: apiData.total_pending?.sb_meter_count || 0,
          pending_sandbox_products: apiData.total_pending?.sb_product_count || 0,
          api_stats: {
            launched: launchpadStats["api_launched"] || 0,
            saved: launchpadStats["api_saved"] || 0,
            pending_launch: launchpadStats["api_pending_launch"] || 0,
            attached: launchpadStats["api_attached"] || 0,
            subscribed: launchpadStats["api_subscribed"] || 0,
          },
          product_stats: {
            launched: launchpadStats["product_launched"] || 0,
            saved: launchpadStats["product_saved"] || 0,
            pending_launch: launchpadStats["product_pending_launch"] || 0,
            attached: launchpadStats["product_attached"] || 0,
            subscribed: launchpadStats["product_subscribed"] || 0,
          },
          smart_meter_stats: {
            launched: launchpadStats["live_meter_launched"] || 0,
            saved: launchpadStats["live_meter_saved"] || 0,
            pending_launch: launchpadStats["live_meter_pending_launch"] || 0,
            attached: launchpadStats["live_meter_attached"] || 0,
            subscribed: launchpadStats["live_meter_subscribed"] || 0,
          },
          sandbox_smart_meter_stats: {
            launched: launchpadStats["sb_meter_launched"] || 0,
            saved: launchpadStats["sb_meter_saved"] || 0,
            pending_launch: launchpadStats["sb_meter_pending_launch"] || 0,
            attached: launchpadStats["sb_meter_attached"] || 0,
            subscribed: launchpadStats["sb_meter_subscribed"] || 0,
          },
          sandbox_product_stats: {
            launched: launchpadStats["sb_product_launched"] || 0,
            saved: launchpadStats["sb_product_saved"] || 0,
            pending_launch: launchpadStats["sb_product_pending_launch"] || 0,
            attached: launchpadStats["sb_product_attached"] || 0,
            subscribed: launchpadStats["sb_product_subscribed"] || 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching launchpad assets:", error);
    }
  }, [activeTab]);

  useEffect(() => {
    const searchTermChanged = prevSearchTermRef.current !== searchTerm;
    if (searchTermChanged) {
      prevSearchTermRef.current = searchTerm;
      setCurrentPage(1);
    }

    const timeoutId = setTimeout(
      () => {
        const pageToUse = searchTermChanged ? 1 : currentPage;
        if (activeTab === "launchpad") {
          fetchLaunchpadAssets();
        } else {
          fetchAssets(pageToUse, searchTerm || "");
        }
      },
      searchTermChanged ? 500 : 0,
    );

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, fetchAssets, fetchLaunchpadAssets, activeTab]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [isEstimationDrawerOpen, setIsEstimationDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    type: "confirm",
    message: "",
    title: "",
    onConfirm: () => { },
    onCancel: () => { },
    confirmText: "Ok",
    cancelText: "Cancel",
    showCancelButton: false,
  });

  const handleSaveApi = (updatedApi) => {
    const payload = {
      api_uuid: updatedApi.api_uuid,
      api_name: updatedApi.api_name,
      api_amount: Number(updatedApi.amount),
      commercial_type: updatedApi.commercial_type,
      is_public_apis: updatedApi.api_visibility,
    };

    services.assetLaunchPad
      .LAUNCH_API(payload)
      .then((response) => {
        setAlert({
          showAlert: true,
          type: "success",
          title: "Success",
          message: "API launched successfully.",
          onConfirm: () => {
            setIsDrawerOpen(false);
            setAlert({ ...alert, showAlert: false });
            fetchAssets(currentPage, searchTerm);
          },
        });
      })
      .catch((error) => {
        console.error("Failed to launch API:", error);
        setAlert({
          showAlert: true,
          type: "error",
          title: "Error",
          message:
            error?.response?.data?.error_description ||
            "Failed to launch API. Please try again.",
          onConfirm: () => setAlert({ ...alert, showAlert: false }),
        });
      });
  };

  const handleApiAssetDrawer = (asset, viewMode) => {
    setIsDrawerOpen(true);
    setSelectedAsset(null);
    setIsDrawerLoading(true);
    setIsViewMode(viewMode);

    services.assetLaunchPad
      .FETCH_API_DETAIL(asset.id)
      .then((response) => {
        const api = response.data;
        const mappedAsset = {
          ...api,
          id: api.api_uuid,
          api_uuid: api.api_uuid,
          name: api.api_name,
          api_name: api.api_name,
          api_visibility: api.is_public_apis,
          api_category: api.api_type,
          api_description: api.api_description,
          api_status: api.api_status,
          api_version: api.api_version,
          commercial_type: api.commercial_type,
          amount: api.api_amount || 0,
          min_amount: api.min_amount || 0,
          max_amount: api.max_amount || 100,
          upstream_uri: api.upstream_uri,
          downstream_uri: api.downstream_uri,
          downstream_domain_uuid: api.downstream_domain_uuid,
          sandbox_domain_uuid: api.sandbox_domain_uuid,
          api_key_location: api.api_key_location,
          api_key_name: api.api_key_name,
          ds_header_config: api.ds_header_config || [],
          methods: api.methods || [],
          mock_config: api.mock_config || {},
          is_public_apis: api.is_public_apis,
          is_shared_object: api.is_shared_object || false,
          cross_shared_object: api.cross_shared_object || false,
          pl_method_count: api.pl_method_count || 0,
          created_by: api.created_by,
          created_at: api.created_at,
          updated_by: api.updated_by,
          updated_at: api.updated_at,
          organisation_name: api.organisation_name,
          sub_org_name: api.sub_org_name,
          api_category_uuid: api.api_category_uuid,
        };
        setSelectedAsset(mappedAsset);
      })
      .catch((error) => {
        console.error("Failed to fetch API details:", error);
        setIsDrawerOpen(false);
        setAlert({
          showAlert: true,
          type: "error",
          title: "Error",
          message:
            error?.response?.data?.error_description ||
            "Failed to load API details. Please try again.",
          onConfirm: () => setAlert({ ...alert, showAlert: false }),
        });
      })
      .finally(() => {
        setIsDrawerLoading(false);
      });
  };

  const handleEditAsset = (asset) => {
    if (activeTab === "apis") {
      handleApiAssetDrawer(asset, false);
    } else if (
      activeTab === "smartMeters" ||
      activeTab === "sandboxSmartMeters" ||
      activeTab === "products" ||
      activeTab === "sandboxProducts"
    ) {
      setSelectedAsset(asset);
      setIsViewMode(false);
      setIsDrawerOpen(true);
    } else {
      console.log("Edit not implemented for this type");
    }
  };

  const handleViewAsset = (asset) => {
    if (activeTab === "apis") {
      handleApiAssetDrawer(asset, true);
    } else if (
      activeTab === "smartMeters" ||
      activeTab === "sandboxSmartMeters" ||
      activeTab === "products" ||
      activeTab === "sandboxProducts"
    ) {
      setSelectedAsset(asset);
      setIsViewMode(true);
      setIsDrawerOpen(true);
    } else {
      console.log("View not implemented for this type");
    }
  };

  const handleLaunchAsset = (asset) => {
    if (activeTab === "apis") {
      const payload = {
        api_uuid: asset.api_uuid,
        api_name: asset.api_name,
        api_amount: Number(asset.amount || 0),
        commercial_type: asset.commercial_type,
        is_public_apis: asset.api_visibility,
      };

      services.assetLaunchPad
        .LAUNCH_API(payload)
        .then((response) => {
          setAlert({
            showAlert: true,
            type: "success",
            title: "Success",
            message: "API launched successfully.",
            onConfirm: () => {
              setAlert({ ...alert, showAlert: false });
              fetchAssets(currentPage, searchTerm);
            },
          });
        })
        .catch((error) => {
          console.error("Failed to launch API:", error);
          setAlert({
            showAlert: true,
            type: "error",
            title: "Error",
            message:
              error?.response?.data?.error_description ||
              "Failed to launch API. Please try again.",
            onConfirm: () => setAlert({ ...alert, showAlert: false }),
          });
        });
    } else if (
      activeTab === "smartMeters" ||
      activeTab === "sandboxSmartMeters"
    ) {
      const payload = {
        meter_uuid: asset.meter_uuid || asset.id,
        meter_name: asset.name,
        meter_amount: Number(asset.actual_cost || 0),
      };

      const launchService =
        activeTab === "sandboxSmartMeters"
          ? services.assetLaunchPad.LAUNCH_SB_SMARTMETER
          : services.assetLaunchPad.LAUNCH_SMARTMETER;

      launchService(payload)
        .then((res) => {
          setAlert({
            showAlert: true,
            type: "success",
            title: "Success",
            message: "Smart Meter launched successfully.",
            showCancelButton: false,
            onConfirm: () => {
              setAlert({ ...alert, showAlert: false });
              fetchAssets(currentPage, searchTerm);
            },
          });
        })
        .catch((err) => {
          setAlert({
            showAlert: true,
            type: "error",
            title: "Error Launching Smart Meter",
            message:
              err?.response?.data?.error_description || "Something went wrong!",
            onConfirm: () => setAlert({ ...alert, showAlert: false }),
            showCancelButton: false,
          });
        });
    } else if (activeTab === "products") {
      // Preserve current visibility setting
      const originalVisibility = asset.is_public;

      const payload = {
        product_uuid: asset.product_uuid || asset.id,
        product_name: asset.name,
      };

      services.assetLaunchPad
        .LAUNCH_PRODUCT(payload)
        .then((response) => {
          setAlert({
            showAlert: true,
            type: "success",
            title: "Success",
            message: "Product launched successfully.",
            onConfirm: () => {
              setAlert({ ...alert, showAlert: false });
              fetchAssets(currentPage, searchTerm);
            },
          });
        })
        .catch((error) => {
          console.error("Failed to launch product:", error);
          setAlert({
            showAlert: true,
            type: "error",
            title: "Error",
            message:
              error?.response?.data?.error_description ||
              "Failed to launch product. Please try again.",
            onConfirm: () => setAlert({ ...alert, showAlert: false }),
          });
        });
    }
  };

  const handleSaveBudget = (updatedBudget) => {
    const payload = {
      meter_uuid: updatedBudget.meter_uuid || updatedBudget.id,
      meter_name: updatedBudget.name,
      meter_amount: Number(updatedBudget.actual_cost),
    };

    const launchService =
      activeTab === "sandboxSmartMeters"
        ? services.assetLaunchPad.LAUNCH_SB_SMARTMETER
        : services.assetLaunchPad.LAUNCH_SMARTMETER;

    launchService(payload)
      .then((res) => {
        setIsDrawerOpen(false);
        setAlert({
          showAlert: true,
          type: "success",
          title: "Success",
          message: "Smart Meter launched successfully.",
          showCancelButton: false,
          onConfirm: () => {
            setAlert({ ...alert, showAlert: false });
            fetchAssets(currentPage, searchTerm);
          },
        });
      })
      .catch((err) => {
        setAlert({
          showAlert: true,
          type: "error",
          title: "Error Launching Smart Meter",
          message:
            err?.response?.data?.error_description || "Something went wrong!",
          onConfirm: () => setAlert({ ...alert, showAlert: false }),
          showCancelButton: false,
        });
      });
  };

  const currentAssets = assets[activeTab] || [];
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const paginatedAssets = currentAssets;

  const getAssetColumnName = () => {
    switch (activeTab) {
      case "apis":
        return "API Name";
      case "products":
        return "Product Name";
      case "smartMeters":
        return "Smart Meter Name";
      case "sandboxSmartMeters":
        return "Sandbox Smart Meter Name";
      case "sandboxProducts":
        return "Sandbox Product Name";
      default:
        return "Asset Name";
    }
  };

  const canViewAnyTab = screens.some((s) => !s.disabled);
  const canViewAnyPage = canViewAnyTab || canViewEstimationRules;

  if (!canViewAnyPage && screens.length > 0) {
    return (
      <div className="min-h-screen p-6">
        <AccessDenied message="You don't have permission to view the Asset Launch Pad." />
      </div>
    );
  }
  console.log(paginatedAssets, "paginatedAssets", launchpadAssets);

  return (
    <div className="min-h-screen p-6 text-left">
      <NewAlertBox
        showAlert={alert.showAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        showCancelButton={alert.showCancelButton}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
      />
      <h2 className="text-xl font-semibold text-left pb-2 text-gray-800 dark:text-white">
        Asset Launch Pad
      </h2>

      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 mb-6 pr-2">
        <div className="flex items-center space-x-1 py-4 p-2 gap-2 overflow-x-auto">
          {screens?.map((screen) => (
            <CustomButton
              key={screen.id}
              variant={activeTab === screen?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setActiveTab(screen?.id);
                if (screen?.id === "launchpad") {
                  setVisitedTabs([]); // Reset visited state when returning to launchpad
                } else {
                  setVisitedTabs(prev => prev.includes(screen?.id) ? prev : [...prev, screen?.id]);
                }
                setCurrentPage(1);
                setSearchTerm("");
              }}
              className="whitespace-nowrap relative"
              disabled={screen.disabled}
              title={
                screen.disabled ? "You don't have permission" : screen.name
              }
            >
              <span className="relative inline-block">
                {screen?.name}

                {/* Red badge - only for specific screens */}
                {(screen?.name === "APIs" ||
                  screen?.name === "Products" ||
                  screen?.name === "Smart Meters" ||
                  screen?.name === "Sandbox Smart Meters" ||
                  screen?.name === "Sandbox Products") &&
                  !visitedTabs.includes(screen?.id) && (
                    <span
                      className="absolute -top-2 -right-3 
                           rounded-full bg-danger text-white 
                           text-[10px] px-1.5 leading-none border"
                    >
                      {screen?.name === "APIs"
                        ? launchpadAssets?.pending_apis
                        : screen?.name === "Products"
                          ? launchpadAssets?.pending_products
                          : screen?.name === "Smart Meters"
                            ? launchpadAssets?.pending_smart_meters
                            : screen?.name === "Sandbox Smart Meters"
                              ? launchpadAssets?.pending_sandbox_smart_meters
                              : screen?.name === "Sandbox Products"
                                ? launchpadAssets?.pending_sandbox_products
                                : "0"}
                    </span>
                  )}
              </span>
            </CustomButton>
          ))}
        </div>
        {/* {canViewEstimationRules && (
                    <button
                        onClick={() => setIsEstimationDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm text-sm font-medium whitespace-nowrap"
                    >
                        <Calculator className="w-4 h-4" />
                        Estimation Rules
                    </button>
                )} */}
      </div>

      {canViewAnyTab ? (
        <div className="bg-white dark:!bg-secondary-dark-bg p-6 rounded-lg shadow-md min-h-[500px]">
          {/* --- LAUNCH PAD DASHBOARD VIEW --- */}
          {activeTab === "launchpad" ? (
            <LaunchPadDashboard
              theme={theme}
              launchpadAssets={launchpadAssets}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setCurrentPage={setCurrentPage}
              setSearchTerm={setSearchTerm}
              setVisitedTabs={setVisitedTabs}
            />
          ) : (
            /* --- EXISTING LIST VIEW --- */
            <>
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} text-left`}
                >
                  {getAssetColumnName().replace(" Name", "s")}
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 px-10 rounded bg-gray-100 dark:bg-[#3e425a] border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <AssetTable
                  activeTab={activeTab}
                  paginatedAssets={paginatedAssets}
                  getAssetColumnName={getAssetColumnName}
                  onEdit={handleEditAsset}
                  onView={handleViewAsset}
                  onLaunch={handleLaunchAsset}
                  roleData={roleData}
                />
              </div>
              {paginatedAssets?.length > 0 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="pt-6">
          <AccessDenied message="You don't have permission to view the Asset Launch Pad." />
        </div>
      )}

      <Drawer
        width="1000px"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={isDrawerLoading ? "Loading API..." : selectedAsset?.name}
      >
        {isDrawerLoading ? (
          <div className="flex h-full items-center justify-center p-8">
            <p className="text-gray-500 dark:text-gray-400">
              Loading API details...
            </p>
          </div>
        ) : (
          selectedAsset && (
            <>
              {activeTab === "products" ? (
                <EditProductForm
                  productId={selectedAsset.id}
                  viewMode={isViewMode}
                  onSubmit={(data) => {
                    // Preserve current visibility setting
                    const originalVisibility = selectedAsset.is_public;

                    const payload = {
                      product_uuid:
                        selectedAsset.product_uuid || selectedAsset.id,
                      product_name: selectedAsset.name,
                    };

                    services.assetLaunchPad
                      .LAUNCH_PRODUCT(payload)
                      .then((response) => {
                        setAlert({
                          showAlert: true,
                          type: "success",
                          title: "Success",
                          message: "Product launched successfully.",
                          onConfirm: () => {
                            setIsDrawerOpen(false);
                            setAlert({ ...alert, showAlert: false });
                            fetchAssets(currentPage, searchTerm);
                          },
                        });
                      })
                      .catch((error) => {
                        console.error("Failed to launch product:", error);
                        setAlert({
                          showAlert: true,
                          type: "error",
                          title: "Error",
                          message:
                            error?.response?.data?.error_description ||
                            "Failed to launch product. Please try again.",
                          onConfirm: () =>
                            setAlert({ ...alert, showAlert: false }),
                        });
                      });
                  }}
                  onReject={() => {
                    console.log("Rejecting product:", selectedAsset.id);
                    setAlert({
                      showAlert: true,
                      type: "info",
                      title: "Rejected",
                      message: "Product rejected (Placeholder)",
                      onConfirm: () => setAlert({ ...alert, showAlert: false }),
                    });
                    setIsDrawerOpen(false);
                  }}
                />
              ) : activeTab === "apis" ? (
                <EditApiForm
                  asset={selectedAsset}
                  viewMode={isViewMode}
                  onSave={handleSaveApi}
                  onReject={() => {
                    console.log("Rejecting API:", selectedAsset.id);
                    setAlert({
                      showAlert: true,
                      type: "info",
                      title: "Rejected",
                      message: "API rejected with comments (Placeholder)", // Implement actual reject logic/modal if needed later
                      onConfirm: () => setAlert({ ...alert, showAlert: false }),
                    });
                    setIsDrawerOpen(false);
                  }}
                />
              ) : (
                <EditBudgetForm
                  budget={selectedAsset}
                  viewMode={isViewMode}
                  onSave={handleSaveBudget}
                />
              )}
            </>
          )
        )}
      </Drawer>

      <Drawer
        width="1000px"
        isOpen={isEstimationDrawerOpen}
        onClose={() => setIsEstimationDrawerOpen(false)}
        title="Smart Estimation Rules"
      >
        <EstimationRules />
      </Drawer>
    </div>
  );
}
