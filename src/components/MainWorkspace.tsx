import React, { useState, useEffect } from "react";
import { ChatArea } from "./ChatArea";
import { InputCapsule } from "./InputCapsule";
import { LeftSidebar, SidebarTab } from "./LeftSidebar";
import { DocumentViewer } from "./DocumentViewer";
import { SettingsPage } from "./SettingsPage";
import { ProjectReviewWorkspace } from "./ProjectReviewWorkspace";
import { SlideReviewWorkspace } from "./SlideReviewWorkspace";
import { Message, Document, Conversation, Project } from "../types";
import { api } from "../utils/api";
import { 
  Sparkles, MessageSquare, ChevronDown, Menu, Plus, 
  FolderGit2, FileText, CheckCircle2, AlertCircle, Play, 
  FileCheck, Library, BookOpen, Loader2
} from "lucide-react";
import { CONTEXT_MODES } from "../utils/constants";
import { motion, AnimatePresence } from "framer-motion";

interface MainWorkspaceProps {
  userEmail: string;
  onLogout: () => void;
}

// Base64 helper for multipart uploads
const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({ userEmail, onLogout }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    () => localStorage.getItem("prof-ada-active-project-id")
  );
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>();
  const [activeTab, setActiveTab] = useState<SidebarTab>("chat");
  const [contextMode, setContextMode] = useState("topic-discovery");
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Project creation modal states
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Load projects on mount
  useEffect(() => {
    api.get("/projects")
      .then((res) => {
        if (res.data.success) {
          setProjects(res.data.data);
          
          // Auto select first project if none is active
          if (!activeProjectId && res.data.data.length > 0) {
            handleSelectProject(res.data.data[0].id);
          } else if (activeProjectId) {
            handleSelectProject(activeProjectId);
          }
        }
      })
      .catch((err) => console.error("Failed to load projects:", err));
  }, []);

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    localStorage.setItem("prof-ada-active-project-id", projectId);
    
    // Load conversations for this project
    api.get(`/projects/${projectId}/conversations`)
      .then((res) => {
        if (res.data.success) {
          setConversations(res.data.data);
          if (res.data.data.length > 0) {
            setActiveConversationId(res.data.data[0].id);
          } else {
            setActiveConversationId(null);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch project conversations:", err));

    // Load documents and slides
    Promise.all([
      api.get(`/projects/${projectId}/documents`),
      api.get(`/projects/${projectId}/slides`)
    ])
      .then(([docRes, slideRes]) => {
        const docs = docRes.data.data.map((d: any) => ({
          id: d.id,
          name: d.title,
          type: "docx" as const,
          uploadedAt: new Date(d.createdAt),
          fileUrl: d.fileUrl,
          content: d.extractedText,
        }));
        const slides = slideRes.data.data.map((s: any) => ({
          id: s.id,
          name: s.title,
          type: "pptx" as const,
          uploadedAt: new Date(s.createdAt),
          fileUrl: s.fileUrl,
          content: s.extractedText,
        }));
        setDocuments([...docs, ...slides]);
      })
      .catch((err) => console.error("Failed to load documents/slides:", err));
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || isCreatingProject) return;

    setIsCreatingProject(true);
    try {
      const res = await api.post("/projects", {
        title: newProjectTitle,
        description: newProjectDesc,
      });

      if (res.data.success) {
        const createdProject = res.data.data;
        setProjects((prev) => [createdProject, ...prev]);
        setShowCreateProject(false);
        setNewProjectTitle("");
        setNewProjectDesc("");
        handleSelectProject(createdProject.id);
      }
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleSendMessage = async (messageText: string, file?: { name: string; type: string; dataUrl: string }) => {
    let convId = activeConversationId;

    if (!convId) {
      // Create a conversation session on demand if missing
      try {
        const title = messageText.trim() ? messageText.substring(0, 20) + "..." : "New Chat";
        const endpoint = activeProjectId 
          ? `/projects/${activeProjectId}/conversations` 
          : '/conversations';
        const payload = activeProjectId ? { topic: title } : { title };
        
        const res = await api.post(endpoint, payload);
        if (res.data.success) {
          const newConv = res.data.data;
          convId = newConv.id;
          setActiveConversationId(newConv.id);
          setConversations((prev) => [newConv, ...prev]);
        }
      } catch (err) {
        console.error("Failed to create conversation session:", err);
        return;
      }
    }

    if (!convId) return;
    setIsLoading(true);

    try {
      if (file) {
        let currentProjectId = activeProjectId;
        
        // Auto-create a project if none is selected
        if (!currentProjectId) {
          try {
            const projRes = await api.post("/projects", {
              title: "General Workspace",
              description: "Automatically created workspace for documents.",
            });
            if (projRes.data.success) {
              currentProjectId = projRes.data.data.id;
              setActiveProjectId(currentProjectId);
              localStorage.setItem("prof-ada-active-project-id", currentProjectId);
              setProjects((prev) => [projRes.data.data, ...prev]);
            } else {
              throw new Error("Failed to create default project");
            }
          } catch (err) {
            console.error("Auto-create project error:", err);
            alert("Could not create a workspace for your document. Please create a project manually.");
            return;
          }
        }

        // 1. Process base64 file upload
        const blob = dataURItoBlob(file.dataUrl);
        const uploadFile = new File([blob], file.name, { type: file.type });
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        const type = fileExtension === "pptx" ? "SLIDE" : "CHAPTER";

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("title", file.name);
        formData.append("type", type);

        const uploadRes = await api.post(`/projects/${currentProjectId}/documents/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (uploadRes.data.success) {
          const savedDoc = uploadRes.data.data;
          
          // Sync documents state
          const newDocItem: Document = {
            id: savedDoc.id,
            name: savedDoc.title,
            type: fileExtension === "pptx" ? "pptx" : "docx",
            uploadedAt: new Date(savedDoc.createdAt),
            fileUrl: savedDoc.fileUrl,
          };
          setDocuments(prev => [newDocItem, ...prev]);

          // 2. Trigger AI Review on uploaded asset
          const reviewRes = await api.post(`/documents/${savedDoc.id}/review`, { type });
          if (reviewRes.data.success) {
            handleSelectDocument(newDocItem);
          }
        }
      } else {
        // Send typical text message to conversation messages array
        const res = await api.post(`/conversations/${convId}/messages`, {
          content: messageText,
          mode: contextMode
        });

        if (res.data.success) {
          const { studentMessage, profMessage } = res.data.data;
          
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === convId) {
                return {
                  ...c,
                  messages: [...(c.messages || []), studentMessage, profMessage],
                  updatedAt: new Date().toISOString(),
                };
              }
              return c;
            })
          );
        }
      }
    } catch (err) {
      console.error("Message processing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = async (projectId?: string) => {
    const targetProjId = projectId || activeProjectId;
    try {
      const endpoint = targetProjId 
        ? `/projects/${targetProjId}/conversations` 
        : '/conversations';
      const payload = targetProjId ? { topic: 'New Conversation' } : { title: 'New Conversation' };
      
      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        const newConv = res.data.data;
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setActiveTab("chat");
      }
    } catch (err) {
      console.error("Failed to start new conversation:", err);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setActiveTab("chat");
    
    // Fetch full messages history
    api.get(`/conversations/${id}`)
      .then((res) => {
        if (res.data.success) {
          setConversations((prev) =>
            prev.map((c) => (c.id === id ? res.data.data : c))
          );
        }
      })
      .catch((err) => console.error("Failed to load message history:", err));
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const res = await api.delete(`/conversations/${id}`);
      if (res.data.success) {
        const updated = conversations.filter((c) => c.id !== id);
        setConversations(updated);
        
        if (updated.length > 0) {
          handleSelectConversation(updated[0].id);
        } else {
          setActiveConversationId(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleSelectDocument = async (doc: Document) => {
    try {
      const feedbackRes = await api.get(`/documents/${doc.id}/feedback`);
      if (feedbackRes.data.success) {
        const highlights = feedbackRes.data.data.map((f: any, index: number) => {
          const matchQuote = f.content.match(/Quote:\s*"([^"]*)"/);
          const matchIssue = f.content.match(/Issue:\s*(.*)/);
          const matchHint = f.content.match(/Hint:\s*(.*)/);
          
          let lineNumber = -1;
          const quote = matchQuote ? matchQuote[1] : null;
          if (quote && doc.content) {
            const lines = doc.content.split('\\n');
            lineNumber = lines.findIndex((l: string) => l.includes(quote.substring(0, 50)) || quote.includes(l.trim()));
          }
          
          return {
            id: f.id || String(index),
            lineNumber: lineNumber,
            text: matchQuote ? matchQuote[1] : "General feedback",
            type: (f.severity === 'HIGH' || f.severity === 'CRITICAL') ? 'warning' : 'suggestion',
            message: `${matchIssue ? matchIssue[1] : f.content}\\n${matchHint ? matchHint[1] : ''}`
          };
        });
        
        const docWithFeedback = { ...doc, highlights };
        setSelectedDocument(docWithFeedback);
      } else {
        setSelectedDocument(doc);
      }
    } catch (err) {
      console.error("Failed to fetch feedback", err);
      setSelectedDocument(doc);
    }

    setIsDocViewerOpen(true);
    if (activeTab === "settings" || activeTab === "files" || activeTab === "projects") {
      setActiveTab("chat");
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConv ? activeConv.messages || [] : [];
  const activeProject = projects.find((p) => p.id === activeProjectId);

  const renderMainContent = () => {
    if (activeTab === "settings") {
      return <SettingsPage />;
    }

    if (activeTab === "projects") {
      return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full custom-scrollbar font-sans">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-dm-sans text-3xl font-light tracking-tight text-slate-900 mb-2">Projects</h1>
              <p className="text-slate-500 text-sm">Organize and manage your academic supervision projects and theses.</p>
            </div>
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-450 text-white font-medium text-sm shadow-sm active:scale-95 transition-all"
            >
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>

          {/* Project List Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white/40 border border-slate-200/50 rounded-2xl p-8 shadow-sm">
              <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-dm-sans text-lg font-normal text-slate-800 mb-1">No Projects Found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">Create your first academic project to begin draft uploads and research topic selections.</p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="px-5 py-2.5 rounded-xl bg-orange-500/10 text-orange-700 hover:bg-orange-500/15 border border-orange-200/30 text-sm font-semibold transition-all"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => handleSelectProject(proj.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                      isActive
                        ? "bg-orange-500/5 border-orange-500/30 shadow-md shadow-orange-500/5 ring-1 ring-orange-500/20"
                        : "bg-white/70 border-slate-200/60 hover:border-slate-300/80 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="font-dm-sans text-base font-normal text-slate-900 tracking-wide">{proj.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          proj.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          proj.status === 'REVIEWING' ? 'bg-amber-100 text-amber-800' :
                          proj.status === 'DRAFTING' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-light line-clamp-3 leading-relaxed mb-4">
                        {proj.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                      <span>Created {new Date(proj.createdAt).toLocaleDateString()}</span>
                      {isActive && <span className="text-orange-600 font-bold">Active Workspace</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create Project Modal */}
          {showCreateProject && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div 
                className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" 
                onClick={() => setShowCreateProject(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md relative z-10 font-sans"
              >
                <h2 className="font-dm-sans text-xl font-normal text-slate-900 mb-4">Create New Project</h2>
                <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Optimistic Replication in Distributed DBs"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Summarize your research aim and variables..."
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateProject(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingProject}
                      className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      {isCreatingProject ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Create Project</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "files") {
      return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full custom-scrollbar font-sans">
          <div className="mb-8">
            <h1 className="font-dm-sans text-3xl font-light tracking-tight text-slate-900 mb-2">Document Library</h1>
            <p className="text-slate-500 text-sm">View, trigger review, and access supervisor annotations on your thesis drafts.</p>
          </div>

          {!activeProjectId ? (
            <div className="text-center py-16 bg-white/40 border border-slate-200/50 rounded-2xl p-8">
              <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-dm-sans text-lg font-normal text-slate-800 mb-1">No Project Selected</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">Select or create a project first to load associated document libraries.</p>
              <button
                onClick={() => setActiveTab("projects")}
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 text-sm font-semibold active:scale-95 transition-all shadow-sm"
              >
                Go to Projects
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16 bg-white/40 border border-slate-200/50 rounded-2xl p-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-dm-sans text-lg font-normal text-slate-800 mb-1">No Files Uploaded</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">Start by uploading a document in the chat window. Valid formats: PDF, DOCX, and PPTX.</p>
              <button
                onClick={() => setActiveTab("chat")}
                className="px-5 py-2.5 rounded-xl bg-orange-500/10 text-orange-700 hover:bg-orange-500/15 border border-orange-200/30 text-sm font-semibold transition-all"
              >
                Go to Chat
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl border border-slate-200/60 bg-white/70 hover:border-slate-300/80 shadow-sm flex items-center justify-between gap-6 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/5 border border-orange-200/20 flex items-center justify-center flex-shrink-0">
                      <FileText className={`w-5 h-5 ${doc.name.endsWith('pptx') ? 'text-orange-500' : 'text-blue-500'}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-dm-sans text-sm font-normal text-slate-900 truncate tracking-wide">{doc.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()} at {new Date(doc.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectDocument(doc)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all active:scale-95"
                    >
                      View Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (contextMode === "chapter-review") {
      return <ProjectReviewWorkspace document={selectedDocument} />;
    }

    if (contextMode === "slide-review") {
      return <SlideReviewWorkspace document={selectedDocument} />;
    }

    // Default chat view
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
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse hidden md:inline-block shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
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
                {activeTab === "files" ? "Document Library" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {activeProject && (
              <div 
                onClick={() => setActiveTab("projects")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/5 border border-orange-200/20 text-orange-800 text-xs font-semibold cursor-pointer hover:bg-orange-500/10 transition-colors shadow-inner"
              >
                <BookOpen size={13} />
                <span>Project: {activeProject.title}</span>
              </div>
            )}
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
