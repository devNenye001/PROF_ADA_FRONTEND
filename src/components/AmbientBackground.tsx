import React, { useEffect, useRef } from "react";

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      // Resize handler for responsive adjustments
      if (canvasRef.current) {
        // Future: adjust glow positions based on viewport
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 bg-black overflow-hidden pointer-events-none"
    >
      {/* Deep purple glow - top left */}
      <div
        className="ambient-glow glow-purple"
        style={{
          width: "600px",
          height: "600px",
          top: "-200px",
          left: "-200px",
        }}
      />

      {/* Dark blue glow - center right */}
      <div
        className="ambient-glow glow-blue"
        style={{
          width: "800px",
          height: "800px",
          top: "10%",
          right: "-300px",
        }}
      />

      {/* Subtle cyan glow - bottom center */}
      <div
        className="ambient-glow glow-cyan"
        style={{
          width: "400px",
          height: "400px",
          bottom: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Secondary purple accent - bottom right */}
      <div
        className="ambient-glow glow-purple"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-150px",
          right: "-100px",
          opacity: 0.08,
        }}
      />
    </div>
  );
};

export default AmbientBackground;
