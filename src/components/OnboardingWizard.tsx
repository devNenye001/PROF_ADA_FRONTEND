import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2, Library, BookOpen, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const LEVELS = ["100", "200", "300", "400"];

const PROJECT_STATUSES = [
  "Looking for Topic",
  "Writing Proposal",
  "Chapter 1",
  "Chapter 2",
  "Chapter 3",
  "Chapter 4",
  "Chapter 5",
  "Preparing Presentation",
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [level, setLevel] = useState("");
  const [projectStatus, setProjectStatus] = useState("");

  const TOTAL_STEPS = 4;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("prof-ada-academic-level", level);
      localStorage.setItem("prof-ada-project-status", projectStatus);
      onComplete?.();
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1 && !level) return true;
    if (currentStep === 2 && !projectStatus) return true;
    return false;
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
                      Setup {currentStep + 1} / {TOTAL_STEPS}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
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
                          Your personal AI academic supervisor. Before we start
                          your research journey, let's tailor the experience to
                          your specific academic needs.
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
                        <h2 className="font-dm-sans text-2xl font-light tracking-tight text-slate-900 mb-2">
                          What is your Level?
                        </h2>
                        <p className="text-slate-500 text-sm mb-6 font-medium">
                          Prof. Ada adjusts the complexity of feedback based on
                          your academic level.
                        </p>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                          {LEVELS.map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => setLevel(lvl)}
                              className={`p-3 rounded-xl border text-sm transition-all text-center font-medium ${
                                level === lvl
                                  ? "bg-blue-50 border-blue-300 text-blue-800 shadow-sm shadow-blue-500/10"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="font-dm-sans text-2xl font-light tracking-tight text-slate-900 mb-2">
                          Current Project Status
                        </h2>
                        <p className="text-slate-500 text-sm mb-6 font-medium">
                          Where are you currently in your research journey?
                        </p>
                        <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                          {PROJECT_STATUSES.map((status) => (
                            <button
                              key={status}
                              onClick={() => setProjectStatus(status)}
                              className={`p-3 rounded-xl border text-sm transition-all text-left flex items-center gap-3 font-medium ${
                                projectStatus === status
                                  ? "bg-purple-50 border-purple-300 text-purple-800 shadow-sm shadow-purple-500/10"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  projectStatus === status
                                    ? "bg-purple-500 shadow-sm"
                                    : "bg-slate-300"
                                }`}
                              />
                              {status}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center text-center mt-8"
                      >
                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-200 shadow-sm">
                          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="font-dm-sans text-3xl font-light tracking-tight text-slate-900 mb-4">
                          You're All Set!
                        </h2>
                        <p className="text-slate-600 text-sm max-w-md leading-relaxed mb-6 font-medium">
                          Prof. Ada is now customized for a {level} level student, currently focusing on {projectStatus}.
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                          <span className="flex items-center gap-1.5"><Library size={14} className="text-slate-400"/> {level}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="flex items-center gap-1.5"><Layers size={14} className="text-slate-400"/> {projectStatus}</span>
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
                    disabled={isNextDisabled()}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 text-sm font-semibold active:scale-95 ${
                      isNextDisabled()
                        ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200"
                        : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-md shadow-orange-500/20"
                    }`}
                  >
                    {currentStep === 0 ? (
                      "Get Started"
                    ) : currentStep === TOTAL_STEPS - 1 ? (
                      "Go to Workspace"
                    ) : (
                      <>
                        Next
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
