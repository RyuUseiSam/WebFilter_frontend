import React, { useEffect, useState } from "react";
import { Search, Plus, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://192.168.121.135:8000";

const DomainManager = () => {
  const navigate = useNavigate();
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
    loadDomains();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Domain2IP 管理系統</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={20} />
              登出
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋域名..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add New Entry */}
          <div className="mb-6 flex gap-4">
            <input
              type="text"
              placeholder="輸入域名"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newDomain}
              onKeyDown={handleKeyPress}
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              {loading ? "處理中..." : "新增"}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    域名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDomains.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.domain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(item.domain)} // 修改為傳遞 domain 字串
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainManager;