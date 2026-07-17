import React, { useEffect, useState } from 'react';
import { Search, Heart, Trash2, Download, FileText, Send, Copy, RefreshCw, Mail, User, Lock } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { emailAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../styles/EmailGenerator.module.css';

export default function EmailHistory() {
  const showToast = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFav, setFilterFav] = useState(false);
  const [activeTabs, setActiveTabs] = useState({}); // Mapping record.id -> variant index

  // Send Modal States
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedCampaignName, setSelectedCampaignName] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [smtpSender, setSmtpSender] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpRecipient, setSmtpRecipient] = useState('');
  const [smtpSubject, setSmtpSubject] = useState('');
  const [smtpBody, setSmtpBody] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await emailAPI.getHistory();
      setHistory(data);
    } catch (err) {
      showToast('Failed to load email history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this email campaign?')) return;
    try {
      await emailAPI.deleteHistory(id);
      setHistory(history.filter(h => h.id !== id));
      showToast('Deleted record', 'info');
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const handleFavorite = async (id, currentStatus) => {
    try {
      await emailAPI.favorite(id, !currentStatus);
      setHistory(history.map(h => h.id === id ? { ...h, favorite: !currentStatus } : h));
      showToast(!currentStatus ? 'Added to favorites' : 'Removed from favorites', 'success');
    } catch (err) {
      showToast('Failed to update favorite', 'error');
    }
  };

  const handleCopyEntireEmail = (post) => {
    const bodyText = post.body_paragraphs.join('\n\n');
    const psText = post.ps_note ? `\n\nP.S. ${post.ps_note}` : '';
    const entireText = `${post.salutation}\n\n${bodyText}\n\n${post.call_to_action_text}\n\n${post.sign_off}${psText}`;
    navigator.clipboard.writeText(entireText);
    showToast('Full email copy saved to clipboard!', 'success');
  };

  const handleDownload = async (post, campaignName, type, varIdx) => {
    try {
      const blob = type === 'pdf' 
        ? await emailAPI.exportPdf(post, campaignName)
        : await emailAPI.exportTxt(post, campaignName);
        
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aethera_email_${campaignName.toLowerCase().replace(/ /g, '_')}_var${varIdx + 1}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast(`Exported as ${type.toUpperCase()}`, 'success');
    } catch (err) {
      showToast('Export document failed.', 'error');
    }
  };

  const openSendModal = (post, campaignName) => {
    const bodyText = post.body_paragraphs.join('\n\n');
    const psText = post.ps_note ? `\n\nP.S. ${post.ps_note}` : '';
    const fullBody = `${post.salutation}\n\n${bodyText}\n\n[CTA: ${post.call_to_action_text}]\n\n${post.sign_off}${psText}`;
    
    setSelectedCampaignName(campaignName);
    setSmtpSubject(post.subject_line);
    setSmtpBody(fullBody);
    setIsSendModalOpen(true);
  };

  const handleSendGmail = async () => {
    if (!smtpSender || !smtpPassword || !smtpRecipient) {
      showToast('Please fill in Sender Gmail, App Password, and Recipient Email.', 'warning');
      return;
    }

    setSendingEmail(true);
    showToast('Connecting to Gmail SMTP relays...', 'info');

    try {
      const payload = {
        senderEmail: smtpSender,
        appPassword: smtpPassword,
        recipientEmail: smtpRecipient,
        subject: smtpSubject,
        body: smtpBody
      };
      
      const res = await emailAPI.sendGmail(payload);
      if (res.success) {
        showToast('Email delivered successfully through Gmail!', 'success');
        setIsSendModalOpen(false);
      } else {
        showToast('SMTP delivery failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.detail || err.message || 'SMTP sending failed.', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFav = filterFav ? item.favorite : true;
    return matchesSearch && matchesFav;
  });

  const getActiveVarIndex = (recordId) => {
    return activeTabs[recordId] !== undefined ? activeTabs[recordId] : 0;
  };

  const setActiveVarIndex = (recordId, index) => {
    setActiveTabs(prev => ({ ...prev, [recordId]: index }));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-white/50">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-4" /> Loading History...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search by campaign or product name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-neon-cyan"
          />
        </div>
        <button 
          onClick={() => setFilterFav(!filterFav)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${filterFav ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
        >
          <Heart className="w-4 h-4" fill={filterFav ? 'currentColor' : 'none'} /> Favorites
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center p-12 glass-panel rounded-2xl border border-white/10 text-white/50 text-sm">
          No email campaigns found in history.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredHistory.map(record => {
            const varIdx = getActiveVarIndex(record.id);
            const variations = record.generated_content || [];
            const activePost = variations[varIdx];

            return (
              <div key={record.id} className="glass-panel p-6 rounded-3xl border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{record.campaign_name || 'Untitled Campaign'}</h3>
                    <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">
                      {record.product_name} • {record.email_type} • {new Date(record.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleFavorite(record.id, record.favorite)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors">
                      <Heart className="w-4 h-4" fill={record.favorite ? '#ff3366' : 'none'} color={record.favorite ? '#ff3366' : 'currentColor'} />
                    </button>
                    <button onClick={() => handleDelete(record.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-tab Selectors for variations */}
                {variations.length > 1 && (
                  <div className={styles.tabContainer} style={{ marginBottom: '16px', paddingBottom: '8px' }}>
                    {variations.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVarIndex(record.id, idx)}
                        className={`${styles.tab} ${varIdx === idx ? styles.activeTab : ''}`}
                        style={{ fontSize: '11px', padding: '6px 12px' }}
                      >
                        Variant {idx + 1}
                      </button>
                    ))}
                  </div>
                )}

                {activePost && (
                  <div>
                    <div className={styles.emailContentCard} style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                      <div className={styles.emailMeta}>
                        <div className={styles.emailSubject}>
                          <span className="text-neon-cyan">Subject:</span> {activePost.subject_line}
                        </div>
                        <div className={styles.emailPreheader}>
                          <span className="text-white/40">Preheader:</span> {activePost.preheader}
                        </div>
                      </div>
                      
                      <div className={styles.emailBody}>
                        <p>{activePost.salutation}</p>
                        {activePost.body_paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                        
                        <button className={styles.emailCta}>
                          {activePost.call_to_action_text}
                        </button>
                        
                        <p>{activePost.sign_off}</p>
                        
                        {activePost.ps_note && (
                          <p className={styles.emailPs}>P.S. {activePost.ps_note}</p>
                        )}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricCard}>
                        <span className={styles.metricLabel}>Spam Score</span>
                        <span className={styles.metricValue} style={{ color: activePost.spam_word_score < 30 ? '#10b981' : '#f59e0b' }}>
                          {activePost.spam_word_score}/100
                        </span>
                      </div>
                      <div className={styles.metricCard}>
                        <span className={styles.metricLabel}>Readability</span>
                        <span className={styles.metricValue} style={{ color: '#00f0ff' }}>
                          {activePost.readability_score}/100
                        </span>
                      </div>
                      <div className={styles.metricCard}>
                        <span className={styles.metricLabel}>Est. Open Rate</span>
                        <span className={styles.metricValue} style={{ color: '#10b981' }}>
                          {activePost.estimated_open_rate}
                        </span>
                      </div>
                      <div className={styles.metricCard}>
                        <span className={styles.metricLabel}>Est. Click Rate</span>
                        <span className={styles.metricValue} style={{ color: '#bd00ff' }}>
                          {activePost.estimated_click_rate}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <span className="font-bold text-neon-blue">Psychological Trigger Framework:</span> {activePost.psychological_framework}
                    </div>

                    {/* Action buttons */}
                    <div className={styles.actionRow}>
                      <button onClick={() => handleCopyEntireEmail(activePost)} className={styles.actionBtn}>
                        <Copy className="w-4 h-4" /> Copy Content
                      </button>
                      <button onClick={() => handleDownload(activePost, record.campaign_name, 'txt', varIdx)} className={styles.actionBtn}>
                        <FileText className="w-4 h-4" /> TXT
                      </button>
                      <button onClick={() => handleDownload(activePost, record.campaign_name, 'pdf', varIdx)} className={styles.actionBtn}>
                        <Download className="w-4 h-4" /> PDF
                      </button>
                      <button onClick={() => openSendModal(activePost, record.campaign_name)} className={`${styles.actionBtn} ${styles.sendBtn}`}>
                        <Send className="w-4 h-4" /> Send via Gmail
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Gmail SMTP Sender Modal */}
      <AnimatePresence>
        {isSendModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modalContent}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  <Mail className="w-5 h-5 text-neon-cyan" /> Gmail Delivery Node
                </h3>
                <button onClick={() => setIsSendModalOpen(false)} className={styles.closeBtn}>
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <p className="text-xs text-white/50 leading-relaxed">
                  Send this generated email variant directly to any inbox. For security, Gmail requires using an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="text-neon-blue underline">App Password</a> instead of your primary password.
                </p>

                {/* Sender Email Address */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Sender Gmail Address</label>
                  <div style={{ position: 'relative' }}>
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      type="email" 
                      placeholder="username@gmail.com" 
                      value={smtpSender}
                      onChange={(e) => setSmtpSender(e.target.value)}
                      className={styles.input}
                      style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* App Password */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Gmail App Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      type="password" 
                      placeholder="xxxx xxxx xxxx xxxx" 
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      className={styles.input}
                      style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Recipient Email */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Recipient Email</label>
                  <div style={{ position: 'relative' }}>
                    <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      type="email" 
                      placeholder="target-lead@company.com" 
                      value={smtpRecipient}
                      onChange={(e) => setSmtpRecipient(e.target.value)}
                      className={styles.input}
                      style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Subject Line */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Email Subject</label>
                  <input 
                    type="text" 
                    value={smtpSubject}
                    onChange={(e) => setSmtpSubject(e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* Email Body */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Email Body Content</label>
                  <textarea 
                    value={smtpBody}
                    onChange={(e) => setSmtpBody(e.target.value)}
                    className={styles.textarea}
                    style={{ minHeight: '150px' }}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  onClick={() => setIsSendModalOpen(false)} 
                  disabled={sendingEmail}
                  className={styles.actionBtn}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendGmail} 
                  disabled={sendingEmail}
                  className={`${styles.actionBtn} ${styles.sendBtn}`}
                  style={{ padding: '8px 24px' }}
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Email
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
