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
  const [isVerifying, setIsVerifying] = useState(true); // Default to true while checking session
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
      if (session?.user) {
        setUserEmail(session.user.email || "student@university.edu");
        setAppState("workspace");
        localStorage.setItem("prof-ada-access-token", session.access_token);
      }
      setIsVerifying(false);
    });

    // Listen for Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        localStorage.setItem("prof-ada-access-token", session.access_token);
        setUserEmail(session.user.email || "student@university.edu");
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
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
          </div>
        ) : appState === "landing" ? (
          <LandingPage 
            onStartConversation={handleStartConversation} 
          />
        ) : appState === "auth" ? (
          <AuthPage
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
