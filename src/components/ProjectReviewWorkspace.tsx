import React from "react";
import { Document } from "../types";
import { CheckCircle2, AlertTriangle, FileWarning, PenTool, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectReviewWorkspaceProps {
  document?: Document;
  onHighlightRequest?: (sectionId: string) => void;
}

export const ProjectReviewWorkspace: React.FC<ProjectReviewWorkspaceProps> = ({
  document,
  onHighlightRequest,
}) => {
  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Select a document from the sidebar to review.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
      <div className="p-6 border-b border-slate-200 bg-white">
        <h2 className="font-dm-sans text-xl font-normal tracking-wide text-slate-900 mb-1">
          Review: {document.name}
        </h2>
        <p className="text-sm text-slate-500">
          Comprehensive analysis of your chapter structure, argument flow, and academic tone.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Strengths */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="text-emerald-500 w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wider text-emerald-700 uppercase">Strengths</h3>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800 hover:bg-emerald-100/50 transition-colors cursor-pointer shadow-sm" onClick={() => onHighlightRequest?.("s1")}>
              <div className="flex justify-between items-start gap-4">
                <span>Strong theoretical framework setup in the introduction.</span>
                <ArrowRight size={14} className="text-emerald-500 mt-1" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weaknesses */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-orange-500 w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wider text-orange-700 uppercase">Weaknesses</h3>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800 hover:bg-orange-100/50 transition-colors cursor-pointer shadow-sm" onClick={() => onHighlightRequest?.("w1")}>
              <div className="flex justify-between items-start gap-4">
                <span>The methodology justification is brief and lacks recent citations (post-2022).</span>
                <ArrowRight size={14} className="text-orange-500 mt-1" />
              </div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800 hover:bg-orange-100/50 transition-colors cursor-pointer shadow-sm" onClick={() => onHighlightRequest?.("w2")}>
              <div className="flex justify-between items-start gap-4">
                <span>Inconsistent use of terminology (e.g., swapping between "AI model" and "Neural Network").</span>
                <ArrowRight size={14} className="text-orange-500 mt-1" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Missing Components */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-3">
            <FileWarning className="text-red-500 w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wider text-red-700 uppercase">Missing Components</h3>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800 hover:bg-red-100/50 transition-colors cursor-pointer shadow-sm" onClick={() => onHighlightRequest?.("m1")}>
              <div className="flex justify-between items-start gap-4">
                <span>No dedicated section for "Limitations of Study" before the conclusion.</span>
                <ArrowRight size={14} className="text-red-500 mt-1" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Corrections */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-2 mb-3">
            <PenTool className="text-blue-500 w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wider text-blue-700 uppercase">Corrections</h3>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 hover:bg-blue-100/50 transition-colors cursor-pointer shadow-sm" onClick={() => onHighlightRequest?.("c1")}>
              <div className="flex justify-between items-start gap-4">
                <span>Grammar: "The datas shows..." should be "The data show..."</span>
                <ArrowRight size={14} className="text-blue-500 mt-1" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectReviewWorkspace;
