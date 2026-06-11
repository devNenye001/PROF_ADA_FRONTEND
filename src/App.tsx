import React, { useState, useEffect } from "react";
import { AmbientBackground } from "./components/AmbientBackground";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { MainWorkspace } from "./components/MainWorkspace";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { api } from "./utils/api";
import { Loader2 } from "lucide-react";
import "./styles/global.css";

type AppState = "landing" | "auth" | "workspace";

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Check if user has seen onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("prof-ada-onboarding");
    if (appState === "workspace" && !hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem("prof-ada-onboarding", "true");
    }
  }, [appState]);

  // Check magic link token on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    
    if (token) {
      setIsVerifying(true);
      setVerificationError(null);
      setAppState("auth");
      
      api.get(`/auth/email/verify?token=${token}`)
        .then((res) => {
          if (res.data.success) {
            const { user, accessToken, refreshToken } = res.data.data;
            
            localStorage.setItem("prof-ada-access-token", accessToken);
            localStorage.setItem("prof-ada-refresh-token", refreshToken);
            localStorage.setItem("prof-ada-user-email", user.email);
            
            // Clean browser address bar
            window.history.replaceState({}, document.title, window.location.pathname);
            
            setUserEmail(user.email);
            localStorage.removeItem("prof-ada-onboarding");
            setShowOnboarding(true);
            setAppState("workspace");
          }
        })
        .catch((err) => {
          console.error("Magic link verification failed:", err);
          const errMsg = err.response?.data?.error?.message || "This link is invalid or has expired. Please request a new one.";
          setVerificationError(errMsg);
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else {
      // Check if user is already logged in
      const storedEmail = localStorage.getItem("prof-ada-user-email");
      const accessToken = localStorage.getItem("prof-ada-access-token");
      if (storedEmail && accessToken) {
        setUserEmail(storedEmail);
        setAppState("workspace");
      }
    }
  }, []);

  const handleStartConversation = () => {
    setAppState("auth");
  };

  const handleLoginSuccess = (email: string, accessToken: string, refreshToken: string) => {
    localStorage.setItem("prof-ada-access-token", accessToken);
    localStorage.setItem("prof-ada-refresh-token", refreshToken);
    localStorage.setItem("prof-ada-user-email", email);
    
    setUserEmail(email);
    localStorage.removeItem("prof-ada-onboarding");
    setShowOnboarding(true);
    setAppState("workspace");
  };

  const handleLogout = () => {
    localStorage.removeItem("prof-ada-access-token");
    localStorage.removeItem("prof-ada-refresh-token");
    localStorage.removeItem("prof-ada-user-email");
    localStorage.removeItem("prof-ada-onboarding");
    localStorage.removeItem("prof-ada-active-conversation-id");
    
    setUserEmail(null);
    setAppState("landing");
  };

  return (
    <div className="w-full h-screen bg-themeBg text-themeText transition-colors duration-300">
      <AmbientBackground />

      {/* Main Content */}
      <div className="relative z-10 h-full">
        {isVerifying ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-center font-sans">
            <div className="p-8 rounded-[24px] bg-white border border-slate-200/60 shadow-xl max-w-sm mx-4 flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
              <h1 className="font-dm-sans text-xl font-light text-slate-900 mb-2">Verifying Link</h1>
              <p className="text-sm text-slate-500 font-light">Confirming your academic credentials. Please wait a moment...</p>
            </div>
          </div>
        ) : appState === "landing" ? (
          <LandingPage 
            onStartConversation={handleStartConversation} 
          />
        ) : appState === "auth" ? (
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => {
              setVerificationError(null);
              setAppState("landing");
            }}
            initialError={verificationError}
          />
        ) : appState === "workspace" ? (
          <>
            <MainWorkspace 
              userEmail={userEmail || "student@university.edu"} 
              onLogout={handleLogout} 
            />
            <OnboardingWizard
              isOpen={showOnboarding}
              onClose={() => setShowOnboarding(false)}
              onComplete={() => console.log("Onboarding completed")}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default App;
