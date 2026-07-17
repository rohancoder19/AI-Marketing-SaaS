import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';
import { Sparkles, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 max-w-6xl w-[92%] glass-panel rounded-full px-6 py-3 flex items-center justify-between border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md"
    >
      <Link to="/" className="flex items-center gap-2 group">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-blue p-[1px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple to-neon-blue blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="w-full h-full bg-dark-bg rounded-[7px] flex items-center justify-center relative z-10">
            <Sparkles className="w-4 h-4 text-neon-blue group-hover:text-neon-cyan transition-colors" />
          </div>
        </div>
        <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white to-white/70 group-hover:from-neon-blue group-hover:to-neon-purple bg-clip-text text-transparent transition-all duration-300">
          AETHERA
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm text-white/70 font-medium">
        <button
          onClick={() => handleScrollToSection('hero')}
          className="hover:text-neon-blue transition-colors cursor-pointer"
        >
          Home
        </button>
        <button
          onClick={() => handleScrollToSection('features')}
          className="hover:text-neon-blue transition-colors cursor-pointer"
        >
          Features
        </button>
        <button
          onClick={() => handleScrollToSection('story')}
          className="hover:text-neon-blue transition-colors cursor-pointer"
        >
          Scroll Story
        </button>
        <button
          onClick={() => showToast('Premium features active in current workspace.', 'success')}
          className="hover:text-neon-blue transition-colors cursor-pointer"
        >
          Pricing
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-white/80 hover:text-neon-blue transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-blue/30 flex items-center justify-center">
              <User className="w-4 h-4 text-neon-blue" />
            </div>
            <span className="text-sm font-semibold text-white/80 hidden lg:inline max-w-[100px] truncate">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
