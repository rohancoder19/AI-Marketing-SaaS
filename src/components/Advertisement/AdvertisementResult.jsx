import React from 'react';
import { Copy, Heart, Download, RefreshCw, FileText } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { motion } from 'framer-motion';

export default function AdvertisementResult({ post, idx, onRegenerate, isRegenerating, onFavorite, isFavorite, onDownload }) {
  const showToast = useToast();

  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast(message || 'Copied to clipboard!', 'success');
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: idx * 0.1 }}
      className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 mb-6 bg-dark-bg/50 backdrop-blur-md"
    >
      <div className="flex justify-between items-start border-b border-white/5 pb-3">
        <span className="text-[10px] font-bold text-neon-pink bg-neon-pink/10 border border-neon-pink/20 px-2 py-0.5 rounded tracking-wider uppercase">
          Variant {idx + 1}
        </span>
        <div className="flex items-center gap-4 text-[10px] font-medium text-white/50 uppercase tracking-widest">
          <span>CTR: <span className="text-neon-cyan font-bold">{post.estimated_ctr || '2.4%'}</span></span>
          <span>Quality: <span className="text-neon-blue font-bold">{post.ad_quality_score || 95}/100</span></span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mb-1">Headline</span>
          <h4 className="text-lg font-bold text-white">{post.headline}</h4>
        </div>
        
        <div>
          <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mb-1">Primary Text</span>
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{post.primary_text || post.primaryText}</p>
        </div>

        <div>
          <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mb-1">Description</span>
          <p className="text-xs text-white/60">{post.description}</p>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-[9px] text-white/30 uppercase tracking-widest">CTA Button</span>
          <button className="px-4 py-1.5 rounded bg-white/10 border border-white/20 text-[10px] font-bold text-white tracking-widest uppercase">
            {post.cta}
          </button>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mb-1">Image Prompt</span>
          <p className="text-[10px] text-white/60 leading-relaxed italic line-clamp-3" title={post.image_prompt}>
            "{post.image_prompt}"
          </p>
          <button onClick={() => handleCopy(post.image_prompt, 'Image prompt copied')} className="text-[9px] text-neon-pink mt-1 hover:underline">Copy Prompt</button>
        </div>
        <div>
          <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mb-1">Marketing Framework</span>
          <p className="text-xs font-bold text-white/80">{post.marketing_framework_used}</p>
          <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mt-2 mb-1">Psychological Trigger</span>
          <p className="text-xs font-bold text-white/80">{post.psychological_trigger}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-white/5 mt-4">
        <button onClick={onFavorite} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1.5 ${isFavorite ? 'bg-neon-pink/20 text-neon-pink border-neon-pink/30' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}>
          <Heart className="w-3.5 h-3.5" fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'Favorited' : 'Favorite'}
        </button>
        <button onClick={() => handleCopy(`${post.headline}\n\n${post.primary_text || post.primaryText}\n\n${post.description}\n\n[${post.cta}]`, 'Ad copy copied')} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1.5">
          <Copy className="w-3.5 h-3.5" /> Copy Text
        </button>
        <button onClick={onRegenerate} disabled={isRegenerating} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-neon-cyan' : ''}`} /> Re-gen
        </button>
        <button onClick={() => onDownload('pdf')} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-[0_0_10px_rgba(255,0,122,0.3)] hover:opacity-90 transition-all flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> PDF
        </button>
      </div>
    </motion.div>
  );
}
