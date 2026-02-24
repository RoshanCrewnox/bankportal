import { useState, useEffect, useCallback, useRef } from "react";
import services from "../services";
import { 
  mapApiResponseToApiAsset, 
  mapApiResponseToProductAsset, 
  processLaunchpadStats 
} from "../utils/launchpadUtils";

/**
 * useAssetLaunchPad - Custom hook to manage business logic for Asset LaunchPad.
 * Mandatory Rules: Consolidates state, logic, and data orchestration.
 */
export const useAssetLaunchPad = () => {
  const [activeTab, setActiveTab] = useState("launchpad");
  const [visitedTabs, setVisitedTabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [assets, setAssets] = useState({ apis: [], products: [], tpp: [], customer: [] });
  const [launchpadAssets, setLaunchpadAssets] = useState({
    total_apis: 0, total_products: 0, total_tpp: 0, total_customers: 0,
    api_stats: {}, product_stats: {}, tpp_stats: {}, customer_stats: {},
    pending_apis: 0, pending_products: 0, pending_tpp: 0, pending_customers: 0,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [alert, setAlert] = useState({ showAlert: false, type: "confirm", message: "", title: "", onConfirm: () => {} });

  const prevSearchTermRef = useRef(searchTerm);
  const itemsPerPage = 10;

  const fetchAssets = useCallback(async (page = 1, query = "") => {
    if (!activeTab || activeTab === "launchpad") return;
    try {
      setAssets(prev => ({ ...prev, [activeTab]: [] }));
      let response;
      if (activeTab === "apis") {
        response = await services.assetLaunchPad.FETCH_API_LIST(page, query);
        if (response.data?.apis) {
          setAssets(prev => ({ ...prev, apis: response.data.apis.map(mapApiResponseToApiAsset) }));
          setTotalRecords(response.data.TOTAL_RECORDS ?? response.data.total_records ?? 0);
        }
      } else if (activeTab === "products") {
        response = await services.assetLaunchPad.FETCH_PRODUCTS_LIST(page, query);
        if (response.data?.products) {
          setAssets(prev => ({ ...prev, products: response.data.products.map(mapApiResponseToProductAsset) }));
          setTotalRecords(response.data.TOTAL_RECORDS ?? response.data.total_records ?? 0);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} assets:`, error);
    }
  }, [activeTab]);

  const fetchLaunchpadAssets = useCallback(async () => {
    if (activeTab !== "launchpad") return;
    try {
      const response = await services.assetLaunchPad.FETCH_ASSETS();
      if (response.data) {
        const stats = processLaunchpadStats(response.data.launchpad_assets);
        setLaunchpadAssets({
          total_apis: response.data.totals?.api_count || 0,
          total_products: response.data.totals?.product_count || 0,
          total_tpp: response.data.totals?.tpp_count || 0,
          total_customers: response.data.totals?.customer_count || 0,
          pending_apis: response.data.total_pending?.api_count || 0,
          pending_products: response.data.total_pending?.product_count || 0,
          api_stats: {
            launched: stats["api_launched"] || 0,
            saved: stats["api_saved"] || 0,
            pending_launch: stats["api_pending_launch"] || 0,
            attached: stats["api_attached"] || 0,
            subscribed: stats["api_subscribed"] || 0,
          },
          product_stats: {
            launched: stats["product_launched"] || 0,
            saved: stats["product_saved"] || 0,
            pending_launch: stats["product_pending_launch"] || 0,
            attached: stats["product_attached"] || 0,
            subscribed: stats["product_subscribed"] || 0,
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
    const timeoutId = setTimeout(() => {
      const pageToUse = searchTermChanged ? 1 : currentPage;
      if (activeTab === "launchpad") fetchLaunchpadAssets();
      else fetchAssets(pageToUse, searchTerm || "");
    }, searchTermChanged ? 500 : 0);
    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, fetchAssets, fetchLaunchpadAssets, activeTab]);

  const closeAlert = () => setAlert(prev => ({ ...prev, showAlert: false }));

  const handleEditAsset = (asset) => {
    setIsDrawerOpen(true);
    setIsViewMode(false);
    setSelectedAsset(asset);
    if (activeTab === "apis") {
      setIsDrawerLoading(true);
      services.assetLaunchPad.FETCH_API_DETAIL(asset.id)
        .then(res => setSelectedAsset(mapApiResponseToApiAsset(res.data)))
        .finally(() => setIsDrawerLoading(false));
    }
  };

  const handleViewAsset = (asset) => {
    setIsDrawerOpen(true);
    setIsViewMode(true);
    setSelectedAsset(asset);
    if (activeTab === "apis") {
      setIsDrawerLoading(true);
      services.assetLaunchPad.FETCH_API_DETAIL(asset.id)
        .then(res => setSelectedAsset(mapApiResponseToApiAsset(res.data)))
        .finally(() => setIsDrawerLoading(false));
    }
  };

  const handleLaunchAsset = async (asset) => {
    try {
      if (activeTab === "apis") {
        await services.assetLaunchPad.LAUNCH_API({ api_uuid: asset.api_uuid, api_name: asset.api_name });
      } else if (activeTab === "products") {
        await services.assetLaunchPad.LAUNCH_PRODUCT({ product_uuid: asset.product_uuid, product_name: asset.name });
      }
      setAlert({ showAlert: true, type: "success", title: "Success", message: `${activeTab.slice(0, -1)} launched successfully.`, onConfirm: () => { closeAlert(); fetchAssets(currentPage, searchTerm); } });
    } catch {
      setAlert({ showAlert: true, type: "error", title: "Error", message: "Failed to launch asset.", onConfirm: closeAlert });
    }
  };

  const handleSaveApi = async (updatedApi) => {
    try {
      await services.assetLaunchPad.LAUNCH_API({
        api_uuid: updatedApi.api_uuid,
        api_name: updatedApi.api_name,
        api_amount: Number(updatedApi.amount),
        commercial_type: updatedApi.commercial_type,
        is_public_apis: updatedApi.api_visibility,
      });
      setIsDrawerOpen(false);
      setAlert({ showAlert: true, type: "success", title: "Success", message: "API saved and launched.", onConfirm: () => { closeAlert(); fetchAssets(currentPage, searchTerm); } });
    } catch {
      setAlert({ showAlert: true, type: "error", title: "Error", message: "Failed to save API.", onConfirm: closeAlert });
    }
  };

  const handleSaveBudget = async (updatedBudget) => {
    try {
      const launchService = activeTab === "sandboxSmartMeters" ? services.assetLaunchPad.LAUNCH_SB_SMARTMETER : services.assetLaunchPad.LAUNCH_SMARTMETER;
      await launchService({
        meter_uuid: updatedBudget.meter_uuid || updatedBudget.id,
        meter_name: updatedBudget.name,
        meter_amount: Number(updatedBudget.actual_cost),
      });
      setIsDrawerOpen(false);
      setAlert({ showAlert: true, type: "success", title: "Success", message: "Smart Meter launched.", onConfirm: () => { closeAlert(); fetchAssets(currentPage, searchTerm); } });
    } catch {
      setAlert({ showAlert: true, type: "error", title: "Error", message: "Failed to save Smart Meter.", onConfirm: closeAlert });
    }
  };

  const handleReject = () => {
    setAlert({ showAlert: true, type: "info", title: "Rejected", message: "Action rejected (Placeholder)", onConfirm: closeAlert });
    setIsDrawerOpen(false);
  };

  return {
    activeTab, setActiveTab, visitedTabs, setVisitedTabs,
    searchTerm, setSearchTerm, currentPage, setCurrentPage,
    assets, totalRecords, launchpadAssets,
    isDrawerOpen, setIsDrawerOpen, isDrawerLoading,
    selectedAsset, setSelectedAsset, isViewMode, setIsViewMode,
    alert, setAlert, handleEditAsset, handleViewAsset, handleLaunchAsset, handleSaveApi, handleSaveBudget, handleReject, fetchAssets, itemsPerPage
  };
};
