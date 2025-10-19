import React, { useEffect, useState } from "react";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModeSwitch from "./components/ModeSwitch";
import DisplayView from "./components/DisplayView";

const API_BASE_URL = "http://192.168.121.135:8000";

const DomainManager = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("whitelist"); // whitelist or blacklist
  const [domains, setDomains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const makeRequest = async (endpoint, method, body = null) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Request failed");
      }

      return data;
    } catch (error) {
      setError(error.message);
      return {
        code: 500,
        msg: error.message,
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  const loadDomains = async () => {
    const response = await makeRequest("/display", "GET");
    if (response.code === 200 && response.data && response.data.domains) {
      // 將簡單的域名數組轉換為包含 id 的對象數組
      const formattedDomains = response.data.domains.map((domain, index) => ({
        id: index + 1,
        domain: domain
      }));
      setDomains(formattedDomains);
    } else {
      setDomains([]);
      if (response.code !== 200) {
        setError(response.msg || "Failed to load domains");
      }
    }
  };

  useEffect(() => {
    // TEMPORARY: Skip auto-load for development without auth
    // loadDomains();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAdd = async () => {
    if (!newDomain.trim()) return;

    const response = await makeRequest("/add", "POST", {
      domain: newDomain.trim(),
    });

    if (response.code === 200) {
      await loadDomains();
      setNewDomain("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  const handleDelete = async (domain) => {
    const response = await makeRequest("/delete", "DELETE", {
      domain: domain // 修改為直接傳遞 domain 字串
    });
    
    if (response.code === 200) {
      await loadDomains();
    }
  };

  const filteredDomains = domains.filter((item) =>
    item.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModeChange = (newMode) => {
    setMode(newMode);
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
                <span className="text-sm text-gray-700 font-medium">管理員</span>
              </div>
              <button
                onClick={handleLogout}
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
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 animate-shake shadow-lg">
            <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Mode Switcher Component */}
        <ModeSwitch mode={mode} onModeChange={handleModeChange} />

        {/* Display View Component */}
        <DisplayView mode={mode} />
      </main>
    </div>
  );
};

export default DomainManager;