import React, { useState } from "react";
import { 
  FileText, Plus, X, FolderGit2, UploadCloud, 
  Settings, GraduationCap, MessageSquare, Trash2, User, LogOut
} from "lucide-react";
import { motion } from "framer-motion";
import { Document, Conversation } from "../types";

export type SidebarTab = "chat" | "projects" | "files" | "settings";

interface LeftSidebarProps {
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
  onUploadClick?: () => void;
  selectedDocId?: string;
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  userEmail: string;
  onLogout: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  documents,
  onSelectDocument,
  onUploadClick,
  selectedDocId,
  activeTab,
  onTabChange,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  userEmail,
  onLogout,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getFileIcon = (type: string) => {
    const iconClass = "w-4 h-4 flex-shrink-0";
    switch (type) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-500`} />;
      case "docx":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "pptx":
        return <FileText className={`${iconClass} text-orange-500`} />;
      default:
        return <FileText className={`${iconClass} text-slate-400`} />;
    }
  };

  const bottomMenuItems = [
    { id: "projects" as SidebarTab, icon: FolderGit2, label: "Projects" },
    { id: "files" as SidebarTab, icon: UploadCloud, label: "Uploaded Files" },
    { id: "settings" as SidebarTab, icon: Settings, label: "Settings" },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0, width: isCollapsed ? 70 : 260 }}
      transition={{ duration: 0.3 }}
      className="m-4 rounded-2xl flex flex-col transition-all overflow-hidden border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-sm shadow-slate-100/30"
    >
      {/* Header / Logo */}
      <div className="p-4 border-b border-slate-200/40 flex items-center justify-between bg-white/30 backdrop-blur-sm flex-shrink-0 animate-in fade-in duration-300">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
              <GraduationCap className="w-4 h-4 text-orange-600 animate-pulse-soft" />
            </div>
            <span className="font-dm-sans font-semibold text-slate-950 tracking-wide bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Prof. Ada
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-200/50 rounded-lg transition-colors text-slate-500 hover:text-slate-900 mx-auto md:mx-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <GraduationCap size={18} /> : <X size={16} />}
        </button>
      </div>

      {/* New Conversation Button */}
      <div className="p-3 border-b border-slate-200/30 flex-shrink-0">
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-medium text-sm shadow-sm ${
            isCollapsed 
              ? "px-0 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 h-10 w-10 mx-auto" 
              : "px-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-450 text-white border border-orange-500/20 active:scale-[0.98] hover:shadow-md hover:shadow-orange-500/10"
          }`}
          title="New Conversation"
        >
          <Plus size={16} className="shrink-0" />
          {!isCollapsed && <span className="font-dm-sans font-semibold">New Conversation</span>}
        </button>
      </div>

      {/* Chat History List */}
      {!isCollapsed ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar min-h-0">
          <div className="text-[10px] font-dm-sans font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center justify-between select-none">
            <span>Recent Chats</span>
            <span className="text-[9px] bg-slate-200/60 backdrop-blur-sm text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
              {conversations.length}
            </span>
          </div>
          {conversations.length === 0 ? (
            <div className="text-center py-6 px-4">
              <MessageSquare size={16} className="text-slate-300 mx-auto mb-1.5" />
              <p className="text-[10px] text-slate-400 font-medium">No active chats</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = activeTab === "chat" && activeConversationId === conv.id;
              return (
                <div
                  key={conv.id}
                  className={`group w-full relative flex items-center rounded-xl transition-all duration-250 ${
                    isActive
                      ? "bg-orange-500/10 text-orange-800 border border-orange-200/40 shadow-sm backdrop-blur-sm"
                      : "hover:bg-white/40 text-slate-600 hover:text-slate-950 border border-transparent hover:border-slate-200/20"
                  }`}
                >
                  <button
                    onClick={() => onSelectConversation(conv.id)}
                    className="flex-1 text-left p-2.5 flex items-center gap-2.5 min-w-0"
                  >
                    <MessageSquare 
                      size={15} 
                      className={`flex-shrink-0 ${isActive ? "text-orange-600" : "text-slate-400"}`} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-dm-sans text-xs font-normal truncate pr-4">
                        {conv.title || "Untitled Chat"}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="absolute right-2 p-1 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Document List (Compact Accordion/Box at bottom) */}
      {!isCollapsed && documents.length > 0 && (
        <div className="max-h-[150px] border-t border-slate-200/30 p-3 overflow-y-auto space-y-1 bg-white/10 backdrop-blur-sm">
          <div className="text-[9px] font-dm-sans font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
            Recent Files
          </div>
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className={`w-full text-left p-2 rounded-lg transition-all duration-150 flex items-start gap-2 ${
                selectedDocId === doc.id
                  ? "bg-white/60 border border-slate-200/50 text-slate-950 shadow-sm"
                  : "hover:bg-white/30 border border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {getFileIcon(doc.type)}
              <div className="flex-1 min-w-0">
                <p className="font-dm-sans text-[10px] font-normal truncate">
                  {doc.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Menu Items */}
      <div className="p-2.5 border-t border-slate-200/30 space-y-0.5 bg-white/20 flex-shrink-0">
        {bottomMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm ${
              activeTab === item.id
                ? "bg-orange-500/10 text-orange-800 border border-orange-200/30 shadow-sm backdrop-blur-sm"
                : "text-slate-600 hover:bg-white/40 hover:text-slate-950 border border-transparent"
            } ${isCollapsed ? "justify-center px-0" : "justify-start"}`}
            title={isCollapsed ? item.label : ""}
          >
            <item.icon size={16} className={activeTab === item.id ? "text-orange-600" : ""} />
            {!isCollapsed && <span className="font-dm-sans font-normal text-xs">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Account Info and Logout */}
      <div className="p-3 border-t border-slate-200/30 bg-white/30 backdrop-blur-sm flex-shrink-0 flex items-center gap-2.5">
        {isCollapsed ? (
          <button 
            onClick={onLogout}
            className="p-2 bg-white/60 backdrop-blur-sm hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200/50 hover:border-red-200 rounded-xl transition-all shadow-sm mx-auto flex items-center justify-center h-10 w-10 active:scale-95"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        ) : (
          <div className="flex items-center justify-between w-full min-w-0 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 flex-shrink-0 shadow-inner">
                <User size={15} className="text-orange-700" />
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none select-none">Account</span>
                <span className="text-[11px] font-semibold text-slate-700 truncate mt-0.5" title={userEmail}>
                  {userEmail}
                </span>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-600 border border-transparent hover:border-red-500/20 rounded-lg transition-colors flex-shrink-0"
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeftSidebar;
