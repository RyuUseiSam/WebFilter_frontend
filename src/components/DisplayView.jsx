import React from 'react';
import { ShieldOff, AlertTriangle, Wifi } from 'lucide-react';
import WhiteListView from './WhiteListView';
import BlackListView from './BlackListView';

const DisplayView = ({
  mode,
  whiteListRecords,
  blackListRecords,
  onAddRecord,
  onAddRecordBatch,
  onDeleteRecord,
  onToggleRecord,
  onUpdateTimeSlots,
  searchTerm,
  onSearchChange,
  paginationData,
  onPageChange,
  onPageSizeChange,
}) => {
  // Render Bypass Mode Information for bypass mode
  if (mode === 'bypass') {
    return (
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Icon and Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <ShieldOff className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">不過濾模式已啟用</h3>
            <p className="text-gray-600 max-w-2xl">
              所有網路過濾功能已停用。DNS 查詢將直接轉發至上游伺服器 (1.1.1.1)，不會套用任何黑名單或白名單規則。
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-orange-700" />
                </div>
                <h4 className="font-semibold text-orange-900">無限制存取</h4>
              </div>
              <p className="text-sm text-orange-800">
                所有網站和域名都可以正常訪問，不受任何限制。
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                  <ShieldOff className="w-6 h-6 text-blue-700" />
                </div>
                <h4 className="font-semibold text-blue-900">規則未啟用</h4>
              </div>
              <p className="text-sm text-blue-800">
                您配置的黑名單和白名單規則仍然保存，但目前不會套用。
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-purple-700" />
                </div>
                <h4 className="font-semibold text-purple-900">切換模式</h4>
              </div>
              <p className="text-sm text-purple-800">
                若要重新啟用過濾，請切換至白名單或黑名單模式。
              </p>
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-2">使用須知</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• 不過濾模式適用於測試、維護或臨時解除所有限制的情況</li>
                  <li>• 您的規則設定不會被刪除，切換回白名單或黑名單模式時會自動重新套用</li>
                  <li>• 若要管理規則，請先切換至對應的模式（白名單或黑名單）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render WhiteListView for whitelist mode
  if (mode === 'whitelist') {
    return (
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <WhiteListView
          records={whiteListRecords}
          onAddRecord={onAddRecord}
          onAddRecordBatch={onAddRecordBatch}
          onDeleteRecord={onDeleteRecord}
          onToggleRecord={onToggleRecord}
          onUpdateTimeSlots={onUpdateTimeSlots}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          paginationData={paginationData}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    );
  }

  // Render BlackListView for blacklist mode
  return (
    <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
      <BlackListView
        records={blackListRecords}
        onAddRecord={onAddRecord}
        onAddRecordBatch={onAddRecordBatch}
        onDeleteRecord={onDeleteRecord}
        onToggleRecord={onToggleRecord}
        onUpdateTimeSlots={onUpdateTimeSlots}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        paginationData={paginationData}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default DisplayView;
