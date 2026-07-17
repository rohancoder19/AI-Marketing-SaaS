import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import { 
  History, Calendar, ArrowLeft, MessageCircle, Sparkles, Copy, 
  Download, FileText, Search, Trash2, Heart, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SocialMediaGenerator.module.css';

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

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const PREVIEW_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
];

import AdvertisementHistory from '../components/Advertisement/AdvertisementHistory';
import EmailHistory from '../components/Email/EmailHistory';

export default function HistoryPage() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [view, setView] = useState('social'); // 'social' | 'advertisement'

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await socialAPI.getHistory();
      setHistoryList(data);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to retrieve copy history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this campaign from history?')) return;
    try {
      await socialAPI.deleteHistory(id);
      setHistoryList(historyList.filter(item => item.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
      showToast('Campaign deleted from database.', 'success');
    } catch (err) {
      showToast('Failed to delete history log.', 'error');
    }
  };

  const handleToggleFavorite = async (e, entry) => {
    e.stopPropagation();
    const targetState = !entry.favorite;
    try {
      await socialAPI.favorite(entry.id, targetState);
      const updatedList = historyList.map(item => 
        item.id === entry.id ? { ...item, favorite: targetState } : item
      );
      setHistoryList(updatedList);
      if (selectedEntry?.id === entry.id) {
        setSelectedEntry({ ...selectedEntry, favorite: targetState });
      }
      showToast(targetState ? 'Added to favorites' : 'Removed from favorites', 'success');
    } catch (err) {
      showToast('Failed to update favorite status.', 'error');
    }
  };

  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast(message || 'Copy saved to clipboard!', 'success');
  };

  const handleDownload = async (post, topic, platform, type) => {
    try {
      const blob = type === 'pdf' 
        ? await socialAPI.exportPdf(post, topic, platform)
        : await socialAPI.exportTxt(post, topic, platform);
        
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aethera_${platform.toLowerCase()}_post.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast(`Exported as ${type.toUpperCase()}`, 'success');
    } catch (err) {
      showToast('Export document failed.', 'error');
    }
  };

  const getPlatformIcon = (platform) => {
    switch(platform?.toLowerCase() || '') {
      case 'instagram': return <InstagramIcon className="w-4 h-4 text-neon-pink" />;
      case 'linkedin': return <LinkedinIcon className="w-4 h-4 text-neon-blue" />;
      case 'facebook': return <FacebookIcon className="w-4 h-4 text-blue-500" />;
      case 'x (twitter)': return <TwitterIcon className="w-4 h-4 text-white" />;
      default: return <Sparkles className="w-4 h-4 text-neon-purple" />;
    }
  };

  // Filter history logic
  const filteredHistory = historyList.filter(item => {
    const matchesSearch = 
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = platformFilter === 'All' || item.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesFav = !onlyFavorites || item.favorite;

    return matchesSearch && matchesPlatform && matchesFav;
  });

  // Calculate statistics aggregates
  const totalCampaigns = historyList.length;
  const avgEngagement = totalCampaigns > 0
    ? Math.round(historyList.reduce((acc, curr) => acc + (curr.generated_content?.[0]?.engagement_score || 0), 0) / totalCampaigns)
    : 0;
  const avgVirality = totalCampaigns > 0
    ? Math.round(historyList.reduce((acc, curr) => acc + (curr.generated_content?.[0]?.virality_score || 0), 0) / totalCampaigns)
    : 0;

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/dashboard')} className={styles.actionBtn} style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className={styles.subtitle}>Audit Logs & Analytics</span>
        <h2 className={styles.title}>
          Generation <span className={styles.titleGlow}>Campaign History</span>
        </h2>
        <p className={styles.desc}>
          Filter and manage previous B2B campaign records, export print sheets, and review brand quality scores.
        </p>
      </div>

      {/* Analytics widgets row */}
      <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
        <button onClick={() => setView('social')} className={`px-4 py-2 font-bold text-sm transition-colors ${view === 'social' ? 'text-neon-blue border-b-2 border-neon-blue' : 'text-white/40 hover:text-white'}`}>
          Social Media History
        </button>
        <button onClick={() => setView('advertisement')} className={`px-4 py-2 font-bold text-sm transition-colors ${view === 'advertisement' ? 'text-neon-pink border-b-2 border-neon-pink' : 'text-white/40 hover:text-white'}`}>
          Advertisement History
        </button>
        <button onClick={() => setView('email')} className={`px-4 py-2 font-bold text-sm transition-colors ${view === 'email' ? 'text-neon-cyan border-b-2 border-neon-cyan' : 'text-white/40 hover:text-white'}`}>
          Email History
        </button>
      </div>

      {view === 'advertisement' ? (
        <AdvertisementHistory />
      ) : view === 'email' ? (
        <EmailHistory />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '8px' }}>
        <div className={styles.glassPanel} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'between', width: '100%', boxSizing: 'border-box' }}>
          <div>
            <span className={styles.label} style={{ fontSize: '9px' }}>Total Campaigns</span>
            <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0', color: 'white' }}>{totalCampaigns}</h4>
          </div>
          <History className="w-8 h-8 text-neon-blue" />
        </div>
        <div className={styles.glassPanel} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'between', width: '100%', boxSizing: 'border-box' }}>
          <div>
            <span className={styles.label} style={{ fontSize: '9px' }}>Avg Engagement</span>
            <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0', color: '#e5e7eb' }}>{avgEngagement}%</h4>
          </div>
          <BarChart2 className="w-8 h-8 text-neon-cyan" />
        </div>
        <div className={styles.glassPanel} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'between', width: '100%', boxSizing: 'border-box' }}>
          <div>
            <span className={styles.label} style={{ fontSize: '9px' }}>Avg Virality Index</span>
            <h4 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0', color: '#6b7280' }}>{avgVirality}%</h4>
          </div>
          <Sparkles className="w-8 h-8 text-neon-pink" />
        </div>
      </div>

      {/* Main Workspace grid */}
      <div className={styles.workspaceGrid} style={{ gridTemplateColumns: historyList.length > 0 ? '4.5fr 7.5fr' : '1fr' }}>
        
        {/* Left Side: Campaign Filter & List Panel */}
        <div className={styles.glassPanel} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className={styles.formSectionTitle} style={{ marginBottom: '0px' }}>
            <History className="w-4.5 h-4.5 text-neon-purple" /> History Archives
          </h3>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search topic or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
              style={{ paddingLeft: '36px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Filtering buttons */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'LinkedIn', 'Instagram', 'Facebook', 'X (Twitter)'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={styles.actionBtn}
                style={{
                  fontSize: '9px',
                  padding: '6px 10px',
                  backgroundColor: platformFilter === p ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  borderColor: platformFilter === p ? '#e5e7eb' : 'rgba(255,255,255,0.08)',
                  color: platformFilter === p ? '#e5e7eb' : 'rgba(255,255,255,0.6)'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Toggle favorite campaign view */}
          <div className={styles.switchContainer} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <span className={styles.label} style={{ fontSize: '10px' }}>Filter Favorites Only</span>
            <label className={styles.switch}>
              <input type="checkbox" checked={onlyFavorites} onChange={(e) => setOnlyFavorites(e.target.checked)} />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className={styles.skeletonPulse} style={{ height: '70px', borderRadius: '12px', marginBottom: '12px' }} />
              ))}
            </div>
          )}

          {/* Empty state list */}
          {!loading && filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xs text-white/40">No campaigns match search filters.</p>
            </div>
          )}

          {/* History Lists */}
          {!loading && filteredHistory.length > 0 && (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`${styles.actionBtn} ${selectedEntry?.id === entry.id ? styles.actionBtnFavActive : ''}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '100%',
                    padding: '16px',
                    boxSizing: 'border-box',
                    gap: '8px',
                    textAlign: 'left'
                  }}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-bold text-neon-cyan uppercase tracking-wider flex items-center gap-1">
                      {getPlatformIcon(entry.platform)} {entry.platform}
                    </span>
                    <span className="text-[9px] text-white/30 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate w-full">{entry.topic}</h4>
                  <p className="text-[10px] text-white/40 truncate w-full leading-normal">{entry.description}</p>
                  
                  {/* Actions buttons inside card lists */}
                  <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-white/5">
                    <span className="text-[8px] text-white/30">Tone: {entry.tone}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => handleToggleFavorite(e, entry)}
                        className="p-1 hover:text-neon-pink transition-colors text-white/40"
                        title={entry.favorite ? "Unfavorite" : "Favorite"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${entry.favorite ? 'fill-current text-neon-pink' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, entry.id)}
                        className="p-1 hover:text-neon-pink transition-colors text-white/40"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Selected Campaign details */}
        {historyList.length > 0 && (
          <div className={styles.outputsColumn}>
            <AnimatePresence mode="wait">
              {selectedEntry ? (
                <motion.div
                  key={selectedEntry.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                  style={{ width: '100%' }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider truncate max-w-[70%]">
                      Campaign Details: {selectedEntry.topic}
                    </h3>
                    <span className={`${styles.badge} ${styles.badgePrimary}`}>
                      {selectedEntry.generated_content?.length || 0} Variations
                    </span>
                  </div>

                  {selectedEntry.generated_content?.map((post, idx) => (
                    <div key={idx} className={styles.variationCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.badgeGroup}>
                          <span className={`${styles.badge} ${styles.badgePrimary}`}>
                            Variant {idx + 1}
                          </span>
                          <span className={`${styles.badge} ${styles.badgeSecondary} flex items-center gap-1`}>
                            {getPlatformIcon(selectedEntry.platform)}
                            {selectedEntry.platform}
                          </span>
                        </div>
                        <span className={styles.readingTime}>
                          Est. Read: {post.reading_time || '12s'} &nbsp;|&nbsp; Best Time: {post.best_posting_time || '9:30 AM'}
                        </span>
                      </div>

                      {/* Image Preview Canvas */}
                      <div className={styles.imagePreview}>
                        <img 
                          src={`https://loremflickr.com/800/500/${encodeURIComponent(
                            selectedEntry.topic
                              .replace(/[^a-zA-Z0-9\s]/g, '')
                              .trim()
                              .split(/\s+/)
                              .slice(0, 2)
                              .join(',')
                          )}?lock=${idx + 1}`}
                          onError={(e) => {
                            e.target.src = PREVIEW_IMAGES[idx % PREVIEW_IMAGES.length];
                          }}
                          alt="AI Generated Social Creative" 
                          className={styles.previewImage}
                        />
                      </div>

                      {/* Asset Prompt details */}
                      <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', marginBottom: '8px' }}>
                        <span className={styles.sectionLabel} style={{ display: 'flex', justifyContent: 'between', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', marginBottom: '8px' }}>
                          <span>Visual Asset Prompt ({post.suggested_image_style})</span>
                          <button 
                            onClick={() => handleCopy(post.image_prompt, 'Image prompt copied!')}
                            className="text-[10px] text-neon-blue hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Copy className="w-2.5 h-2.5" /> Copy Prompt
                          </button>
                        </span>
                        <p className="text-[11px] text-white/70 leading-normal mb-2 italic">"{post.image_prompt}"</p>
                        <span className={styles.sectionLabel} style={{ fontSize: '8px' }}>Negative: {post.negative_prompt}</span>
                        <div className="flex gap-1.5 mt-2">
                          {post.suggested_color_palette?.map((color, colorIdx) => (
                            <span key={colorIdx} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: color }} title={color} />
                          ))}
                        </div>
                      </div>

                      <div className={styles.section}>
                        <span className={styles.sectionLabel}>HOOK / HEADING</span>
                        <p className={styles.hookText}>{post.hook}</p>
                      </div>

                      <div className={styles.section}>
                        <span className={styles.sectionLabel}>CAPTION BODY</span>
                        <p className={styles.captionText}>{post.caption}</p>
                      </div>

                      {post.cta && (
                        <div className={styles.section}>
                          <span className={styles.sectionLabel}>CALL TO ACTION</span>
                          <p className={styles.ctaText}>{post.cta}</p>
                        </div>
                      )}

                      {/* Tags & SEO */}
                      <div className={styles.section}>
                        <span className={styles.sectionLabel}>HASHTAGS & SEO KEYWORDS</span>
                        <div className={styles.hashtagGroup} style={{ marginBottom: '6px' }}>
                          {post.hashtags?.map((tag, tagIdx) => (
                            <span key={tagIdx} className={styles.hashtag}>
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {post.seo_keywords?.map((keyword, kwIdx) => (
                            <span key={kwIdx} className="text-[10px] text-neon-blue bg-neon-blue/5 border border-neon-blue/20 rounded px-1.5 py-0.5">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Scoring analytics panel */}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '8px' }}>
                        <span className={styles.sectionLabel} style={{ display: 'block', marginBottom: '12px' }}>Quality Analytics Scores</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                          <div className="glass-panel" style={{ padding: '8px 4px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <span className="text-[9px] text-white/40 block">Engagement</span>
                            <span className="text-sm font-bold text-neon-cyan">{post.engagement_score}%</span>
                          </div>
                          <div className="glass-panel" style={{ padding: '8px 4px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <span className="text-[9px] text-white/40 block">Virality</span>
                            <span className="text-sm font-bold text-neon-pink">{post.virality_score}%</span>
                          </div>
                          <div className="glass-panel" style={{ padding: '8px 4px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <span className="text-[9px] text-white/40 block">Brand Consistency</span>
                            <span className="text-sm font-bold text-neon-blue">{post.brand_consistency_score}%</span>
                          </div>
                          <div className="glass-panel" style={{ padding: '8px 4px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <span className="text-[9px] text-white/40 block">Readability</span>
                            <span className="text-sm font-bold text-neon-purple">{post.readability_score}%</span>
                          </div>
                          <div className="glass-panel" style={{ padding: '8px 4px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <span className="text-[9px] text-white/40 block">AI Score</span>
                            <span className="text-sm font-bold text-white">{post.ai_score}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Exporters buttons */}
                      <div className={styles.actionsBar}>
                        <button
                          onClick={() => handleCopy(`${post.hook}\n\n${post.caption}\n\n${post.cta}`, 'Copy content saved!')}
                          className={styles.actionBtn}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy Text
                        </button>
                        <button
                          onClick={() => handleCopy(post.image_prompt, 'Copy image prompt saved!')}
                          className={styles.actionBtn}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy Image Prompt
                        </button>
                        <button
                          onClick={() => handleDownload(post, selectedEntry.topic, selectedEntry.platform, 'txt')}
                          className={styles.actionBtn}
                        >
                          <Download className="w-3.5 h-3.5" /> TXT
                        </button>
                        <button
                          onClick={() => handleDownload(post, selectedEntry.topic, selectedEntry.platform, 'pdf')}
                          className={styles.actionBtn}
                        >
                          <FileText className="w-3.5 h-3.5" /> PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <History className="w-8 h-8" />
                  </div>
                  <h4 className={styles.emptyTitle}>Select a Database Record</h4>
                  <p className={styles.emptyDesc}>
                    Click an archived campaign on the left list to review its generated copies, Stable Diffusion prompts, and analytics.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
      </>
      )}
    </div>
  );
}
