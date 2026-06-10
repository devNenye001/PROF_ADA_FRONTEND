import React, { useState } from "react";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Document, Highlight } from "../types";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document?: Document;
  content?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  document,
  content = `# Your Document Title

## Chapter 1: Introduction

This is your document content. When Prof. Ada reviews your work, 
she will highlight sections that need attention with glowing markers.

### Section 1.1: Background
Your background information goes here. Prof. Ada will provide detailed 
feedback on clarity, argumentation, and academic rigor.

### Section 1.2: Research Question
State your research question clearly and concisely.

## Chapter 2: Literature Review

Review relevant papers and studies in your field.

---

*Prof. Ada will mark corrections and suggestions directly in the document.*`,
}) => {
  const [expandedHighlight, setExpandedHighlight] = useState<string | null>(
    null,
  );

  const mockHighlights: Highlight[] = [
    {
      id: "1",
      lineNumber: 5,
      text: "This is your document content...",
      type: "suggestion",
      message: "Consider adding more specific context here",
    },
    {
      id: "2",
      lineNumber: 12,
      text: "State your research question...",
      type: "warning",
      message:
        "Your research question needs to be more specific and measurable",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-1/2 bg-white/70 backdrop-blur-md flex flex-col z-50 border-l border-slate-200/50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/40 bg-white/40 backdrop-blur-sm">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {document?.name || "Document Viewer"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Prof. Ada's Review</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const element = window.document.createElement("a");
                    if (document?.dataUrl) {
                      element.href = document.dataUrl;
                      element.download = document.name;
                    } else {
                      const file = new Blob([content], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = document?.name ? document.name.replace(/\.[^/.]+$/, "") + "_review.txt" : "review.txt";
                    }
                    window.document.body.appendChild(element);
                    element.click();
                    window.document.body.removeChild(element);
                  }}
                  className="p-1.5 hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Download File"
                >
                  <Download size={15} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 hover:text-slate-800"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
              {(() => {
                const isImage = document?.type === "image" || 
                                document?.type === "png" || 
                                document?.type === "jpg" || 
                                document?.type === "jpeg" || 
                                (document?.name && /\.(png|jpe?g|gif|webp|svg)$/i.test(document.name)) ||
                                document?.dataUrl?.startsWith("data:image/");

                let displayContent = content;
                if (document?.dataUrl && document.dataUrl.startsWith("data:text/")) {
                  try {
                    const base64Data = document.dataUrl.split(",")[1];
                    displayContent = atob(base64Data);
                  } catch (e) {
                    console.error("Failed to decode text document", e);
                  }
                }

                if (isImage) {
                  return (
                    <div className="flex flex-col items-center justify-center mb-6">
                      <div className="border border-slate-200/50 rounded-xl overflow-hidden shadow-md bg-white p-2.5 max-w-full">
                        <img 
                          src={document?.dataUrl} 
                          alt={document?.name} 
                          className="max-w-full max-h-[380px] object-contain rounded-lg"
                        />
                      </div>
                      <div className="mt-5 p-4 bg-orange-500/5 border border-orange-200/30 rounded-xl w-full text-xs text-slate-700 shadow-sm backdrop-blur-sm">
                        <p className="font-bold text-orange-800 mb-1 flex items-center gap-1">
                          <span>🔍</span> Diagram & Slide Review Feedback
                        </p>
                        <p className="leading-relaxed text-slate-600">
                          Prof. Ada has analyzed your upload: <strong>{document?.name}</strong>. The visual layout and diagram notation are correct. Recommendations: Ensure system boundaries are clearly identified, label all relationship lines in the use case diagrams, and keep slide text concise for your presentation.
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="prose max-w-none mb-6 text-sm">
                    {displayContent.split("\n").map((line, idx) => {
                      const highlight = mockHighlights.find(
                        (h) => h.lineNumber === idx,
                      );
                      return (
                        <div
                          key={idx}
                          className={`mb-2 p-2 rounded transition-all ${
                            highlight
                              ? "border-2 border-orange-200 bg-orange-50/50"
                              : ""
                          }`}
                        >
                          <p className="text-slate-700 leading-relaxed">{line}</p>
                          {highlight && (
                            <motion.button
                              onClick={() =>
                                setExpandedHighlight(
                                  expandedHighlight === highlight.id
                                    ? null
                                    : highlight.id,
                                )
                              }
                              className="mt-2 text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                            >
                              {expandedHighlight === highlight.id
                                ? "▼ Hide feedback"
                                : "▶ Show feedback"}
                            </motion.button>
                          )}
                          <AnimatePresence>
                            {highlight && expandedHighlight === highlight.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mt-2 p-3 rounded-lg text-xs ${
                                  highlight.type === "warning"
                                    ? "bg-amber-50 text-amber-800 border border-amber-200 shadow-sm"
                                    : "bg-blue-50 text-blue-800 border border-blue-200 shadow-sm"
                                }`}
                              >
                                <p className="font-bold mb-1">
                                  {highlight.type === "warning"
                                    ? "⚠ Warning"
                                    : "💡 Suggestion"}
                                </p>
                                <p>{highlight.message}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Highlights Summary */}
              <div className="p-4 bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-sm">
                <h3 className="font-dm-sans text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
                  Review Summary
                </h3>
                <div className="space-y-2">
                  {mockHighlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-sm"
                    >
                      <p className="font-dm-sans text-slate-800 font-semibold mb-1">
                        {highlight.type === "warning"
                          ? "⚠ Warning"
                          : "💡 Suggestion"}
                      </p>
                      <p className="text-slate-600 font-light">{highlight.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DocumentViewer;
