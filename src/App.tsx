import React, { useState, useEffect } from "react";
import { AmbientBackground } from "./components/AmbientBackground";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { MainWorkspace } from "./components/MainWorkspace";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { api } from "./utils/api";
import { Loader2 } from "lucide-react";
import { supabase } from "./utils/supabase";
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



  // Supabase session handling
  useEffect(() => {
    // Check initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setAppState("workspace");
        // We still put it in localStorage so the API interceptor easily grabs it
        localStorage.setItem("prof-ada-access-token", session.access_token);
      }
    });

    // Listen for Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user?.email) {
        localStorage.setItem("prof-ada-access-token", session.access_token);
        setUserEmail(session.user.email);
        setAppState("workspace");
        setVerificationError(null);
        // Clean up the URL hash left by Supabase OAuth
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem("prof-ada-access-token");
        setUserEmail(null);
        setAppState("landing");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Listen for logout events from the API client to transition state gracefully without page refresh
  useEffect(() => {
    const handleAuthLogout = () => {
      handleLogout();
    };
    window.addEventListener("prof-ada-logout", handleAuthLogout);
    return () => {
      window.removeEventListener("prof-ada-logout", handleAuthLogout);
    };
  }, []);

  const handleStartConversation = () => {
    setAppState("auth");
  };

  const handleLoginSuccess = (email: string, accessToken: string, refreshToken: string) => {
    localStorage.setItem("prof-ada-access-token", accessToken);
    localStorage.setItem("prof-ada-refresh-token", refreshToken);
    localStorage.setItem("prof-ada-user-email", email);
    
    setUserEmail(email);
    setAppState("workspace");
  };

  const handleLogout = () => {
    localStorage.removeItem("prof-ada-access-token");
    localStorage.removeItem("prof-ada-refresh-token");
    localStorage.removeItem("prof-ada-user-email");
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
