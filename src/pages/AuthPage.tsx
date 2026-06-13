import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../utils/api";

declare global {
  interface Window {
    google?: any;
  }
}

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

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    if (!idToken) return;

    setIsGoogleLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/google", { idToken });
      if (res.data && res.data.success) {
        const { user, accessToken, refreshToken } = res.data.data;
        onLoginSuccess(user.email, accessToken, refreshToken);
      } else {
        setError("Failed to authenticate with Google. Please try again.");
      }
    } catch (err: any) {
      console.error("Google login backend error:", err);
      const msg = err.response?.data?.error?.message || "Could not connect to authentication server.";
      setError(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleInitialized = React.useRef(false);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && !googleInitialized.current) {
        googleInitialized.current = true;
        window.google.accounts.id.initialize({
          client_id: "768174706709-btt2aj8hq0cdarr69d717l7u4e2oieqi.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          auto_select: false,
        });
        const container = document.getElementById("google-signin-btn");
        if (container) {
          window.google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            width: 320,
            text: "continue_with",
            shape: "rectangular",
          });
        }
      }
    };

    if (window.google) {
      initializeGoogle();
    } else if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    }
  }, []);

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
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div id="google-signin-btn" className="w-full flex justify-center min-h-[44px]"></div>
          
          {isGoogleLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-light mt-2">
              <Loader2 className="animate-spin h-4 w-4 text-orange-500" />
              <span>Verifying credentials...</span>
            </div>
          )}
        </div>

        {/* Integrity Notice */}
        <p className="text-[10px] text-slate-400 text-center mt-8 font-light select-none leading-relaxed">
          By continuing, you agree to comply with your university's academic integrity policies.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
