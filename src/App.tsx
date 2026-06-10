import React, { useState, useEffect } from "react";
import { AmbientBackground } from "./components/AmbientBackground";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { MainWorkspace } from "./components/MainWorkspace";
import { OnboardingWizard } from "./components/OnboardingWizard";
import "./styles/global.css";

type AppState = "landing" | "auth" | "workspace";

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedEmail = localStorage.getItem("prof-ada-user-email");
    if (storedEmail) {
      setUserEmail(storedEmail);
      setAppState("workspace");
    }
  }, []);

  // Check if user has seen onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("prof-ada-onboarding");
    if (appState === "workspace" && !hasSeenOnboarding) {
      setShowOnboarding(true);
      localStorage.setItem("prof-ada-onboarding", "true");
    }
  }, [appState]);

  const handleStartConversation = () => {
    setAppState("auth");
  };

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem("prof-ada-user-email", email);
    setUserEmail(email);
    localStorage.removeItem("prof-ada-onboarding");
    setShowOnboarding(true);
    setAppState("workspace");
  };

  const handleLogout = () => {
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
        {appState === "landing" ? (
          <LandingPage 
            onStartConversation={handleStartConversation} 
          />
        ) : appState === "auth" ? (
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setAppState("landing")}
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
