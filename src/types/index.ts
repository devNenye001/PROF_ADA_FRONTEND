export interface Message {
  id: string;
  role: "student" | "prof";
  content: string;
  timestamp: Date | string;
  hasAudio?: boolean;
  audioUrl?: string;
  file?: {
    name: string;
    type: string;
    dataUrl?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: "pdf" | "docx" | "pptx" | "txt" | "png" | "jpg" | "jpeg" | "image";
  uploadedAt: Date | string;
  highlights?: Highlight[];
  dataUrl?: string;
}

export interface Highlight {
  id: string;
  lineNumber: number;
  text: string;
  type: "correction" | "warning" | "suggestion";
  message: string;
}

export interface ContextMode {
  id: string;
  label: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  academicIntegrityActive: boolean;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}
