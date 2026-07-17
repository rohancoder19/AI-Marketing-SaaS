import React, { useRef, useState } from 'react';

export default function FeatureCard({ title, description, icon: Icon, colorClass, glowColor, onClick }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth tilt (max 8 degrees)
    const tiltX = (y / (rect.height / 2)) * -8;
    const tiltY = (x / (rect.width / 2)) * 8;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
    
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative overflow-hidden glass-panel rounded-3xl p-8 cursor-pointer border border-white/5 transition-all duration-300 shadow-xl group hover:border-white/10"
      style={{
        transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s ease',
      }}
    >
      {/* Glow highlight driven by hover */}
      {isHovered && (
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: '180px',
            height: '180px',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 80%)`,
            left: `${coords.x - 90}px`,
            top: `${coords.y - 90}px`,
            mixBlendMode: 'screen',
            opacity: 0.18,
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Embedded subtle border glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{
          border: `1.5px solid ${glowColor}22`,
          boxShadow: `inset 0 0 15px ${glowColor}0b`
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 group-hover:border-white/20 transition-all">
            <Icon className="w-6 h-6 text-white group-hover:text-neon-blue transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-xs text-white/50 leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 group-hover:text-white/80 transition-all duration-300 pt-4 uppercase tracking-widest">
          Open Workspace <span className="translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
        </div>
      </div>
    </div>
  );
}
