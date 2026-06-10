import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Play, Pause, Upload, FileText, CheckCircle, 
  AlertTriangle, ShieldAlert, Mic, MessageSquare, ChevronDown, 
  ChevronUp, Star, HelpCircle, X, Sun, Moon, Laptop, Sparkles, Menu
} from "lucide-react";
import { useTheme } from "../utils/theme";

interface LandingPageProps {
  onStartConversation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartConversation,
}) => {
  const { theme, setTheme } = useTheme();
  
  // States
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(35);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Voice Mode", href: "#voice-mode" },
    { label: "FAQ", href: "#faq" }
  ];

  const faqs = [
    {
      question: "How strict is Prof. Ada's feedback?",
      answer: "Extremely. Prof. Ada is configured using standard academic evaluation rubrics. She does not sugarcoat; instead, she highlights actual literature contradictions, citation flaws, and methodology gaps that final-year project committees target."
    },
    {
      question: "What files can I upload for review?",
      answer: "We support PDF, DOCX (Word), and PPTX (Slides) files. You can upload entire chapter drafts, slide decks, or proposal summaries."
    },
    {
      question: "Is my research data and paper private?",
      answer: "Absolutely. All papers and topic drafts are securely handled and sandboxed. Your academic ideas remain 100% yours, encrypted in transit and at rest."
    },
    {
      question: "Can I use it to brainstorm topics from scratch?",
      answer: "Yes. Using the Topic Discovery mode, you can type rough areas of interest, and Prof. Ada will output specific, measurable computer science thesis options complete with research scope variables."
    }
  ];

  return (
    <div className="light bg-slate-50 text-slate-900 min-h-screen relative overflow-x-hidden transition-colors duration-300">
      
      {/* Subtle light background decoration (Vora inspired warm peach & amber) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-[300px] -left-[200px] bg-orange-100/30 rounded-full blur-3xl" />
        <div className="absolute w-[600px] h-[600px] top-[40%] -right-[300px] bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      {/* HEADER NAV BAR */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-300 relative">
        <div className="flex items-center gap-2">
          <span className="font-dm-sans text-sm sm:text-base font-semibold text-slate-950 select-none">
            Prof. Ada
          </span>
        </div>

        {/* Navigation links (VORA inspired thin uppercase style) */}
        <nav className="hidden md:flex items-center gap-8 font-dm-sans text-xs font-normal text-slate-500">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="hover:text-slate-950 transition-colors relative py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Header Right (Desktop CTA vs Mobile Burger Menu) */}
        <div className="flex items-center gap-3">
          {/* Desktop Button */}
          <div className="hidden md:block">
            <button 
              onClick={onStartConversation}
              className="px-5 py-2.5 rounded-[8px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              Start a Conversation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-all"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl overflow-hidden z-50"
            >
              <nav className="flex flex-col p-6 gap-4 font-dm-sans text-sm font-normal text-slate-500">
                {navLinks.map((link) => (
                  <a 
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-slate-950 transition-colors py-2 border-b border-slate-50 last:border-0"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onStartConversation();
                    }}
                    className="w-full px-5 py-3 rounded-[8px] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-semibold text-center shadow-md active:scale-95"
                  >
                    Start a Conversation
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative z-10 pt-20 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Title (Sleek light-weight typography matching VORA) */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl sm:text-7xl font-light tracking-tight max-w-4xl mb-6 text-slate-950"
        >
          Meet Prof. Ada
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl sm:text-2xl text-slate-800 max-w-3xl font-light leading-relaxed mb-6"
        >
          Your academic supervisor, available whenever you need guidance.
        </motion.p>
        
        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-sm sm:text-base text-slate-500 max-w-2xl mb-10 leading-relaxed"
        >
          From topic selection to final submission, Prof. Ada helps you think through your project, improve your work, and prepare with confidence.
        </motion.p>

        {/* CTA Buttons (Styled with orange gradients) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center mb-16 relative z-10 w-full sm:w-auto"
        >
          <button
            onClick={onStartConversation}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Start a Conversation</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white/95" />
          </button>
          
          <button
            onClick={onStartConversation}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <Upload size={16} className="text-orange-600" />
            <span>Upload Your Project</span>
          </button>
        </motion.div>

        {/* WORKSPACE PREVIEW MOCKUP PANEL */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-5xl bg-white border border-slate-200 p-2 rounded-xl shadow-xl relative"
        >
          {/* Header Panel */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-lg text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            </div>
            <span className="text-[10px] truncate px-2">prof-ada-vercel.app</span>
            <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded flex-shrink-0">Active Draft Review</span>
          </div>

          {/* Mockup Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-12 h-[340px] md:h-[420px] bg-white text-left text-slate-800">
            
            {/* Sidebar list */}
            <div className="md:col-span-3 border-r border-slate-100 p-4 space-y-4 hidden md:block bg-slate-50/50 h-full">
              <div className="h-5 w-24 bg-slate-200 rounded" />
              <div className="space-y-2">
                {[
                  { name: "Chapter_1_Introduction.pdf", color: "text-red-500" },
                  { name: "Chapter_3_Methodology.docx", color: "text-blue-500" },
                  { name: "Presentation_Slides.pptx", color: "text-orange-500" }
                ].map((doc, i) => (
                  <div key={i} className={`p-2 rounded-lg bg-white border border-slate-200/80 flex items-center gap-2 text-[10px] ${i === 1 ? 'border-orange-200 bg-orange-50/30' : ''}`}>
                    <FileText size={14} className={doc.color} />
                    <span className="truncate text-slate-700 font-medium">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat feed Mockup */}
            <div className="col-span-12 md:col-span-5 p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 h-full">
              <div className="space-y-4 overflow-y-auto max-h-[230px] md:max-h-[310px] pr-1">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-[11px] leading-relaxed text-slate-600">
                  <span className="text-orange-600 font-bold block mb-1">Prof. Ada • Supervisor</span>
                  "I reviewed Section 3.2. Your sample size (N=45) is insufficient for a quantitative survey. However, if you convert this into a mixed-methods case study, N=45 is acceptable. Let's adjust the thesis scope."
                </div>
                
                <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-lg text-[11px] leading-relaxed text-slate-700 ml-6 text-right">
                  "That makes sense. Should I rewrite the sample description and add interview guides?"
                </div>
              </div>

              {/* Chat capsule footer */}
              <div className="border-t border-slate-100 pt-3 flex gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-400">
                  Ask Prof. Ada about sample selection...
                </div>
                <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 flex items-center justify-center text-white">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Document highlights preview */}
            <div className="md:col-span-4 p-4 space-y-3 bg-slate-50/30 h-full hidden md:block">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Supervisor Observations</span>
              
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                  <AlertTriangle size={12} />
                  <span>Warning: Methodology Conflict</span>
                </div>
                <p className="text-slate-600">
                  "You claim to use optimistic consistency models but haven't outlined validation states in your system architecture. Correct this before draft submission."
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-orange-50/50 border border-orange-200 text-[10px] leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 text-orange-700 font-bold">
                  <Sparkles size={12} />
                  <span>Suggestion: Research Gap</span>
                </div>
                <p className="text-slate-600">
                  "Link your IoT latency concerns directly to the double-spend model shown in Chapter 2. It reinforces your problem statement."
                </p>
              </div>
            </div>

          </div>
        </motion.div>

      </section>

      {/* DEFINITION SECTION: WHAT PROF. ADA ACTUALLY IS */}
      <section className="relative z-10 py-16 px-6 max-w-4xl mx-auto border-t border-slate-200 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">What Prof. Ada Actually Is</h2>
        
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-light">
          Prof. Ada is an <strong>AI-powered academic supervisor</strong> that helps university students at any stage of their project journey—from choosing a topic and identifying research gaps to reviewing chapters and improving slides—through natural conversations, document analysis, and practical supervisor-style guidance in a modern workspace.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-6">
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg text-left">
            <span className="text-xs font-bold text-emerald-700 block mb-1">✓ Prof. Ada is:</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              A digital academic supervisor that students can consult at any stage of their project journey.
            </p>
          </div>
          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-lg text-left">
            <span className="text-xs font-bold text-rose-700 block mb-1">✗ Prof. Ada is NOT:</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simply a chatbot, document reviewer, or project checker. Those are just tools; the core product is expert supervisor guidance.
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side text */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
            <ShieldAlert className="text-orange-600" size={20} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Final year projects don't fail because students are lazy.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-light">
            They fail because students don’t get proper guidance early enough. Without access to their busy advisors, students make avoidable methodology errors and find out too late.
          </p>
        </div>

        {/* Right Side grid cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "No Structure Understanding", desc: "Most students struggle to arrange chapter structures and maintain proper academic continuity." },
            { title: "Hidden Research Gaps", desc: "Failing to frame clear research questions and original contributions that panel reviewers expect." },
            { title: "Corrections Arrive Too Late", desc: "Discovering structural problems during final presentations, forcing costly extensions." },
            { title: "Presentation Flow Issues", desc: "Struggling to design slides and maintain proper academic continuity during presentations." }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white border border-slate-200/60 rounded-lg shadow-sm hover:shadow-md hover:border-orange-200/50 transition-all text-left flex flex-col justify-between relative min-h-[140px] group">
              <span className="absolute top-4 right-5 font-dm-sans text-[10px] font-light text-slate-400 tracking-wider">0{i+1}</span>
              <div className="space-y-2 pr-6">
                <h3 className="font-dm-sans text-xs font-normal text-slate-900 tracking-wide">{item.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* SOLUTION SECTION */}
      <section className="relative z-10 py-20 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">
              A supervisor in your pocket.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              Prof. Ada helps you choosing topics, identifying gaps, reviewing chapters, fixing methodology, and polishing slides in a voice and chat experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Choose a Strong Topic", icon: <Sparkles size={18} className="text-orange-600" />, desc: "Choose strong computer science and software project topics mapped to existing gaps." },
              { title: "Identify Research Gaps", icon: <FileText size={18} className="text-orange-600" />, desc: "Audits draft introduction and literature review chapters to ensure claims are properly supported." },
              { title: "Review Chapters", icon: <CheckCircle size={18} className="text-orange-600" />, desc: "Pinpoint inconsistent data sample sizes, analysis flaws, or unsupported research models." },
              { title: "Fix Methodology Mistakes", icon: <FileText size={18} className="text-orange-600" />, desc: "Pinpoint inconsistencies in research architecture, data models, or experimental setup." },
              { title: "Improve Your Slides", icon: <Laptop size={18} className="text-orange-600" />, desc: "Scans presentation decks for readability, content density, slide structures, and visual flow." },
              { title: "Voice Guidance Mode", icon: <Mic size={18} className="text-orange-600" />, desc: "Toggle voice mode to listen to reviews in direct conversation, just like office hours." }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white border border-slate-200/60 rounded-lg shadow-sm hover:shadow-md hover:border-orange-200/50 transition-all text-left flex flex-col justify-between min-h-[160px] group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50/50 flex items-center justify-center border border-orange-100/30 group-hover:bg-orange-100/50 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="font-dm-sans text-xs font-normal text-slate-900 tracking-wide">{item.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURE GRID / ACADEMIC CARDS */}
      <section id="features" className="relative z-10 py-20 px-6 max-w-7xl mx-auto space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600">Workspace Features</span>
          <h2 className="text-3xl font-light tracking-tight text-slate-900">
            Built for real students
          </h2>
          <p className="text-sm text-slate-600">
            Natural conversations, document analysis, and practical supervisor-grade feedback.
          </p>
        </div>

        {/* Dynamic Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Topic Discovery", desc: "Discover fresh project topics by mapping current IEEE/ACM research gaps.", iconColor: "text-orange-600" },
            { title: "Research Guidance", desc: "Get structured methodologies, mathematical formulations, and algorithm skeletons.", iconColor: "text-orange-600" },
            { title: "Chapter Review", desc: "Submit drafts of chapters 1 to 5 and receive precise sentence-level feedback.", iconColor: "text-orange-600" },
            { title: "Slide Review", desc: "Submit presentation slides to make sure key logic parameters fit your layout.", iconColor: "text-orange-600" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white p-6 border border-slate-200/60 rounded-lg shadow-sm hover:shadow-md hover:border-orange-200/50 transition-all flex flex-col justify-between h-56 relative overflow-hidden group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-50/50 border border-orange-100/30 flex items-center justify-center relative z-10 group-hover:bg-orange-100/50 transition-colors">
                <Sparkles size={14} className={item.iconColor} />
              </div>
              
              <div className="space-y-2 relative z-10">
                <h3 className="font-dm-sans text-xs font-normal text-slate-900 tracking-wide">{item.title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 max-w-7xl mx-auto space-y-12 bg-slate-50 border-y border-slate-200">
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600">Timeline</span>
          <h2 className="text-3xl font-light tracking-tight text-slate-900">How Prof. Ada Works</h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { num: "01", title: "Upload or Ask", desc: "Upload your document or simply ask a question." },
            { num: "02", title: "Get Supervisor Feedback", desc: "Receive clear, strict, and practical academic corrections." },
            { num: "03", title: "Improve Your Work", desc: "Apply feedback before submission or final presentation." },
            { num: "04", title: "Polish Presentation", desc: "Use slide review to perfect your slide structures and visual balance." }
          ].map((step, i) => (
            <div key={i} className="relative text-left space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-orange-600">0{i+1}</span>
                <div className="flex-1 h-px bg-slate-200 hidden md:block" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VOICE EXPERIENCE SECTION */}
      <section id="voice-mode" className="relative z-10 py-20 px-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side */}
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-700">
            <Mic size={12} />
            <span>Voice Supervisor Mode</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Feels like talking to a real supervisor
          </h2>
          
          <p className="text-sm text-slate-600 leading-relaxed">
            Speak to Prof. Ada using voice or text. She responds like a real academic supervisor: clear, direct, practical, and without confusion.
          </p>

          <div className="space-y-3 bg-white border border-slate-200 p-4 rounded-lg text-xs text-slate-600">
            <p className="font-bold text-orange-700 flex items-center gap-1.5">
              <CheckCircle size={14} />
              <span>Voice supervisor reviews</span>
            </p>
            <p>Students use speech-to-text to speak questions. Prof. Ada responds in text with an optional play voice note option, preventing massive text-walls.</p>
          </div>
        </div>

        {/* Device Frame */}
        <div className="flex-1 flex justify-center">
          <div className="w-[280px] h-[440px] rounded-[36px] border-[5px] border-slate-200 bg-white p-5 flex flex-col justify-between items-center relative overflow-hidden shadow-xl">
            
            <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Siri Supervision</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            {/* Siri Orb in Center */}
            <div className="flex flex-col items-center gap-3 my-auto">
              <div className="siri-orb" />
              
              <div className="text-center space-y-1 mt-4">
                <span className="text-[10px] text-slate-400 block">Prof. Ada Speech Mode</span>
                <span className="text-xs font-semibold text-slate-800">"How can I help you today?"</span>
              </div>
            </div>

            {/* Waveform */}
            <div className="w-full space-y-3">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2">
                <button 
                  onClick={() => setIsVoicePlaying(!isVoicePlaying)}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 flex items-center justify-center text-white"
                >
                  {isVoicePlaying ? <Pause size={10} /> : <Play size={10} />}
                </button>
                
                <div className="flex-1 flex items-end gap-0.5 h-3">
                  {[20, 50, 30, 70, 45, 60, 35, 80, 55, 30].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 rounded-sm transition-all"
                      style={{ 
                        height: `${h}%`,
                        background: isVoicePlaying && i * 10 < voiceProgress ? "#ea580c" : "#e2e8f0"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                Ask anything...
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* TRUST / WARNING SECTION */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto space-y-12 border-t border-slate-200">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertTriangle className="text-amber-600" size={20} />
          </div>
          
          <h2 className="text-3xl font-light text-slate-900 tracking-tight">
            No sugarcoating. Just real feedback.
          </h2>
          
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Prof. Ada doesn’t just say “good work”. She tells you: what your supervisor will question, and what you must fix before submission.
          </p>
        </div>

        {/* Warning cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-red-50/30 border border-red-100 rounded-lg text-left space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Critical Methodology Risks</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Your methodology doesn't address concurrency conflicts. Any supervisor reviewing this IoT layout will immediately point out structural race states."
            </p>
          </div>

          <div className="p-6 bg-amber-50/30 border border-amber-100 rounded-lg text-left space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Literature Gaps</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              "You reference 2018 algorithms as state-of-the-art. You must update your background analysis with 2024 Optimistic Consensus papers to prove currency compliance."
            </p>
          </div>

          <div className="p-6 bg-orange-50/20 border border-orange-100 rounded-lg text-left space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Slide Redundancies</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Slide 4 has over 200 words of static paragraphs. Examiners ignore text-heavy slides. Split this into three distinct data flow diagrams showing node states."
            </p>
          </div>
        </div>

      </section>

      {/* STUDENT TESTIMONIALS (Nigerian Names, Computer Science Role) */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto space-y-12 border-t border-slate-200">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600">Student Reviews</span>
          <h2 className="text-3xl font-light text-slate-900 tracking-tight mt-2">Tested by Real Students</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Chidi Okechukwu", role: "MSc Computer Science", quote: "My final presentation grading was a breeze because Prof. Ada raised the exact same issues about my data scaling N=45 two weeks earlier. I had my case-study answers ready!" },
            { name: "Amina Bello", role: "BSc Computer Science", quote: "I was stuck trying to draft my literature chapter structure. Ada suggested measurable CS topics and structured the headings. It saved me hours of guesswork." },
            { name: "Tunde Olaniyan", role: "BSc Computer Science", quote: "Slide Review scans your PPTX layouts and highlights cluttered blocks. My slides looked clean, and my final grade reflected it. Absolutely world-class." }
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm text-left flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-1 text-orange-500 mb-4">
                {[...Array(5)].map((_, starIdx) => <Star key={starIdx} size={12} fill="currentColor" />)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-light italic">"{t.quote}"</p>
              <div>
                <h4 className="text-xs font-semibold text-slate-900">{t.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION (Accordion) */}
      <section id="faq" className="relative z-10 py-20 px-6 max-w-3xl mx-auto space-y-12 border-t border-slate-200">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto">
            <HelpCircle className="text-orange-600" size={20} />
          </div>
          <h2 className="text-3xl font-light text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="bg-white border border-slate-200 rounded-lg overflow-hidden text-left transition-all shadow-sm">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={16} className="text-orange-600" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-slate-100 bg-slate-50/30"
                    >
                      <p className="p-5 text-xs text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-20 px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-tr from-orange-100 to-amber-50 border border-orange-200/50 p-8 sm:p-12 text-center rounded-3xl shadow-md relative">
          
          <h2 className="text-3xl sm:text-5xl font-light text-slate-900 tracking-tight mb-4 animate-pulse-soft">
            Start your project the right way.
          </h2>
          
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
            Don’t wait until final submission to discover mistakes. Fix them early with Prof. Ada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onStartConversation}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              Start Free Review
            </button>
            <button 
              onClick={onStartConversation}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm transition-colors active:scale-95"
            >
              Upload Project Now
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-100 bg-white py-8 px-6 overflow-hidden">
        {/* Subtle orange accent glow behind footer */}
        <div className="absolute w-[350px] h-[350px] -bottom-[150px] -right-[50px] bg-orange-100/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3 max-w-sm">
              <span className="font-dm-sans text-sm sm:text-base font-semibold text-slate-950 select-none">
                Prof. Ada
              </span>
              <p className="text-[11px] font-dm-sans font-light text-slate-500 leading-relaxed tracking-wide">
                Digital academic supervisor for university thesis papers and slide decks. Early corrections for higher success.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 font-dm-sans text-xs font-normal text-slate-400">
              {navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  className="hover:text-slate-950 transition-colors relative py-0.5 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-dm-sans font-normal text-slate-400">
            <span>&copy; {new Date().getFullYear()} Prof. Ada. All rights reserved.</span>
            <span className="text-slate-300 font-light lowercase">Academic Integrity Compliant • Sandboxed Data Environment</span>
          </div>
        </div>
      </footer>



    </div>
  );
};

export default LandingPage;
