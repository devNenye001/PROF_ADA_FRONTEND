import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

interface AuthPageProps {
  onLoginSuccess: (email: string, accessToken: string, refreshToken: string) => void;
  onBack: () => void;
  initialError?: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  onLoginSuccess, 
  onBack,
  initialError = null,
}) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Sync initial error prop
  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;
    setError(null);
    setIsGoogleLoading(true);
    
    // Simulate API call for Google Auth
    setTimeout(() => {
      setIsGoogleLoading(false);
      // For local development and hosted demo, generate mock tokens
      const mockAccessToken = "mock_google_access_token_" + Date.now();
      const mockRefreshToken = "mock_google_refresh_token_" + Date.now();
      onLoginSuccess("student@university.edu", mockAccessToken, mockRefreshToken);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 h-screen w-screen bg-slate-50 text-slate-900 flex items-center justify-center overflow-hidden z-50 font-sans">
      {/* Light Aurora Glow Backdrop Spots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[800px] h-[800px] -top-[300px] -left-[200px] bg-orange-100/30 rounded-full blur-3xl" />
        <div className="absolute w-[600px] h-[600px] top-[40%] -right-[300px] bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white border border-slate-200 rounded-xl backdrop-blur-md transition-all duration-300 active:scale-95 shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to home</span>
        </button>
      </div>

      {/* Main Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] mx-4 p-8 sm:p-10 rounded-[24px] bg-white border border-slate-200/60 shadow-xl flex flex-col items-center"
      >
        <div className="text-center mb-8">
          <h1 className="font-dm-sans font-light text-4xl tracking-tight text-slate-900 select-none">
            Prof. Ada
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-light">Welcome back, student</p>
        </div>

        {/* Error Message banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-xs text-red-600"
          >
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Google Authentication Option */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin h-5 w-5 text-slate-400" />
          ) : (
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span className="text-slate-700 font-medium text-sm">
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </span>
        </button>

        {/* Integrity Notice */}
        <p className="text-[10px] text-slate-400 text-center mt-8 font-light select-none leading-relaxed">
          By continuing, you agree to comply with your university's academic integrity policies.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
