import React from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon } from "lucide-react";
import { GlassmorphicPanel } from "./GlassmorphicPanel";
import { AudioBubble } from "./AudioBubble";
import { Message, Document } from "../types";

interface ChatMessageProps {
  message: Message;
  onSelectDocument?: (doc: Document) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectDocument }) => {
  const isStudent = message.role === "student";

  const getFileIcon = (ext: string) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    switch (ext) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-500`} />;
      case "docx":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "pptx":
        return <FileText className={`${iconClass} text-orange-500`} />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
        return <ImageIcon className={`${iconClass} text-emerald-500`} />;
      default:
        return <FileText className={`${iconClass} text-slate-400`} />;
    }
  };

  const renderAttachment = (file: { name: string; type: string; dataUrl?: string }) => {
    const isImage = file.type.startsWith("image/");
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const docType = isImage ? "image" : (["pdf", "docx", "pptx", "txt"].includes(ext) ? (ext as any) : "txt");

    return (
      <div 
        onClick={() => {
          if (onSelectDocument) {
            onSelectDocument({
              id: "msg-doc-" + message.id,
              name: file.name,
              type: docType,
              uploadedAt: new Date(message.timestamp),
              dataUrl: file.dataUrl,
            });
          }
        }}
        className="flex items-center gap-3 p-3 bg-white/90 hover:bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer transition-all shadow-sm max-w-xs mt-1.5 select-none"
      >
        <div className="w-9 h-9 bg-slate-100 border border-slate-200/50 rounded-lg flex items-center justify-center flex-shrink-0">
          {getFileIcon(ext)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
          <p className="text-[10px] text-slate-400 font-medium">Click to review in pane</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isStudent ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex flex-col ${isStudent ? "items-end" : "items-start"} max-w-[85%] sm:max-w-md`}
      >
        {isStudent ? (
          <GlassmorphicPanel className="p-4 sm:p-5 bg-orange-500/10 border-orange-500/25 text-slate-800 rounded-2xl rounded-tr-none flex flex-col gap-2 shadow-sm select-text w-full">
            {message.content && (
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
            {message.file && renderAttachment(message.file)}
          </GlassmorphicPanel>
        ) : (
          <GlassmorphicPanel className="p-4 sm:p-5 bg-white/70 border border-slate-200/50 rounded-2xl rounded-tl-none flex flex-col gap-2 shadow-sm w-full">
            {message.content && (
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
            {message.file && renderAttachment(message.file)}
            {message.hasAudio && <AudioBubble text={message.content} />}
          </GlassmorphicPanel>
        )}
        <span className="text-xs text-slate-400 mt-1.5 font-medium">
          {(typeof message.timestamp === "string" ? new Date(message.timestamp) : message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
