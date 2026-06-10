import React, { useState, useEffect } from "react";
import { ChatArea } from "./ChatArea";
import { InputCapsule } from "./InputCapsule";
import { LeftSidebar, SidebarTab } from "./LeftSidebar";
import { DocumentViewer } from "./DocumentViewer";
import { SettingsPage } from "./SettingsPage";
import { ProjectReviewWorkspace } from "./ProjectReviewWorkspace";
import { SlideReviewWorkspace } from "./SlideReviewWorkspace";
import { Message, Document, Conversation } from "../types";
import { generateProfResponse } from "../utils/ai";
import { Sparkles, MessageSquare, ChevronDown, Menu } from "lucide-react";
import { CONTEXT_MODES } from "../utils/constants";

interface MainWorkspaceProps {
  userEmail: string;
  onLogout: () => void;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({ userEmail, onLogout }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>();
  const [activeTab, setActiveTab] = useState<SidebarTab>("chat");
  const [contextMode, setContextMode] = useState("topic-discovery");
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mock and uploaded documents state
  const [documents, setDocuments] = useState<Document[]>(() => {
    const storedDocs = localStorage.getItem("prof-ada-documents");
    if (storedDocs) {
      try {
        return JSON.parse(storedDocs).map((d: any) => ({
          ...d,
          uploadedAt: new Date(d.uploadedAt)
        }));
      } catch (e) {
        console.error("Failed to parse stored documents", e);
      }
    }
    return [
      {
        id: "1",
        name: "Chapter_1_v1.docx",
        type: "docx",
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        name: "Chapter_3.pdf",
        type: "pdf",
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3",
        name: "Slides.pptx",
        type: "pptx",
        uploadedAt: new Date(),
      },
    ];
  });

  // Save documents to local storage when changed
  useEffect(() => {
    localStorage.setItem("prof-ada-documents", JSON.stringify(documents));
  }, [documents]);

  // Load conversations from local storage
  useEffect(() => {
    const stored = localStorage.getItem("prof-ada-conversations");
    let loadedConversations: Conversation[] = [];
    if (stored) {
      try {
        loadedConversations = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse conversations", e);
      }
    }
    
    if (loadedConversations.length === 0) {
      const initialConv: Conversation = {
        id: "chat-" + Date.now(),
        title: "New Conversation",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      loadedConversations = [initialConv];
      localStorage.setItem("prof-ada-conversations", JSON.stringify(loadedConversations));
    }
    
    setConversations(loadedConversations);
    
    const storedActiveId = localStorage.getItem("prof-ada-active-conversation-id");
    if (storedActiveId && loadedConversations.some(c => c.id === storedActiveId)) {
      setActiveConversationId(storedActiveId);
    } else {
      setActiveConversationId(loadedConversations[0].id);
      localStorage.setItem("prof-ada-active-conversation-id", loadedConversations[0].id);
    }
  }, []);

  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    localStorage.setItem("prof-ada-conversations", JSON.stringify(updated));
  };

  const handleSendMessage = async (messageText: string, file?: { name: string; type: string; dataUrl: string }) => {
    if (!activeConversationId) return;

    let attachedDoc: Document | undefined;
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      const docType: Document["type"] = ["pdf", "docx", "pptx", "txt"].includes(fileExtension)
        ? (fileExtension as Document["type"])
        : "image";

      attachedDoc = {
        id: "doc-" + Date.now(),
        name: file.name,
        type: docType,
        uploadedAt: new Date(),
        dataUrl: file.dataUrl,
      };

      setDocuments(prev => [attachedDoc!, ...prev]);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "student",
      content: messageText,
      timestamp: new Date().toISOString(),
      file: file ? {
        name: file.name,
        type: file.type,
        dataUrl: file.dataUrl,
      } : undefined,
    };

    const currentConv = conversations.find(c => c.id === activeConversationId);
    if (!currentConv) return;

    const newMessages = [...currentConv.messages, userMessage];
    
    // Generate new title if it is currently default
    let newTitle = currentConv.title;
    if (
      currentConv.messages.length === 0 || 
      currentConv.title === "New Conversation" || 
      currentConv.title === "Untitled Chat"
    ) {
      if (messageText.trim()) {
        const words = messageText.trim().split(/\s+/);
        newTitle = words.slice(0, 5).join(" ");
      } else if (file) {
        newTitle = `File: ${file.name}`;
      }
      if (newTitle.length > 25) {
        newTitle = newTitle.substring(0, 25) + "...";
      }
    }

    const updatedConv: Conversation = {
      ...currentConv,
      title: newTitle,
      messages: newMessages,
      updatedAt: new Date().toISOString(),
    };

    const updatedConversations = conversations.map(c => 
      c.id === activeConversationId ? updatedConv : c
    );
    saveConversations(updatedConversations);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let responseText = await generateProfResponse(messageText || (file ? `I uploaded ${file.name}` : ""), contextMode);
      if (file) {
        responseText = `I've received your document: **${file.name}**. I have reviewed it and highlighted sections that need attention. You can click on the file preview in the chat to view the detailed annotations in the split pane.\n\n${responseText}`;
      }

      const profMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "prof",
        content: responseText,
        timestamp: new Date().toISOString(),
        hasAudio: Math.random() > 0.5,
      };

      const finalMessages = [...newMessages, profMessage];
      const finalConv: Conversation = {
        ...updatedConv,
        messages: finalMessages,
        updatedAt: new Date().toISOString(),
      };

