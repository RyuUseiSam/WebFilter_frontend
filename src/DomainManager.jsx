import React, { useEffect, useState } from "react";
import { LogOut, User, Settings, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModeSwitch from "./components/ModeSwitch";
import Dashboard from "./components/Dashboard";
import DisplayView from "./components/DisplayView";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

// Mock data for dashboard demonstration
const mockWhiteListRules = [
  {
    id: 1,
    url: 'https://www.google.com',
    isScheduled: false,
    scheduleTimeSlots: [],
    isEnabled: true
  },
  {
    id: 2,
    url: 'https://github.com',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '09:00', end: '12:00', weekdays: [1, 2, 3, 4, 5] },
      { start: '13:00', end: '18:00', weekdays: [1, 2, 3, 4, 5] }
    ],
    isEnabled: true
  },
  {
    id: 3,
    url: 'https://stackoverflow.com',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '08:00', end: '17:00', weekdays: [1, 2, 3, 4, 5] }
    ],
    isEnabled: false
  },
  {
    id: 4,
    url: 'https://developer.mozilla.org',
    isScheduled: false,
    scheduleTimeSlots: [],
    isEnabled: true
  }
];

const mockBlackListRules = [
  {
    id: 1,
    url: 'https://www.facebook.com',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '09:00', end: '17:00', weekdays: [1, 2, 3, 4, 5] }
    ],
    isEnabled: true
  },
  {
    id: 2,
    url: 'https://twitter.com',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '09:00', end: '12:00', weekdays: [1, 2, 3, 4, 5] },
      { start: '13:00', end: '18:00', weekdays: [1, 2, 3, 4, 5] }
    ],
    isEnabled: false
  },
  {
    id: 3,
    url: 'https://www.instagram.com',
    isScheduled: false,
    scheduleTimeSlots: [],
    isEnabled: true
  },
  {
    id: 4,
    url: 'https://www.tiktok.com',
    isScheduled: true,
    scheduleTimeSlots: [
      { start: '00:00', end: '23:59', weekdays: [0, 1, 2, 3, 4, 5, 6] }
    ],
    isEnabled: true
  }
];

const DomainManager = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("whitelist"); // whitelist or blacklist
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [teacherName, setTeacherName] = useState("管理員"); // Default to "管理員"

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

  const handleSaveMode = () => {
    setIsSaving(true);
    setToast(null);

    // TODO: API integration for saving mode
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      setToast({
        message: `成功儲存${mode === 'whitelist' ? '白名單' : '黑名單'}模式！`,
        type: 'success'
      });
    }, 500);
  };

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
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  HKP WebFilter
                </h1>
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
            mode={mode}
            activeRules={(mode === 'whitelist' ? mockWhiteListRules : mockBlackListRules).filter(rule => rule.isEnabled)}
            inactiveRules={(mode === 'whitelist' ? mockWhiteListRules : mockBlackListRules).filter(rule => !rule.isEnabled)}
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
          <DisplayView mode={mode} />
        </section>
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