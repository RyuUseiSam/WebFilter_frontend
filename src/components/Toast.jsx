import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
      borderColor: 'border-green-400',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
      borderColor: 'border-red-400',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    info: {
      icon: Info,
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      borderColor: 'border-blue-400',
      textColor: 'text-white',
      iconColor: 'text-white'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      borderColor: 'border-yellow-400',
      textColor: 'text-white',
      iconColor: 'text-white'
    }
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className={`${bgColor} ${textColor} rounded-lg shadow-2xl border ${borderColor} p-4 min-w-[300px] max-w-md flex items-center gap-3 backdrop-blur-sm`}>
        <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0 animate-scaleIn`} />
        <p className="flex-1 font-medium text-sm">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-all duration-200"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