      const finalConversations = conversations.map(c => 
        c.id === activeConversationId ? finalConv : c
      );
      saveConversations(finalConversations);
      
      // Auto open document viewer for convenience if a file is uploaded
      if (attachedDoc) {
        handleSelectDocument(attachedDoc);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: "chat-" + Date.now(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newConv, ...conversations];
    saveConversations(updated);
    setActiveConversationId(newConv.id);
    localStorage.setItem("prof-ada-active-conversation-id", newConv.id);
    setActiveTab("chat");
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    localStorage.setItem("prof-ada-active-conversation-id", id);
    setActiveTab("chat");
  };

  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter(c => c.id !== id);
    
    if (updated.length === 0) {
      const initialConv: Conversation = {
        id: "chat-" + Date.now(),
        title: "New Conversation",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveConversations([initialConv]);
      setActiveConversationId(initialConv.id);
      localStorage.setItem("prof-ada-active-conversation-id", initialConv.id);
    } else {
      saveConversations(updated);
      if (activeConversationId === id) {
        setActiveConversationId(updated[0].id);
        localStorage.setItem("prof-ada-active-conversation-id", updated[0].id);
      }
    }
  };

  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDocViewerOpen(true);
    if (activeTab === "settings" || activeTab === "files" || activeTab === "projects") {
      setActiveTab("chat");
    }
  };

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConv ? activeConv.messages : [];

  const renderMainContent = () => {
    if (activeTab === "settings") {
      return <SettingsPage />;
    }

    if (activeTab === "projects") {
      return (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Projects view coming soon...
        </div>
      );
    }

    if (activeTab === "files") {
      return (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Uploaded Files view coming soon...
        </div>
      );
    }

    if (contextMode === "chapter-review") {
      return <ProjectReviewWorkspace document={selectedDocument} />;
    }

    if (contextMode === "slide-review") {
      return <SlideReviewWorkspace document={selectedDocument} />;
    }

    // Default chat view (topic-discovery, research-guidance)
    return (
      <div className="flex flex-col flex-1 h-full">
        <ChatArea 
          messages={activeMessages} 
          isLoading={isLoading} 
          onSelectDocument={handleSelectDocument}
        />
        <InputCapsule 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          contextMode={contextMode}
          onContextModeChange={setContextMode}
        />
      </div>
    );
  };

  return (
    <div className="flex h-full bg-slate-50 relative overflow-hidden font-sans">
      {/* Light Aurora Background under Workspace */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[800px] h-[800px] -top-[300px] -left-[200px] bg-orange-100/30 rounded-full blur-3xl" />
        <div className="absolute w-[600px] h-[600px] top-[40%] -right-[300px] bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      {/* Left Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 md:relative md:flex transition-transform duration-300 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <LeftSidebar
          documents={documents}
          onSelectDocument={handleSelectDocument}
          selectedDocId={selectedDocument?.id}
          onUploadClick={() => console.log("Upload clicked")}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            handleSelectConversation(id);
            setIsMobileSidebarOpen(false);
          }}
          onNewConversation={() => {
            handleNewConversation();
            setIsMobileSidebarOpen(false);
          }}
          onDeleteConversation={handleDeleteConversation}
          userEmail={userEmail}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 z-10 ${
          isDocViewerOpen && activeTab === "chat" ? "md:w-1/2 w-full" : "w-full"
        }`}
      >
        {/* Workspace Header */}
        <div className="h-16 border-b border-slate-200/40 px-4 md:px-6 flex items-center justify-between bg-white/70 backdrop-blur-md flex-shrink-0 relative z-20 shadow-sm shadow-slate-100/10">
          <div className="flex items-center gap-2">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 md:hidden flex-shrink-0"
              title="Open Menu"
            >
              <Menu size={20} />
            </button>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse-soft shadow-[0_0_8px_rgba(249,115,22,0.6)] hidden md:inline-block" />
            {activeTab === "chat" ? (
              <div className="relative">
                <button
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="flex items-center gap-2 hover:bg-slate-100/50 px-2 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                >
                  <h1 className="font-dm-sans text-base font-normal tracking-wide text-slate-900">
                    {CONTEXT_MODES.find((m) => m.id === contextMode)?.label || "Supervision Workspace"}
                  </h1>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                
                {showModeDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 p-2 bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    {CONTEXT_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setContextMode(mode.id);
                          setShowModeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                          contextMode === mode.id
                            ? "bg-orange-500/10 text-orange-700 font-semibold border-l-2 border-orange-500"
                            : "hover:bg-slate-100/50 text-slate-600"
                        }`}
                      >
                        <div className="text-sm">{mode.label}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <h1 className="font-dm-sans text-base font-normal tracking-wide text-slate-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick context mode switcher */}
            {activeTab === "chat" && contextMode !== "topic-discovery" && contextMode !== "research-guidance" && (
              <button
                onClick={() => setContextMode("topic-discovery")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs transition-colors shadow-sm"
              >
                <MessageSquare size={14} />
                Return to Chat
              </button>
            )}

          </div>
        </div>

        {/* Dynamic Content */}
        {renderMainContent()}
      </div>

      {/* Right Document Viewer */}
      <div className="z-10">
        <DocumentViewer
          isOpen={isDocViewerOpen && activeTab === "chat"}
          onClose={() => setIsDocViewerOpen(false)}
          document={selectedDocument}
        />
      </div>
    </div>
  );
};

export default MainWorkspace;
