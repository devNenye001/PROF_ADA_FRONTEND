import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { Message, Document } from "../types";

interface ChatAreaProps {
  messages: Message[];
  isLoading?: boolean;
  onSelectDocument?: (doc: Document) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading = false,
  onSelectDocument,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent border-r border-slate-200 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <h2 className="font-dm-sans text-2xl font-light tracking-tight text-slate-900 mb-2">
              Ready to learn?
            </h2>
            <p className="text-slate-500 text-sm">
              Ask Prof. Ada anything about your research project
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onSelectDocument={onSelectDocument} 
            />
          ))}
          {isLoading && (
            <div className="flex items-center text-slate-500 bg-white/70 backdrop-blur-sm p-4 rounded-2xl w-fit shadow-sm border border-slate-200/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;
