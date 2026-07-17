import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Copy, Download, Heart, ArrowLeft, 
  RefreshCw, FileText, Share2, BarChart2, Check, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { socialAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
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

export default function SocialMediaGenerator() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [submittedTopic, setSubmittedTopic] = useState('marketing');
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      topic: '',
      description: '',
      campaignGoal: 'Brand Awareness',
      platform: 'LinkedIn',
      tone: 'Professional',
      targetAudience: 'General Audience',
      ageGroup: '25-34',
      industry: 'Technology',
      brandName: 'Aethera',
      productName: 'Aethera SaaS',
      keywords: 'AI, Copywriting, Marketing',
      competitor: '',
      callToAction: 'Get started for free',
      language: 'English',
      creativityLevel: 'High',
      postLength: 'Medium',
      emojiUsage: 'Medium',
      numVariations: '3',
      includeCta: true,
      includeHashtags: true,
      imageStyle: 'Photorealistic Studio Shot',
      imageAspectRatio: '1:1',
      imageMood: 'Vibrant & Clean',
      brandColors: '#6b7280, #e5e7eb',
      logoUrl: '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setPosts([]);
    showToast('AI Campaign compiling neural components...', 'info');

    try {
      setSubmittedTopic(data.topic);
      const response = await socialAPI.generate(data);
      if (response.success && response.posts) {
        setPosts(response.posts);
        showToast(`Compiled social media campaign successfully!`, 'success');
      } else {
        showToast('Model parsing failure.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Generation failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast(message || 'Copy saved to clipboard!', 'success');
  };

  const handleRegenerate = async (post, idx) => {
    if (!post.id) {
      showToast('Log ID reference missing. Generate campaign first.', 'error');
      return;
    }
    setRegeneratingIdx(idx);
    showToast('Regenerating this variation...', 'info');
    try {
      const updatedPosts = await socialAPI.regenerate(post.id, idx);
      // Re-assign ids back to regenerated posts list
      const parsedWithIds = updatedPosts.map(p => ({ ...p, id: post.id }));
      setPosts(parsedWithIds);
      showToast('Variation regenerated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Regeneration failed.', 'error');
    } finally {
      setRegeneratingIdx(null);
    }
  };

  const handleToggleFavorite = async (post) => {
    if (!post.id) return;
    const isFav = favorites.includes(post.id);
    try {
      await socialAPI.favorite(post.id, !isFav);
      if (isFav) {
        setFavorites(favorites.filter(id => id !== post.id));
        showToast('Removed from favorites', 'info');
      } else {
        setFavorites([...favorites, post.id]);
        showToast('Added campaign to favorites', 'success');
      }
    } catch (err) {
      showToast('Failed to toggle favorite.', 'error');
    }
  };

  const handleDownload = async (post, type) => {
    try {
      const blob = type === 'pdf' 
        ? await socialAPI.exportPdf(post, submittedTopic, post.platform)
        : await socialAPI.exportTxt(post, submittedTopic, post.platform);
        
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aethera_${post.platform.toLowerCase()}_post.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast(`Exported as ${type.toUpperCase()}`, 'success');
    } catch (err) {
      showToast('Export document failed.', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Workspace share link copied to clipboard!', 'success');
  };

  const getPlatformIcon = (platform) => {
    switch(platform.toLowerCase()) {
      case 'instagram': return <InstagramIcon className="w-4 h-4 text-neon-pink" />;
      case 'linkedin': return <LinkedinIcon className="w-4 h-4 text-neon-blue" />;
      case 'facebook': return <FacebookIcon className="w-4 h-4 text-blue-500" />;
      case 'x (twitter)': return <TwitterIcon className="w-4 h-4 text-white" />;
      default: return <Sparkles className="w-4 h-4 text-neon-purple" />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Banner Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/dashboard')} className={styles.actionBtn} style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className={styles.subtitle}>Production Campaign Suite</span>
        <h2 className={styles.title}>
          AI Social Media <span className={styles.titleGlow}>Campaign Builder</span>
        </h2>
        <p className={styles.desc}>
          Compose brand social campaigns with Stability/Flux compatible render prompt synthesis and virality predictive indexing.
        </p>
      </div>

      {/* Main Workspace grid */}
      <div className={styles.workspaceGrid}>
        
        {/* Left Side: Campaign Generator Form */}
        <div className={styles.glassPanel}>
          <h3 className={styles.formSectionTitle}>
            <Sparkles className="w-4.5 h-4.5 text-neon-blue" /> Campaign Parameters
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Topic Input */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Topic / Campaign Name (Required)</label>
              <input
                type="text"
                placeholder="e.g. Next-Gen AI Copywriting tool launch"
                {...register('topic', { required: 'Topic is required', maxLength: { value: 150, message: 'Max 150 characters' } })}
                className={styles.input}
              />
              {errors.topic && <span className={styles.errorText}>{errors.topic.message}</span>}
            </div>

            {/* Description Input */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Detailed Description (Required)</label>
              <textarea
                placeholder="Detail what you are advertising, key differentiators, and what makes your launch unique..."
                {...register('description', { required: 'Description is required', maxLength: { value: 1000, message: 'Max 1000 characters' } })}
                className={`${styles.input} ${styles.textarea}`}
              />
              {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
            </div>

            {/* Brand and Product Details */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Brand Name</label>
                <input type="text" {...register('brandName')} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Product Name</label>
                <input type="text" {...register('productName')} className={styles.input} />
              </div>
            </div>

            {/* Industry and Keywords */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Industry</label>
                <input type="text" {...register('industry')} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Keywords</label>
                <input type="text" {...register('keywords')} className={styles.input} />
              </div>
            </div>

            {/* Target Audience details */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Target Audience</label>
                <input type="text" {...register('targetAudience')} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Age Group</label>
                <select {...register('ageGroup')} className={styles.input}>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                </select>
              </div>
            </div>

            {/* Campaign Options Grid */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Campaign Goal</label>
                <select {...register('campaignGoal')} className={styles.input}>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Sales">Sales</option>
                  <option value="Lead Generation">Lead Generation</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Target Platform</label>
                <select {...register('platform')} className={styles.input}>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="X (Twitter)">X (Twitter)</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Writing Tone</label>
                <select {...register('tone')} className={styles.input}>
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Promotional">Promotional</option>
                  <option value="Humorous">Humorous</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Language</label>
                <select {...register('language')} className={styles.input}>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            {/* Image Styling Parameters */}
            <h4 className={styles.label} style={{ marginTop: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
              Asset Generation Presets
            </h4>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Creative Style</label>
                <select {...register('imageStyle')} className={styles.input}>
                  <option value="Photorealistic Studio Shot">Photorealistic</option>
                  <option value="3D Digital Render">3D Render</option>
                  <option value="Vector Minimalist Illustration">Illustration</option>
                  <option value="Cyberpunk Tech Aesthetic">Cyberpunk</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Aspect Ratio</label>
                <select {...register('imageAspectRatio')} className={styles.input}>
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Visual Mood</label>
                <input type="text" {...register('imageMood')} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Brand Colors (Hex)</label>
                <input type="text" {...register('brandColors')} className={styles.input} />
              </div>
            </div>

            {/* Option Details */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Competitor Brand</label>
                <input type="text" {...register('competitor')} className={styles.input} placeholder="Optional" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Custom CTA Text</label>
                <input type="text" {...register('callToAction')} className={styles.input} />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Creativity Level</label>
                <select {...register('creativityLevel')} className={styles.input}>
                  <option value="Standard">Standard</option>
                  <option value="High">High</option>
                  <option value="Max (Wild)">Max (Wild)</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Variations Count</label>
                <select {...register('numVariations')} className={styles.input}>
                  <option value="1">1 Variant</option>
                  <option value="2">2 Variants</option>
                  <option value="3">3 Variants</option>
                  <option value="4">4 Variants</option>
                  <option value="5">5 Variants</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Neural Prompts...
                </>
              ) : (
                <>
                  Compile Social Campaign <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Variations list */}
        <div className={styles.outputsColumn}>
          <AnimatePresence mode="wait">
            
            {/* Empty State */}
            {!loading && posts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.emptyState}
              >
                <div className={styles.emptyIcon}>
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className={styles.emptyTitle}>Neural Sandbox Active</h4>
                <p className={styles.emptyDesc}>
                  Enter campaign specifications on the left to synthesize optimized copy variants, Stable Diffusion prompts, and analytics gauges.
                </p>
              </motion.div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
                style={{ width: '100%' }}
              >
                {[1, 2, 3].map((n) => (
                  <div key={n} className={styles.skeletonCard}>
                    <div className={styles.skeletonPulse} style={{ height: '14px', width: '30%', marginBottom: '8px' }} />
                    <div className={styles.skeletonPulse} style={{ height: '200px', width: '100%', marginBottom: '12px', borderRadius: '12px' }} />
                    <div className={styles.skeletonPulse} style={{ height: '18px', width: '90%', marginBottom: '8px' }} />
                    <div className={styles.skeletonPulse} style={{ height: '40px', width: '100%', marginBottom: '8px' }} />
                    <div className={styles.skeletonPulse} style={{ height: '14px', width: '60%' }} />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Generated campaign post cards */}
            {!loading && posts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
                style={{ width: '100%' }}
              >
                {posts.map((post, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={styles.variationCard}
                  >
                    {/* Header */}
                    <div className={styles.cardHeader}>
                      <div className={styles.badgeGroup}>
                        <span className={`${styles.badge} ${styles.badgePrimary}`}>
                          Variant {idx + 1}
                        </span>
                        <span className={`${styles.badge} ${styles.badgeSecondary} flex items-center gap-1`}>
                          {getPlatformIcon(post.platform || 'LinkedIn')}
                          {post.platform || 'LinkedIn'}
                        </span>
                      </div>
                      <span className={styles.readingTime}>
                        Est. Read: {post.reading_time || '12s'} &nbsp;|&nbsp; Best Time: {post.best_posting_time || '9:30 AM'}
                      </span>
                    </div>

                    {/* Dynamic Image Canvas Preview */}
                    <div className={styles.imagePreview}>
                      <img 
                        src={`https://loremflickr.com/800/500/${encodeURIComponent(
                          submittedTopic
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

                    {/* Creative Asset Prompt details */}
                    <div className={styles.glassPanel} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', marginBottom: '8px' }}>
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

                    {/* Content Section */}
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

                    {/* Interactive Analytics Dashboard Widgets */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '8px' }}>
                      <span className={styles.sectionLabel} style={{ display: 'block', marginBottom: '12px' }}>Campaign Quality Analytics</span>
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

                    {/* Stats */}
                    <span className={styles.charCount} style={{ marginTop: '8px' }}>
                      Characters: {post.character_count || 0}
                    </span>

                    {/* Card Actions Panel */}
                    <div className={styles.actionsBar}>
                      <button
                        onClick={() => handleToggleFavorite(post)}
                        className={`${styles.actionBtn} ${favorites.includes(post.id) ? styles.actionBtnFavActive : ''}`}
                        title="Favorite"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" /> Favorite
                      </button>
                      <button
                        onClick={() => handleCopy(`${post.hook}\n\n${post.caption}\n\n${post.cta}`, 'Copy content saved!')}
                        className={styles.actionBtn}
                        title="Copy Text Content"
                      >
                        <Copy className="w-3.5 h-3.5" /> Content
                      </button>
                      <button
                        onClick={() => handleCopy(post.hashtags.join(' '), 'Copy hashtags saved!')}
                        className={styles.actionBtn}
                        title="Copy hashtags list"
                      >
                        <Copy className="w-3.5 h-3.5" /> Tags
                      </button>
                      <button
                        onClick={() => handleRegenerate(post, idx)}
                        disabled={regeneratingIdx === idx}
                        className={styles.actionBtn}
                        title="Regenerate this specific variation"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${regeneratingIdx === idx ? 'animate-spin' : ''}`} /> Re-gen
                      </button>
                      <button
                        onClick={() => handleDownload(post, 'txt')}
                        className={styles.actionBtn}
                        title="Download as TXT file"
                      >
                        <Download className="w-3.5 h-3.5" /> TXT
                      </button>
                      <button
                        onClick={() => handleDownload(post, 'pdf')}
                        className={styles.actionBtn}
                        title="Download PDF campaign layout"
                      >
                        <FileText className="w-3.5 h-3.5" /> PDF
                      </button>
                      <button
                        onClick={handleShare}
                        className={styles.actionBtn}
                        title="Share Campaign link"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
