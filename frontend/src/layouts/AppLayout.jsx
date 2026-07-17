import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCustomCursor from '../hooks/useCustomCursor';

export default function AppLayout({ children }) {
  const { position, trailPosition, clicked, hovered } = useCustomCursor();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-dark-bg text-white overflow-x-hidden aurora-bg grid-mesh">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-neon-purple/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-neon-blue/5 blur-[150px] rounded-full pointer-events-none z-0" />
      
      {/* Background Star network overlay */}
      <div className="stars-overlay pointer-events-none z-0" />

      {/* Custom cursor for desktop */}
      {!isMobile && (
        <>
          <div
            className="cursor-dot"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
          />
          <div
            className={`cursor-trail ${clicked ? 'scale-75 border-neon-purple bg-neon-purple/10' : hovered ? 'scale-150 border-neon-cyan bg-neon-cyan/5' : ''}`}
            style={{ left: `${trailPosition.x}px`, top: `${trailPosition.y}px` }}
          />
          <div
            className="cursor-glow-bg"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
          />
        </>
      )}

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Navbar />
        <main className="w-full flex-grow relative z-10">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
