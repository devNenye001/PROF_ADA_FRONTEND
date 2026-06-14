import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2, Library, FileText, MessageSquare, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const TOTAL_STEPS = 2;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("prof-ada-onboarding", "true");
      onComplete?.();
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 font-sans"
          >
            <div className="w-full max-w-xl p-0 overflow-hidden shadow-2xl shadow-orange-500/10 bg-white rounded-2xl border border-slate-200">
              <div className="relative p-8">
                {/* Background Aurora Effect inside the card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2" />

                {/* Header / Progress */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Welcome {currentStep + 1} / {TOTAL_STEPS}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem("prof-ada-onboarding", "true");
                      onClose();
                    }}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X size={18} className="text-slate-400 hover:text-slate-800" />
                  </button>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%`,
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400"
                  />
                </div>

                {/* Content Container */}
                <div className="min-h-[280px]">
                  <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center text-center mt-8"
                      >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-6 border border-orange-200 shadow-sm">
                          <Library className="w-10 h-10 text-orange-600" />
                        </div>
                        <h2 className="font-dm-sans text-3xl font-light tracking-tight text-slate-900 mb-4">
                          Welcome to Prof. Ada
                        </h2>
                        <p className="text-slate-600 text-sm max-w-md leading-relaxed font-medium">
                          Your intelligent academic supervisor designed for both students and lecturers. Whether you're drafting a thesis or reviewing research papers, Prof. Ada accelerates your academic workflow.
                        </p>
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="font-dm-sans text-2xl font-light tracking-tight text-slate-900 mb-6 text-center">
                          Key Features
                        </h2>
                        
                        <div className="flex flex-col gap-4">
                          <div className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-800">Smart Document Review</h3>
                              <p className="text-xs text-slate-500 mt-1">Upload research papers, proposals, or chapters. Get instant, academic-grade feedback on structure and content.</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-800">Context-Aware AI Chat</h3>
                              <p className="text-xs text-slate-500 mt-1">Chat directly with your documents. Ask questions, extract summaries, and generate literature reviews effortlessly.</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                              <Target className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-800">Project Workspaces</h3>
                              <p className="text-xs text-slate-500 mt-1">Organize your academic life into distinct projects. Keep your chats and documents perfectly categorized.</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Footer */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-sm font-bold ${
                      currentStep === 0
                        ? "opacity-0 pointer-events-none"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 text-sm font-semibold active:scale-95 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-md shadow-orange-500/20"
                  >
                    {currentStep === 0 ? (
                      "View Features"
                    ) : (
                      <>
                        Go to Workspace
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingWizard;
