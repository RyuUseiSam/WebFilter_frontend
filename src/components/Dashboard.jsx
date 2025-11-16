import React from 'react';
import { Shield, ShieldAlert, ShieldOff, CheckCircle, XCircle, Calendar, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = ({ mode, dashboardStats }) => {
  // Extract statistics from dashboard API data based on current mode
  // dashboardStats contains: { mode, blackList: {...}, whiteList: {...}, totalCount }
  const getModeStats = () => {
    if (!dashboardStats) {
      return { total: 0, active: 0, inactive: 0, scheduled: 0 };
    }

    if (mode === 'whitelist') {
      return dashboardStats.whiteList || { total: 0, active: 0, inactive: 0, scheduled: 0 };
    } else if (mode === 'blacklist') {
      return dashboardStats.blackList || { total: 0, active: 0, inactive: 0, scheduled: 0 };
    } else {
      // Bypass mode - return zeros
      return { total: 0, active: 0, inactive: 0, scheduled: 0 };
    }
  };

  const stats = getModeStats();
  const totalRules = stats.total;
  const activeRules = stats.active;
  const inactiveRules = stats.inactive;
  const scheduledRules = stats.scheduled;

  // Color schemes based on mode
  const modeColors = {
    whitelist: {
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: 'text-green-600'
    },
    blacklist: {
      gradient: 'from-red-500 to-rose-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: 'text-red-600'
    },
    bypass: {
      gradient: 'from-orange-500 to-amber-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'text-orange-600'
    }
  };

  const colors = modeColors[mode] || modeColors.whitelist;

  // Stats cards data using values from /dashboard API
  const statsCards = [
    {
      title: '總規則數',
      value: totalRules,
      icon: Activity,
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      delay: '0s'
    },
    {
      title: '啟用規則',
      value: activeRules,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      delay: '0.1s'
    },
    {
      title: '停用規則',
      value: inactiveRules,
      icon: XCircle,
      gradient: 'from-gray-500 to-slate-600',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      delay: '0.2s'
    },
    {
      title: '排程規則',
      value: scheduledRules,
      icon: Calendar,
      gradient: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      delay: '0.3s'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Mode Banner */}
      <div className={`bg-gradient-to-r ${colors.gradient} rounded-xl shadow-lg p-6 text-white animate-slideUp`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {mode === 'whitelist' ? (
              <Shield className="w-8 h-8" />
            ) : mode === 'blacklist' ? (
              <ShieldAlert className="w-8 h-8" />
            ) : (
              <ShieldOff className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
              當前模式
            </p>
            <h2 className="text-2xl font-bold mb-1">
              {mode === 'whitelist' ? '白名單模式' : mode === 'blacklist' ? '黑名單模式' : '不過濾模式'}
            </h2>
            <p className="text-white/90 text-sm">
              {mode === 'whitelist'
                ? '僅允許列表中的域名訪問，其他域名將被阻擋。'
                : mode === 'blacklist'
                ? '阻擋列表中的域名訪問，其他域名正常通行。'
                : '所有過濾功能已停用，DNS 查詢將直接轉發至上游伺服器，無任何限制。'}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
            {mode === 'bypass' ? (
              <>
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">未過濾</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">運行中</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fadeIn"
            style={{ animationDelay: card.delay }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-gray-600 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
