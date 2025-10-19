import React from 'react';
import { Shield, ShieldAlert } from 'lucide-react';

const ModeSwitch = ({ mode, onModeChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-slideUp">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">過濾模式</h2>

      <div className="relative bg-gray-100 rounded-lg p-1 grid grid-cols-2 gap-1">
        {/* Sliding background indicator */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r rounded-md shadow-md transition-all duration-300 ease-in-out ${
            mode === 'whitelist'
              ? 'left-1 from-green-500 to-emerald-600'
              : 'left-[calc(50%+2px)] from-red-500 to-rose-600'
          }`}
        />

        {/* White List Button */}
        <button
          onClick={() => onModeChange('whitelist')}
          className={`relative z-10 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold transition-all duration-300 ${
            mode === 'whitelist'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Shield className={`w-5 h-5 transition-transform duration-300 ${
            mode === 'whitelist' ? 'scale-110' : 'scale-100'
          }`} />
          <span className="text-sm sm:text-base">白名單模式</span>
        </button>

        {/* Black List Button */}
        <button
          onClick={() => onModeChange('blacklist')}
          className={`relative z-10 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold transition-all duration-300 ${
            mode === 'blacklist'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <ShieldAlert className={`w-5 h-5 transition-transform duration-300 ${
            mode === 'blacklist' ? 'scale-110' : 'scale-100'
          }`} />
          <span className="text-sm sm:text-base">黑名單模式</span>
        </button>
      </div>

      {/* Mode Description */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 transition-all duration-300"
        style={{
          borderColor: mode === 'whitelist' ? '#10b981' : '#ef4444'
        }}
      >
        <p className="text-sm text-gray-700">
          {mode === 'whitelist' ? (
            <>
              <span className="font-semibold text-green-700">白名單模式：</span>
              <span className="ml-1">僅允許列表中的域名訪問，其他域名將被阻擋。</span>
            </>
          ) : (
            <>
              <span className="font-semibold text-red-700">黑名單模式：</span>
              <span className="ml-1">阻擋列表中的域名訪問，其他域名正常通行。</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default ModeSwitch;
