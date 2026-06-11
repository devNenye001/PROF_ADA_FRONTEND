import React, { useState } from "react";
import { Shield, Library, User } from "lucide-react";

const LEVELS = ["100", "200", "300", "400"];

export const SettingsPage: React.FC = () => {
  const [name, setName] = useState(() => localStorage.getItem("prof-ada-user-name") || "Alex Student");
  const [email] = useState(() => localStorage.getItem("prof-ada-user-email") || "student@university.edu");
  const [level, setLevel] = useState(() => localStorage.getItem("prof-ada-academic-level") || "100");
  const [socraticMode, setSocraticMode] = useState(() => localStorage.getItem("prof-ada-socratic-mode") !== "false"); // default true
  const [plagiarismCheck, setPlagiarismCheck] = useState(() => localStorage.getItem("prof-ada-plagiarism-check") === "true");

  const handleNameChange = (val: string) => {
    setName(val);
    localStorage.setItem("prof-ada-user-name", val);
  };

  const handleLevelChange = (val: string) => {
    setLevel(val);
    localStorage.setItem("prof-ada-academic-level", val);
  };

  const toggleSocratic = () => {
    const val = !socraticMode;
    setSocraticMode(val);
    localStorage.setItem("prof-ada-socratic-mode", val.toString());
  };

  const togglePlagiarism = () => {
    const val = !plagiarismCheck;
    setPlagiarismCheck(val);
    localStorage.setItem("prof-ada-plagiarism-check", val.toString());
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full custom-scrollbar">
      <div className="mb-8">
        <h1 className="font-dm-sans text-3xl font-light tracking-tight text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your profile details, guidance style, and workspace preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings Section */}
        <div className="p-6 rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-sm shadow-slate-100/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 border border-orange-200/20">
              <User size={20} />
            </div>
            <h2 className="font-dm-sans text-lg font-normal tracking-wide text-slate-900">Academic Profile</h2>
          </div>
          
          <div className="space-y-6">
            {/* Full Name & Email grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white/40 border border-slate-200/40 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none focus:bg-white/80 transition-all duration-300 shadow-inner" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  disabled
                  title="Your email address is managed by your account and cannot be modified."
                  className="w-full bg-slate-100/50 border border-slate-200/30 rounded-xl px-4 py-3 text-sm text-slate-400 font-medium cursor-not-allowed select-none" 
                />
              </div>
            </div>

            {/* Academic Level */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Library size={12} />
                Academic Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={`p-3 rounded-xl border text-sm transition-all duration-300 text-center font-semibold ${
                      level === lvl
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-800 shadow-sm"
                        : "bg-white/40 border-slate-200/50 text-slate-600 hover:bg-white/80 hover:border-slate-300/60"
                    }`}
                  >
                    {lvl} Level
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Integrity Settings */}
        <div className="p-6 rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-sm shadow-slate-100/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-200/20">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-dm-sans text-lg font-normal tracking-wide text-slate-900">Academic Integrity</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">Configure how Prof. Ada assists you while maintaining academic standards.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Socratic toggle */}
            <div className="flex items-center justify-between p-5 bg-white/40 border border-slate-200/30 rounded-xl shadow-sm hover:bg-white/60 transition-all duration-300">
              <div>
                <div className="text-sm font-bold text-slate-800">Socratic Questioning Mode</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Force AI to ask guiding questions rather than providing direct answers.</div>
              </div>
              <button
                onClick={toggleSocratic}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 border shadow-inner ${
                  socraticMode 
                    ? "bg-emerald-500 border-emerald-600 text-white" 
                    : "bg-slate-300 border-slate-400 text-slate-400"
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-350 ${
                    socraticMode ? "left-7" : "left-1"
                  }`} 
                />
              </button>
            </div>

            {/* Plagiarism check toggle */}
            <div className="flex items-center justify-between p-5 bg-white/40 border border-slate-200/30 rounded-xl shadow-sm hover:bg-white/60 transition-all duration-300">
              <div>
                <div className="text-sm font-bold text-slate-800">Plagiarism Pre-Check</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Automatically scan uploaded drafts for potential citation issues.</div>
              </div>
              <button
                onClick={togglePlagiarism}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 border shadow-inner ${
                  plagiarismCheck 
                    ? "bg-emerald-500 border-emerald-600 text-white" 
                    : "bg-slate-300 border-slate-400 text-slate-400"
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-350 ${
                    plagiarismCheck ? "left-7" : "left-1"
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
