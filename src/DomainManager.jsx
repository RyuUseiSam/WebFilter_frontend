import React, { useEffect, useState } from "react";
import { LogOut, User, Settings, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModeSwitch from "./components/ModeSwitch";
import Dashboard from "./components/Dashboard";
import DisplayView from "./components/DisplayView";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

const API_BASE_URL = "http://192.168.121.52:5125";

const DomainManager = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("whitelist"); // Current mode in the switch (not saved yet)
  const [savedMode, setSavedMode] = useState("whitelist"); // Actually saved mode (for dashboard display)
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [teacherName, setTeacherName] = useState("管理員"); // Default to "管理員"
  const [roomName, setRoomName] = useState(""); // Room name from backend
  const [records, setRecords] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to make API requests
  const makeRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Check for invalid token / session timeout
      if (data.code === 401 || data.msg === "Invalid token") {
        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user_info");

        // Show error toast
        setToast({
          message: "登入已過期，請重新登入",
          type: "error",
        });

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);

        throw new Error("Session expired");
      }

      if (data.code !== 200) {
        throw new Error(data.msg || "API request failed");
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  // Convert backend weeks (1-7 for Mon-Sun) to frontend weekdays (0-6 for Sun-Sat)
  const convertWeeksToWeekdays = (weeks) => {
    return weeks.map(week => week === 7 ? 0 : week);
  };

  // Convert frontend weekdays (0-6 for Sun-Sat) to backend weeks (1-7 for Mon-Sun)
  const convertWeekdaysToWeeks = (weekdays) => {
    return weekdays.map(day => day === 0 ? 7 : day);
  };

  // Convert backend domain record to frontend format
  const convertBackendToFrontend = (backendRecord) => {
    return {
      id: backendRecord.id,
      url: backendRecord.url,
      domain: backendRecord.domain,
      isScheduled: backendRecord.isScheduled,
      scheduleTimeSlots: backendRecord.scheduleTimeSlots.map(slot => ({
        start: slot.start,
        end: slot.end,
        weekdays: convertWeeksToWeekdays(slot.weeks),
      })),
      isEnabled: backendRecord.isActive,
      type: backendRecord.type,
    };
  };

  // Convert frontend domain record to backend format
  const convertFrontendToBackend = (frontendRecord) => {
    return {
      domain: frontendRecord.domain || extractDomainFromUrl(frontendRecord.url),
      url: frontendRecord.url,
      type: frontendRecord.type,
      isActive: frontendRecord.isEnabled !== undefined ? frontendRecord.isEnabled : true,
      isScheduled: frontendRecord.isScheduled || false,
      scheduleTimeSlots: (frontendRecord.scheduleTimeSlots || []).map(slot => ({
        start: slot.start,
        end: slot.end,
        weeks: convertWeekdaysToWeeks(slot.weekdays),
      })),
    };
  };

  // Extract domain from URL
  const extractDomainFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  };

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      const response = await makeRequest("/dashboard");
      setDashboardStats(response.data);
      return response.data;
    } catch (error) {
      setToast({
        message: "無法載入儀表板數據",
        type: "error",
      });
      return null;
    }
  };

  // Fetch all domain records
  const fetchRecords = async () => {
    try {
      const response = await makeRequest("/getRecord");
      const convertedRecords = response.data.domains.map(convertBackendToFrontend);
      setRecords(convertedRecords);
      return convertedRecords;
    } catch (error) {
      setToast({
        message: "無法載入域名記錄",
        type: "error",
      });
      return [];
    }
  };

  // Fetch room name
  const fetchRoomName = async () => {
    try {
      const response = await makeRequest("/room");
      if (response.data && response.data.room_name) {
        setRoomName(response.data.room_name);
      }
    } catch (error) {
      console.error("Failed to fetch room name:", error);
      // Silently fail - room name is not critical
    }
  };

  // Load initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard data to get current mode
        const dashData = await fetchDashboard();
        if (dashData && dashData.mode) {
          setMode(dashData.mode);
          setSavedMode(dashData.mode); // Set both mode and savedMode on initial load
        }

        // Fetch all records
        await fetchRecords();

        // Fetch room name
        await fetchRoomName();
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load user info from localStorage on mount
  useEffect(() => {
    const userInfoStr = localStorage.getItem("user_info");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        // If SSO login, display chinese_name + "老師"; otherwise keep default "管理員"
        if (userInfo.chinese_name) {
          setTeacherName(`${userInfo.chinese_name}老師`);
        }
      } catch (error) {
        console.error("Failed to parse user_info:", error);
        // Keep default "管理員" if parsing fails
      }
    }
    // If no user_info in localStorage, it's a normal login - keep default "管理員"
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info"); // Clear SSO user info
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };


  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleSaveMode = async () => {
    setIsSaving(true);
    setToast(null);

    try {
      await makeRequest("/mode", {
        method: "POST",
        body: JSON.stringify({ mode }),
      });

      // Update saved mode to match current mode
      setSavedMode(mode);

      setToast({
        message: `成功儲存${mode === 'whitelist' ? '白名單' : '黑名單'}模式！`,
        type: 'success'
      });

      // Refresh dashboard stats and records after mode change
      await fetchDashboard();
      await fetchRecords();
    } catch (error) {
      setToast({
        message: `儲存模式失敗：${error.message}`,
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add new domain record
  const handleAddRecord = async (recordData) => {
    try {
      const backendData = convertFrontendToBackend(recordData);
      const response = await makeRequest("/addRecord", {
        method: "POST",
        body: JSON.stringify(backendData),
      });

      const newRecord = convertBackendToFrontend(response.data.domain);
      setRecords([...records, newRecord]);

      setToast({
        message: "成功新增域名記錄！",
        type: "success",
      });

      // Refresh dashboard stats
      await fetchDashboard();

      return newRecord;
    } catch (error) {
      setToast({
        message: `新增記錄失敗：${error.message}`,
        type: "error",
      });
      throw error;
    }
  };

  // Add multiple domain records in batch
  const handleAddRecordBatch = async (recordsData) => {
    try {
      const backendDataArray = recordsData.map(convertFrontendToBackend);
      const response = await makeRequest("/addRecordBatch", {
        method: "POST",
        body: JSON.stringify({ domains: backendDataArray }),
      });

      // API returns added_domains array (can be empty if all duplicates)
      const addedDomains = response.data.added_domains || [];
      const newRecords = addedDomains.map(convertBackendToFrontend);
      setRecords([...records, ...newRecords]);

      // Construct message based on batch results
      const { added_count = 0, skipped_count = 0, failed_count = 0 } = response.data;
      let message = '';
      if (added_count > 0) {
        message = `成功批次新增 ${added_count} 筆域名記錄！`;
      }
      if (skipped_count > 0) {
        message += (message ? ' ' : '') + `${skipped_count} 筆重複已跳過`;
      }
      if (failed_count > 0) {
        message += (message ? ' ' : '') + `${failed_count} 筆失敗`;
      }
      if (!message) {
        message = '批次操作完成';
      }

      setToast({
        message,
        type: added_count > 0 ? "success" : "info",
      });

      // Refresh dashboard stats
      await fetchDashboard();

      return newRecords;
    } catch (error) {
      setToast({
        message: `批次新增記錄失敗：${error.message}`,
        type: "error",
      });
      throw error;
    }
  };

  // Delete domain record
  const handleDeleteRecord = async (id) => {
    try {
      await makeRequest("/deleteRecord", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      setRecords(records.filter(record => record.id !== id));

      setToast({
        message: "成功刪除域名記錄！",
        type: "success",
      });

      // Refresh dashboard stats
      await fetchDashboard();
    } catch (error) {
      setToast({
        message: `刪除記錄失敗：${error.message}`,
        type: "error",
      });
      throw error;
    }
  };

  // Toggle record enabled status
  const handleToggleRecord = async (id) => {
    try {
      const record = records.find(r => r.id === id);
      if (!record) return;

      const newStatus = !record.isEnabled;

      await makeRequest("/updateRecordStatus", {
        method: "POST",
        body: JSON.stringify({
          id,
          isActive: newStatus,
        }),
      });

      setRecords(records.map(r =>
        r.id === id ? { ...r, isEnabled: newStatus } : r
      ));

      setToast({
        message: `成功${newStatus ? '啟用' : '停用'}域名記錄！`,
        type: "success",
      });

      // Refresh dashboard stats
      await fetchDashboard();
    } catch (error) {
      setToast({
        message: `更新記錄狀態失敗：${error.message}`,
        type: "error",
      });
      throw error;
    }
  };

  // Update record time slots
  const handleUpdateTimeSlots = async (id, timeSlots, isActive) => {
    try {
      const backendTimeSlots = timeSlots.map(slot => ({
        start: slot.start,
        end: slot.end,
        weeks: convertWeekdaysToWeeks(slot.weekdays),
      }));

      const response = await makeRequest("/updateRecordTimeSlot", {
        method: "POST",
        body: JSON.stringify({
          id,
          isActive,
          scheduleTimeSlots: backendTimeSlots,
        }),
      });

      const updatedRecord = convertBackendToFrontend(response.data.domain);
      setRecords(records.map(r => r.id === id ? updatedRecord : r));

      setToast({
        message: "成功更新時間排程！",
        type: "success",
      });

      return updatedRecord;
    } catch (error) {
      setToast({
        message: `更新時間排程失敗：${error.message}`,
        type: "error",
      });
      throw error;
    }
  };

  // Filter records by type
  const whiteListRecords = records.filter(r => r.type === 'white');
  const blackListRecords = records.filter(r => r.type === 'black');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    HKP WebFilter
                  </h1>
                  {roomName && (
                    <span className="px-3 py-1 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md">
                      {roomName}室
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">域名過濾管理系統</p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">{teacherName}</span>
              </div>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-red-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">登出</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">載入中...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Information Section */}
            <section className="mb-8 animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  儀表板
                </h2>
                <p className="text-gray-600 text-sm mt-2 ml-11">系統狀態與規則概覽</p>
              </div>

              {/* Dashboard Component */}
              <Dashboard
                mode={savedMode}
                activeRules={(savedMode === 'whitelist' ? whiteListRecords : blackListRecords).filter(rule => rule.isEnabled)}
                inactiveRules={(savedMode === 'whitelist' ? whiteListRecords : blackListRecords).filter(rule => !rule.isEnabled)}
              />
            </section>

            {/* Settings Section */}
            <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  設定
                </h2>
                <p className="text-gray-600 text-sm mt-2 ml-11">管理過濾模式與規則</p>
              </div>

              {/* Mode Switcher Component */}
              <ModeSwitch
                mode={mode}
                onModeChange={handleModeChange}
                onSave={handleSaveMode}
                isSaving={isSaving}
              />

              {/* Display View Component */}
              <DisplayView
                mode={mode}
                whiteListRecords={whiteListRecords}
                blackListRecords={blackListRecords}
                onAddRecord={handleAddRecord}
                onAddRecordBatch={handleAddRecordBatch}
                onDeleteRecord={handleDeleteRecord}
                onToggleRecord={handleToggleRecord}
                onUpdateTimeSlots={handleUpdateTimeSlots}
              />
            </section>
          </>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="確認登出"
        message="確定要登出系統嗎？登出後需要重新登入才能繼續使用。"
        confirmText="確認登出"
        cancelText="取消"
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default DomainManager;