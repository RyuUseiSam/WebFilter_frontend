import React, { useState, useEffect } from "react";
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NetworkBackground from "./components/NetworkBackground";

const API_BASE_URL = "http://192.168.121.135:8000";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const makeRequest = async (endpoint, method, body = null) => {
    const headers = {
      "Content-Type": "application/json",
    };

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        code: 500,
        msg: `Error: ${error.message}`,
        data: null,
      };
    }
  };

  // Trigger shake animation on error
  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("請輸入帳號和密碼");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await makeRequest("/login", "POST", {
        username,
        password,
      });

      if (response.code === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setError(response.msg || "登入失敗");
      }
    } catch (error) {
      setError("登入時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Network Background */}
      <NetworkBackground />

      {/* Login Card with animations */}
      <div className="w-full max-w-md animate-slideUp relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              HKP WebFilter
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">請輸入您的帳號密碼</p>
          </div>

          {/* Error Message with shake animation */}
          {error && (
            <div className={`mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-3 transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700"
              >
                帳號
              </label>
              <div className="relative group">
                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-600" />
                <input
                  id="username"
                  type="text"
                  placeholder="請輸入帳號"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-lg
                    focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                    disabled:bg-gray-50 disabled:cursor-not-allowed
                    transition-all duration-200 text-sm sm:text-base
                    hover:border-gray-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                密碼
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-600" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="請輸入密碼"
                  className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-3.5 border-2 border-gray-200 rounded-lg
                    focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                    disabled:bg-gray-50 disabled:cursor-not-allowed
                    transition-all duration-200 text-sm sm:text-base
                    hover:border-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  disabled={loading}
                  aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-3.5 px-4 rounded-lg font-semibold text-sm sm:text-base
                hover:from-blue-700 hover:to-indigo-700
                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2
                disabled:from-blue-300 disabled:to-indigo-300 disabled:cursor-not-allowed
                transform transition-all duration-200
                hover:scale-[1.02] active:scale-[0.98]
                shadow-lg hover:shadow-xl
                flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>登入中...</span>
                </>
              ) : (
                "登入"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs sm:text-sm text-gray-500">
              請確保您有適當的權限存取此系統
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
