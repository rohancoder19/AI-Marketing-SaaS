import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-white/5 bg-dark-bg/80 backdrop-blur-md py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-neon-purple to-neon-blue flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-dark-bg font-bold" />
            </div>
            <span className="font-bold text-sm tracking-wider bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              AETHERA
            </span>
          </div>
          <p className="text-xs text-white/40 max-w-[220px] leading-relaxed">
            Create high-converting marketing content in seconds using artificial intelligence.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-4">Product</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-white/40">
            <li><button className="hover:text-neon-blue transition-colors cursor-pointer text-left">Features</button></li>
            <li><button className="hover:text-neon-blue transition-colors cursor-pointer text-left">Pricing</button></li>
            <li><button className="hover:text-neon-blue transition-colors cursor-pointer text-left">Integrations</button></li>
            <li><button className="hover:text-neon-blue transition-colors cursor-pointer text-left">Roadmap</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-4">Resources</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-white/40">
            <li><button className="hover:text-neon-blue transition-colors cursor-pointer text-left">Documentation</button></li>
            <li><button className="hover:text-neon-blue transition-colors cursor-pointer text-left">API Status</button></li>
            <li><button className="hover:text-neon-blue transition-colors cursor-pointer text-left">Community</button></li>
            <li><button className="hover:text-neon-blue transition-colors cursor-pointer text-left">Support</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-4">Connect</h4>
          <div className="flex gap-4 mb-4">
            <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
              <TwitterIcon className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
              <LinkedinIcon className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
              <GithubIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-white/20">
            © 2026 Aethera AI, Inc. All rights reserved.
          </p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-3 items-center lg:items-start">
          <p className="text-[10px] text-white/30 flex items-center gap-1.5">
            Crafted with <Heart className="w-3 h-3 text-neon-pink fill-neon-pink" /> for premium AI generation.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest">Developed By:</span>
            {['Priyansu Chatterjee', 'Rohan Majumdar', 'Zufishan Rais', 'Soumalya Ghosh', 'Dipa Dey', 'Sachin Kumar'].map((dev, idx) => (
              <span key={idx} className="text-[10px] font-semibold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neon-cyan/80 hover:text-white transition-colors cursor-default">
                {dev}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4 text-[10px] text-white/30">
          <button className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
          <button className="hover:text-white transition-colors cursor-pointer">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
}
