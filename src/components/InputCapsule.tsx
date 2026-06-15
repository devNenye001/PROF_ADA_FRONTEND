import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Paperclip, X } from "lucide-react";
import { motion } from "framer-motion";
import { useSpeechToText } from "../utils/ai";

interface InputCapsuleProps {
  onSendMessage: (message: string, file?: { name: string; type: string; dataUrl: string }) => void;
  isLoading?: boolean;
}

export const InputCapsule: React.FC<InputCapsuleProps> = ({
  onSendMessage,
  isLoading = false,
}) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: string;
    dataUrl: string;
  } | null>(null);

  const { startListening } = useSpeechToText();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() || attachedFile) {
      onSendMessage(message, attachedFile || undefined);
      setMessage("");
      setAttachedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedFile({
            name: file.name,
            type: file.type,
            dataUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMicrophone = async () => {
    try {
      setIsListening(true);
      const transcript = await startListening();
      if (transcript) {
        setMessage(transcript);
      }
    } catch (error) {
      console.error("Speech recognition failed:", error);
    } finally {
      setIsListening(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-t border-slate-100 bg-white/80 backdrop-blur-md flex justify-center w-full flex-shrink-0"
    >
      <div className="w-full max-w-3xl flex items-end gap-2.5 bg-slate-50 hover:bg-slate-100/60 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-500/20 border border-slate-200/80 focus-within:border-orange-500/50 rounded-[24px] px-4 py-2.5 transition-all duration-300 shadow-sm">
        
        {/* Attachment upload button */}
        <div className="flex items-center gap-1 flex-shrink-0 mb-0.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-orange-500 transition-colors flex items-center justify-center active:scale-95"
            title="Attach a file or picture"
          >
            <Paperclip size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.docx,.pptx,.txt"
            className="hidden"
          />
        </div>

        {/* Text area and preview list */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {attachedFile && (
            <div className="flex items-center gap-2.5 p-1.5 bg-slate-200/40 border border-slate-300/30 rounded-xl w-fit max-w-full relative group">
              {attachedFile.type.startsWith("image/") ? (
                <img
                  src={attachedFile.dataUrl}
                  alt={attachedFile.name}
                  className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 bg-orange-100 border border-orange-200 rounded-lg flex items-center justify-center text-orange-700 font-bold text-[10px] uppercase">
                  {attachedFile.name.split(".").pop() || "file"}
                </div>
              )}
              <div className="flex flex-col min-w-0 pr-6">
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px] sm:max-w-[200px]">
                  {attachedFile.name}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">Ready to send</span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="absolute right-1 top-1 p-0.5 bg-slate-200 hover:bg-red-500 hover:text-white text-slate-500 rounded-full transition-colors"
                title="Remove attachment"
              >
                <X size={10} />
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Prof. Ada anything..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-slate-800 placeholder-slate-400 resize-none max-h-[160px] min-h-[24px] py-1 custom-scrollbar leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 mb-0.5">
          <button
            onClick={handleMicrophone}
            disabled={isLoading || isListening}
            className="p-2 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-orange-500 transition-colors disabled:opacity-50 flex items-center justify-center active:scale-95"
            title="Voice input"
          >
            <Mic
              size={18}
              className={
                isListening ? "text-orange-500 animate-pulse" : ""
              }
            />
          </button>

          <button
            onClick={handleSend}
            disabled={(!message.trim() && !attachedFile) || isLoading}
            className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
              (message.trim() || attachedFile) && !isLoading
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-sm active:scale-95 cursor-pointer"
                : "text-slate-300 bg-slate-200/60 cursor-not-allowed"
            }`}
            title="Send message"
            style={{ width: "32px", height: "32px" }}
          >
            <Send size={14} className={(message.trim() || attachedFile) && !isLoading ? "text-white" : ""} />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default InputCapsule;
