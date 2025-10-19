import React from 'react';
import { FileSearch, Sparkles } from 'lucide-react';

const DisplayView = ({ mode }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          {mode === 'whitelist' ? '白名單' : '黑名單'}管理
        </h2>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          mode === 'whitelist'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {mode === 'whitelist' ? '白名單模式' : '黑名單模式'}
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="relative mb-6">
          <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${
            mode === 'whitelist' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
            mode === 'whitelist'
              ? 'bg-gradient-to-br from-green-400 to-emerald-600'
              : 'bg-gradient-to-br from-red-400 to-rose-600'
          } shadow-lg animate-pulse-slow`}>
            <FileSearch className="w-12 h-12 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          即將推出
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          此區域將用於顯示和管理
          <span className={`font-semibold mx-1 ${
            mode === 'whitelist' ? 'text-green-600' : 'text-red-600'
          }`}>
            {mode === 'whitelist' ? '白名單' : '黑名單'}
          </span>
          內容。功能開發中，敬請期待！
        </p>

        {/* Decorative elements */}
        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayView;
