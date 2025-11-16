import React from 'react';
import { Shield, ShieldAlert, ShieldOff, Save } from 'lucide-react';

const ModeSwitch = ({ mode, onModeChange, onSave, isSaving = false }) => {
  // Calculate sliding indicator position
  const getIndicatorPosition = () => {
    switch (mode) {
      case 'whitelist':
        return 'left-1';
      case 'blacklist':
        return 'left-[calc(33.333%+2px)]';
      case 'bypass':
        return 'left-[calc(66.666%+4px)]';
      default:
        return 'left-1';
    }
  };

  // Get gradient colors based on mode
  const getGradientColors = () => {
    switch (mode) {
      case 'whitelist':
        return 'from-green-500 to-emerald-600';
      case 'blacklist':
        return 'from-red-500 to-rose-600';
      case 'bypass':
        return 'from-orange-500 to-amber-600';
      default:
        return 'from-green-500 to-emerald-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-slideUp">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">過濾模式</h2>

      <div className="relative bg-gray-100 rounded-lg p-1 grid grid-cols-3 gap-1">
        {/* Sliding background indicator */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(33.333%-4px)] bg-gradient-to-r rounded-md shadow-md transition-all duration-300 ease-in-out ${getIndicatorPosition()} ${getGradientColors()}`}
        />

        {/* White List Button */}
        <button
          type="button"
          onClick={() => onModeChange('whitelist')}
          className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 rounded-md font-semibold transition-all duration-300 ${
            mode === 'whitelist'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Shield className={`w-5 h-5 transition-transform duration-300 ${
            mode === 'whitelist' ? 'scale-110' : 'scale-100'
          }`} />
          <span className="text-xs sm:text-base">白名單</span>
        </button>

        {/* Black List Button */}
        <button
          type="button"
          onClick={() => onModeChange('blacklist')}
          className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 rounded-md font-semibold transition-all duration-300 ${
            mode === 'blacklist'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <ShieldAlert className={`w-5 h-5 transition-transform duration-300 ${
            mode === 'blacklist' ? 'scale-110' : 'scale-100'
          }`} />
          <span className="text-xs sm:text-base">黑名單</span>
        </button>

        {/* Bypass Button */}
        <button
          type="button"
          onClick={() => onModeChange('bypass')}
          className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 rounded-md font-semibold transition-all duration-300 ${
            mode === 'bypass'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <ShieldOff className={`w-5 h-5 transition-transform duration-300 ${
            mode === 'bypass' ? 'scale-110' : 'scale-100'
          }`} />
          <span className="text-xs sm:text-base">不過濾</span>
        </button>
      </div>

      {/* Mode Description */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 transition-all duration-300"
        style={{
          borderColor: mode === 'whitelist' ? '#10b981' : mode === 'blacklist' ? '#ef4444' : '#f97316'
        }}
      >
        <p className="text-sm text-gray-700">
          {mode === 'whitelist' ? (
            <>
              <span className="font-semibold text-green-700">白名單模式：</span>
              <span className="ml-1">僅允許列表中的域名訪問，其他域名將被阻擋。</span>
            </>
          ) : mode === 'blacklist' ? (
            <>
              <span className="font-semibold text-red-700">黑名單模式：</span>
              <span className="ml-1">阻擋列表中的域名訪問，其他域名正常通行。</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-orange-700">不過濾模式：</span>
              <span className="ml-1">停用所有網路過濾，所有 DNS 查詢將直接轉發至上游 DNS 伺服器，無任何限制。</span>
            </>
          )}
        </p>
      </div>

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : mode === 'whitelist'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              : mode === 'blacklist'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
              : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'
          } text-white`}
        >
          <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
          <span>{isSaving ? '儲存中...' : '儲存模式'}</span>
        </button>
      </div>
    </div>
  );
};

export default ModeSwitch;
