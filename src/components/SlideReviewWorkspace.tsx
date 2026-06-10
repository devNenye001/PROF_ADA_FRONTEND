import React from "react";
import { Document } from "../types";
import { LayoutTemplate, Maximize2, AlertOctagon, Target } from "lucide-react";
import { motion } from "framer-motion";

interface SlideReviewWorkspaceProps {
  document?: Document;
  onHighlightRequest?: (sectionId: string) => void;
}

export const SlideReviewWorkspace: React.FC<SlideReviewWorkspaceProps> = ({
  document,
  onHighlightRequest,
}) => {
  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Select a presentation to review.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
      <div className="p-6 border-b border-slate-200 bg-white">
        <h2 className="font-dm-sans text-xl font-normal tracking-wide text-slate-900 mb-1">
          Slide Review: {document.name}
        </h2>
        <p className="text-sm text-slate-500">
          Analysis of structure, content density, and presentation duration.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Structure Analysis */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <LayoutTemplate className="text-purple-600 w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wider text-purple-800 uppercase">Structure</h3>
          </div>
          <div className="space-y-3 bg-purple-50 border border-purple-100 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-900 font-medium">Title Slide</span>
              <span className="text-emerald-600 text-[10px] font-bold bg-emerald-100 px-2 py-0.5 rounded uppercase">Pass</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-900 font-medium">Introduction (2 slides)</span>
              <span className="text-emerald-600 text-[10px] font-bold bg-emerald-100 px-2 py-0.5 rounded uppercase">Pass</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-900 font-medium">Methodology (1 slide)</span>
              <span className="text-orange-600 text-[10px] font-bold bg-orange-100 px-2 py-0.5 rounded uppercase">Short</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-900 font-medium">Results (5 slides)</span>
              <span className="text-emerald-600 text-[10px] font-bold bg-emerald-100 px-2 py-0.5 rounded uppercase">Pass</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-purple-200 pt-3 mt-3">
              <span className="text-purple-900 font-medium">Conclusion (0 slides)</span>
              <span className="text-red-600 text-[10px] font-bold bg-red-100 px-2 py-0.5 rounded uppercase">Missing</span>
            </div>
          </div>
        </motion.div>

        {/* Warnings Panel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="text-red-500 w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wider text-red-700 uppercase">Overloaded Slides</h3>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800 hover:bg-red-100/50 transition-colors cursor-pointer shadow-sm" onClick={() => onHighlightRequest?.("slide-4")}>
              <div className="font-bold text-red-700 mb-1">Slide 4: Literature Review</div>
              <p className="text-xs">Too much text (150 words). Reduce bullet points to 4-5 items maximum. Move details to speaker notes.</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800 hover:bg-red-100/50 transition-colors cursor-pointer shadow-sm" onClick={() => onHighlightRequest?.("slide-8")}>
              <div className="font-bold text-red-700 mb-1">Slide 8: Data Architecture</div>
              <p className="text-xs">Diagram is too complex for a single slide. Consider breaking it down into 2-3 progressive slides.</p>
            </div>
          </div>
        </motion.div>

        {/* Presentation Readiness Panel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-cyan-600 w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wider text-cyan-800 uppercase">Presentation Readiness</h3>
          </div>
          <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl space-y-3 shadow-sm">
            <div>
              <div className="flex justify-between text-xs text-cyan-900 font-medium mb-1.5">
                <span>Estimated Duration</span>
                <span>~18 mins</span>
              </div>
              <div className="w-full bg-cyan-200 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-cyan-700 mt-2 font-medium">Slightly over the 15-minute target.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SlideReviewWorkspace;
