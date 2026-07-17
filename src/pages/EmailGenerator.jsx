import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, Copy, Download, Heart, ArrowLeft, 
  RefreshCw, FileText, Check, Mail, Lock, User, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { emailAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import styles from '../styles/EmailGenerator.module.css';

export default function EmailGenerator() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [submittedCampaignName, setSubmittedCampaignName] = useState('Campaign');
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Send Modal States
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedPostToSend, setSelectedPostToSend] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      campaignName: '',
      emailType: 'Cold Outreach',
      targetAudience: '',
      productName: '',
      valueProposition: '',
      callToAction: '',
      tone: 'Professional',
      senderName: 'Aethera Team',
      senderRole: 'Growth Lead',
      companyName: 'Aethera',
      personalizationInstructions: '',
      emailLength: 'Short',
      subjectLineStyle: 'Curiosity',
      numVariations: '3',
    }
  });

  // Modal SMTP Form States
  const [smtpSender, setSmtpSender] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpRecipient, setSmtpRecipient] = useState('');
  const [smtpSubject, setSmtpSubject] = useState('');
  const [smtpBody, setSmtpBody] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setEmails([]);
    showToast('AI Outreach Architect building conversion funnels...', 'info');

    try {
      setSubmittedCampaignName(data.campaignName);
      const response = await emailAPI.generate(data);
      if (response.success && response.posts) {
        setEmails(response.posts);
        setActiveTab(0);
        showToast('AI Email campaign compiled successfully!', 'success');
      } else {
        showToast('Failed to compile campaigns.', 'error');
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
    showToast(message || 'Copied to clipboard!', 'success');
  };

  const handleCopyEntireEmail = (post) => {
    const bodyText = post.body_paragraphs.join('\n\n');
    const psText = post.ps_note ? `\n\nP.S. ${post.ps_note}` : '';
    const entireText = `${post.salutation}\n\n${bodyText}\n\n${post.call_to_action_text}\n\n${post.sign_off}${psText}`;
    handleCopy(entireText, 'Full email body copied to clipboard!');
  };

  const handleRegenerate = async (post, idx) => {
    if (!post.id) {
      showToast('Campaign reference ID missing. Run generation first.', 'error');
      return;
    }
    setRegeneratingIdx(idx);
    showToast('Regenerating this variation...', 'info');
    try {
      const updatedEmails = await emailAPI.regenerate(post.id, idx);
      const parsedWithIds = updatedEmails.map(p => ({ ...p, id: post.id }));
      setEmails(parsedWithIds);
      showToast('Email variation regenerated!', 'success');
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
      await emailAPI.favorite(post.id, !isFav);
      if (isFav) {
        setFavorites(favorites.filter(id => id !== post.id));
        showToast('Removed from favorites', 'info');
      } else {
        setFavorites([...favorites, post.id]);
        showToast('Added to favorites', 'success');
      }
    } catch (err) {
      showToast('Failed to update favorite.', 'error');
    }
  };

  const handleDownload = async (post, type) => {
    try {
      const blob = type === 'pdf' 
        ? await emailAPI.exportPdf(post, submittedCampaignName)
        : await emailAPI.exportTxt(post, submittedCampaignName);
        
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aethera_email_${submittedCampaignName.toLowerCase().replace(/ /g, '_')}_var${activeTab + 1}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast(`Exported as ${type.toUpperCase()}`, 'success');
    } catch (err) {
      showToast('Export document failed.', 'error');
    }
  };

  const openSendModal = (post) => {
    const bodyText = post.body_paragraphs.join('\n\n');
    const psText = post.ps_note ? `\n\nP.S. ${post.ps_note}` : '';
    const fullBody = `${post.salutation}\n\n${bodyText}\n\n[CTA: ${post.call_to_action_text}]\n\n${post.sign_off}${psText}`;
    
    setSelectedPostToSend(post);
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

  return (
    <div className={styles.container}>
      {/* Top Banner Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/dashboard')} className={styles.actionBtn} style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className={styles.subtitle}>AI Outreach Engine</span>
        <h2 className={styles.title}>
          AI Gmail & Email <span className={styles.titleGlow}>Campaign Builder</span>
        </h2>
        <p className={styles.desc}>
          Architect high-converting cold outreach, drip sequences, and marketing newsletters with integrated automated Gmail delivery.
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
            {/* Campaign Name Input */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Campaign Name (Required)</label>
              <input
                type="text"
                placeholder="e.g. Aethera SaaS Q3 Beta Launch"
                {...register('campaignName', { required: 'Campaign name is required' })}
                className={styles.input}
              />
              {errors.campaignName && <span className={styles.errorText}>{errors.campaignName.message}</span>}
            </div>

            {/* Email Type and Tone */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email Type</label>
                <select {...register('emailType')} className={styles.select}>
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Newsletter">Newsletter</option>
                  <option value="Welcome Drip">Welcome Drip</option>
                  <option value="Follow-up Sequence">Follow-up Sequence</option>
                  <option value="Promotional Sale">Promotional Sale</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Tone / Style</label>
                <select {...register('tone')} className={styles.select}>
                  <option value="Professional">Professional & Sleek</option>
                  <option value="Casual">Casual & Conversational</option>
                  <option value="Urgent">Urgent & Direct</option>
                  <option value="Friendly">Friendly & Enthusiastic</option>
                  <option value="Curious">Intriguing & Curious</option>
                </select>
              </div>
            </div>

            {/* Target Audience & Product Name */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Target Audience (Required)</label>
                <input
                  type="text"
                  placeholder="e.g. CMOs, SaaS Founders"
                  {...register('targetAudience', { required: 'Audience is required' })}
                  className={styles.input}
                />
                {errors.targetAudience && <span className={styles.errorText}>{errors.targetAudience.message}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Product / Service Name (Required)</label>
                <input
                  type="text"
                  placeholder="e.g. Aethera Copywriting Engine"
                  {...register('productName', { required: 'Product name is required' })}
                  className={styles.input}
                />
                {errors.productName && <span className={styles.errorText}>{errors.productName.message}</span>}
              </div>
            </div>

            {/* Value Proposition */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Key Value Proposition (Required)</label>
              <textarea
                placeholder="What pain point does your product solve? e.g. Generates production-ready B2B marketing copies in seconds, reducing turnaround time by 85%."
                {...register('valueProposition', { required: 'Value proposition is required' })}
                className={`${styles.input} ${styles.textarea}`}
              />
              {errors.valueProposition && <span className={styles.errorText}>{errors.valueProposition.message}</span>}
            </div>

            {/* CTA & Subject Line Style */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Call to Action (CTA)</label>
                <input
                  type="text"
                  placeholder="e.g. Book a 15-min discovery call"
                  {...register('callToAction', { required: 'CTA text is required' })}
                  className={styles.input}
                />
                {errors.callToAction && <span className={styles.errorText}>{errors.callToAction.message}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Subject Style</label>
                <select {...register('subjectLineStyle')} className={styles.select}>
                  <option value="Curiosity">Curiosity / Hook</option>
                  <option value="Direct/Benefit">Direct / Benefit-Focused</option>
                  <option value="Question">Question-Based</option>
                  <option value="Urgent">Urgent / Time-Sensitive</option>
                </select>
              </div>
            </div>

            {/* Sender details and company */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Sender Name</label>
                <input type="text" {...register('senderName')} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Sender Role</label>
                <input type="text" {...register('senderRole')} className={styles.input} />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Company Name</label>
                <input type="text" {...register('companyName')} className={styles.input} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email Length</label>
                <select {...register('emailLength')} className={styles.select}>
                  <option value="Short">Short (Under 150 words)</option>
                  <option value="Medium">Medium (150-250 words)</option>
                  <option value="Long">Long (250+ words)</option>
                </select>
              </div>
            </div>

            {/* Personalization Instructions */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Personalization / Custom Rules</label>
              <textarea
                placeholder="e.g. Reference their recent LinkedIn post, keep paragraph length to maximum two sentences."
                {...register('personalizationInstructions')}
                className={`${styles.input} ${styles.textarea}`}
                style={{ minHeight: '60px' }}
              />
            </div>

            {/* Variations Count */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Number of Variations (1-5)</label>
              <select {...register('numVariations')} className={styles.select}>
                <option value="1">1 Option</option>
                <option value="2">2 Options</option>
                <option value="3">3 Options</option>
                <option value="4">4 Options</option>
                <option value="5">5 Options</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Conversion Copy...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5" /> Compile Email Campaign
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Generation Results Workspace */}
        <div className={styles.glassPanel} style={{ display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
          {loading ? (
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="w-12 h-12 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-white/60 text-center">
                Processing prompts through Llama models... <br/>
                <span className="text-xs font-normal text-white/30">Constructing engagement triggers and scores</span>
              </p>
            </div>
          ) : emails.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'rgba(255, 255, 255, 0.35)' }}>
              <Mail className="w-12 h-12 text-neon-blue/30 mx-auto mb-4" />
              <h4 style={{ fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>No campaigns generated</h4>
              <p className="text-xs max-w-sm">
                Enter your campaign guidelines in the parameters form and compile to view variations.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <h3 className={styles.resultsTitle}>
                  <Sparkles className="w-5 h-5 text-neon-purple" /> Campaign Output
                </h3>
              </div>

              {/* Tab Selector */}
              <div className={styles.tabContainer}>
                {emails.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`${styles.tab} ${activeTab === idx ? styles.activeTab : ''}`}
                  >
                    Variant {idx + 1}
                  </button>
                ))}
              </div>

              {/* Email Content Frame */}
              {emails[activeTab] && (
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className={styles.emailContentCard}>
                    <div className={styles.emailMeta}>
                      <div className={styles.emailSubject}>
                        <span className="text-neon-cyan">Subject:</span> {emails[activeTab].subject_line}
                      </div>
                      <div className={styles.emailPreheader}>
                        <span className="text-white/40">Preheader:</span> {emails[activeTab].preheader}
                      </div>
                    </div>
                    
                    <div className={styles.emailBody}>
                      <p>{emails[activeTab].salutation}</p>
                      {emails[activeTab].body_paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                      
                      <button className={styles.emailCta}>
                        {emails[activeTab].call_to_action_text}
                      </button>
                      
                      <p>{emails[activeTab].sign_off}</p>
                      
                      {emails[activeTab].ps_note && (
                        <p className={styles.emailPs}>P.S. {emails[activeTab].ps_note}</p>
                      )}
                    </div>
                  </div>

                  {/* Metrics and Framework */}
                  <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Spam Score</span>
                      <span className={styles.metricValue} style={{ color: emails[activeTab].spam_word_score < 30 ? '#10b981' : '#f59e0b' }}>
                        {emails[activeTab].spam_word_score}/100
                      </span>
                    </div>
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Readability</span>
                      <span className={styles.metricValue} style={{ color: '#00f0ff' }}>
                        {emails[activeTab].readability_score}/100
                      </span>
                    </div>
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Est. Open Rate</span>
                      <span className={styles.metricValue} style={{ color: '#10b981' }}>
                        {emails[activeTab].estimated_open_rate}
                      </span>
                    </div>
                    <div className={styles.metricCard}>
                      <span className={styles.metricLabel}>Est. Click Rate</span>
                      <span className={styles.metricValue} style={{ color: '#bd00ff' }}>
                        {emails[activeTab].estimated_click_rate}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <span className="font-bold text-neon-blue">Psychological Trigger Framework:</span> {emails[activeTab].psychological_framework}
                  </div>

                  {/* Actions Row */}
                  <div className={styles.actionRow}>
                    <button onClick={() => handleToggleFavorite(emails[activeTab])} className={styles.actionBtn}>
                      <Heart className="w-4 h-4" fill={favorites.includes(emails[activeTab].id) ? '#ff3366' : 'none'} color={favorites.includes(emails[activeTab].id) ? '#ff3366' : 'currentColor'} /> Favorite
                    </button>
                    <button onClick={() => handleCopyEntireEmail(emails[activeTab])} className={styles.actionBtn}>
                      <Copy className="w-4 h-4" /> Copy Content
                    </button>
                    <button onClick={() => handleDownload(emails[activeTab], 'txt')} className={styles.actionBtn}>
                      <FileText className="w-4 h-4" /> TXT
                    </button>
                    <button onClick={() => handleDownload(emails[activeTab], 'pdf')} className={styles.actionBtn}>
                      <Download className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={() => openSendModal(emails[activeTab])} className={`${styles.actionBtn} ${styles.sendBtn}`}>
                      <Send className="w-4 h-4" /> Send via Gmail
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>

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

                {/* Subject Line (Read-only/Editable preview) */}
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
