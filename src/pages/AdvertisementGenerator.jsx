import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { advertisementAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import AdvertisementForm from '../components/Advertisement/AdvertisementForm';
import AdvertisementResult from '../components/Advertisement/AdvertisementResult';
import styles from '../styles/SocialMediaGenerator.module.css';

export default function AdvertisementGenerator() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setPosts([]);
    showToast('AI compiling advertisement components...', 'info');

    try {
      const response = await advertisementAPI.generate(data);
      if (response.success && response.posts) {
        setPosts(response.posts);
        showToast('Compiled advertisement variants successfully!', 'success');
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

  const handleRegenerate = async (post, idx) => {
    if (!post.id) return;
    setRegeneratingIdx(idx);
    showToast('Regenerating variant...', 'info');
    try {
      const updatedPosts = await advertisementAPI.regenerate(post.id, idx);
      const parsedWithIds = updatedPosts.map(p => ({ ...p, id: post.id }));
      setPosts(parsedWithIds);
      showToast('Regenerated successfully!', 'success');
    } catch (err) {
      showToast('Regeneration failed.', 'error');
    } finally {
      setRegeneratingIdx(null);
    }
  };

  const handleFavorite = async (post) => {
    if (!post.id) return;
    try {
      await advertisementAPI.favorite(post.id, !post.favorite);
      setPosts(posts.map(p => p.id === post.id ? { ...p, favorite: !post.favorite } : p));
      showToast(post.favorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (err) {
      showToast('Failed to favorite', 'error');
    }
  };

  const handleDownload = async (post, type) => {
    try {
      const blob = type === 'pdf'
        ? await advertisementAPI.exportPdf(post, 'Ad', 'Platform')
        : await advertisementAPI.exportTxt(post, 'Ad', 'Platform');
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aethera_ad.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast(`Exported as ${type.toUpperCase()}`, 'success');
    } catch (err) {
      showToast('Export document failed.', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/dashboard')} className={styles.actionBtn} style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className={styles.subtitle}>Production Campaign Suite</span>
        <h2 className={styles.title}>
          AI Advertisement <span className={styles.titleGlow}>Campaign Builder</span>
        </h2>
        <p className={styles.desc}>
          Compose brand ad campaigns with specific target audience analysis and marketing frameworks.
        </p>
      </div>

      <div className={styles.workspaceGrid}>
        <div className={styles.glassPanel}>
          <AdvertisementForm onSubmit={onSubmit} loading={loading} />
        </div>

        <div className={styles.outputsColumn}>
          <AnimatePresence mode="wait">
            {!loading && posts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.emptyState}>
                <div className={styles.emptyIcon}><FileText className="w-8 h-8" /></div>
                <h4 className={styles.emptyTitle}>Neural Sandbox Active</h4>
                <p className={styles.emptyDesc}>Enter campaign specifications on the left to synthesize optimized ad variants.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {[1, 2].map((n) => (
                  <div key={n} className={styles.skeletonCard}>
                    <div className={styles.skeletonPulse} style={{ height: '20px', width: '40%', marginBottom: '16px' }} />
                    <div className={styles.skeletonPulse} style={{ height: '80px', width: '100%', marginBottom: '12px', borderRadius: '8px' }} />
                    <div className={styles.skeletonPulse} style={{ height: '20px', width: '20%' }} />
                  </div>
                ))}
              </motion.div>
            )}

            {!loading && posts.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {posts.map((post, idx) => (
                  <AdvertisementResult
                    key={idx}
                    post={post}
                    idx={idx}
                    onRegenerate={() => handleRegenerate(post, idx)}
                    isRegenerating={regeneratingIdx === idx}
                    onFavorite={() => handleFavorite(post)}
                    isFavorite={post.favorite}
                    onDownload={(type) => handleDownload(post, type)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
