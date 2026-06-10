import React from "react";
import { motion } from "framer-motion";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "interactive";
}

export const GlassmorphicPanel: React.FC<GlassPanelProps> = ({
  children,
  className = "",
  onClick,
  variant = "default",
}) => {
  const baseStyles =
    "rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-sm shadow-slate-100/30";
  const interactiveStyles =
    variant === "interactive"
      ? "hover:bg-white/80 hover:border-slate-300/60 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
      : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassmorphicPanel;
