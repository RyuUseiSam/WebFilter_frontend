import React, { useState } from 'react';
import { Search, Plus, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DomainManager = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([
    { id: 1, domain: 'www.google.com', ip: '142.251.42.228' },
    { id: 2, domain: 'www.facebook.com', ip: '157.240.199.35' }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newIP, setNewIP] = useState('');

  const handleLogout = () => {
    // 這裡可以加入登出相關的邏輯，例如清除 token 等
    navigate('/');
  };

  const handleAdd = () => {
    if (newDomain && newIP) {
      setDomains([
        ...domains,
        {
          id: domains.length + 1,
          domain: newDomain,
          ip: newIP
        }
      ]);
      setNewDomain('');
      setNewIP('');
    }
  };

  const handleDelete = (id) => {
    setDomains(domains.filter(domain => domain.id !== id));
  };

  const filteredDomains = domains.filter(domain =>
    domain.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    domain.ip.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header with title and logout button */}
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
          
          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋域名或 IP..."
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
              onChange={(e) => setNewDomain(e.target.value)}
            />
            <input
              type="text"
              placeholder="輸入 IP 位址"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus size={20} />
              新增
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
                    IP 位址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDomains.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.domain}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
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