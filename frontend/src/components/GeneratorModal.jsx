import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Copy, RefreshCw, Download, Sparkles, Send,
  Mail, Box, Target, FileText, ArrowRight
} from 'lucide-react';

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
import { useToast } from '../hooks/useToast';
import { 
  generateSocialCopy, 
  generateEmailCopy, 
  generateProductCopy, 
  generateAdCopy 
} from '../utils/mockAiService';
import {
  generateSocialWithGemini,
  generateEmailWithGemini,
  generateProductWithGemini,
  generateAdWithGemini
} from '../utils/geminiService';
import { advertisementAPI } from '../services/api';

export default function GeneratorModal({ feature, isOpen, onClose }) {
  const showToast = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState(null);
  
  // Social Form States
  const [socialForm, setSocialForm] = useState({
    productName: '', productDescription: '', targetAudience: '',
    platform: 'linkedin', tone: 'professional', language: 'english',
    campaignGoal: 'brand awareness', keywords: ''
  });

  // Email Form States
  const [emailForm, setEmailForm] = useState({
    product: '', recipient: '', purpose: 'onboarding',
    tone: 'friendly', language: 'english', cta: ''
  });

  // Product Form States
  const [productForm, setProductForm] = useState({
    productName: '', category: '', features: '',
    benefits: '', audience: '', tone: 'persuasive'
  });

  // Ad Form States
  const [adForm, setAdForm] = useState({
    product: '', campaignGoal: 'leads', audience: '',
    platform: 'facebook', budget: 'balanced', tone: 'bold'
  });

  // Reset states when modal changes
  useEffect(() => {
    setOutput(null);
    setIsGenerating(false);
  }, [feature, isOpen]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setOutput(null);

    try {
      let result = null;
      if (feature === 'social') result = await generateSocialWithGemini(socialForm);
      else if (feature === 'email') result = await generateEmailWithGemini(emailForm);
      else if (feature === 'product') result = await generateProductWithGemini(productForm);
      else if (feature === 'ad') result = await advertisementAPI.generate(adForm);

      setOutput(result);
      setIsGenerating(false);
      showToast('AI content generated!', 'success');
    } catch (err) {
      console.warn('API call failed, falling back to local simulation:', err);
      // Wait for a short duration to show particles before showing fallback output
      setTimeout(async () => {
        let result = null;
        if (feature === 'social') result = generateSocialCopy(socialForm);
        else if (feature === 'email') result = generateEmailCopy(emailForm);
        else if (feature === 'product') result = generateProductCopy(productForm);
        else if (feature === 'ad') {
          // Attempt advertisement API fallback if gemini was used, though we now use API directly
          try {
             result = await advertisementAPI.generate(adForm);
          } catch(e) {
             result = generateAdCopy(adForm);
          }
        }

        setOutput(result);
        setIsGenerating(false);
        showToast('Generated via Aethera local simulator', 'warning');
      }, 3000);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  const handleDownload = (text, filename) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${filename}.txt`;
    document.body.appendChild(element);
    element.click();
    showToast('Downloaded text file', 'success');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-dark-bg/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-5xl glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] grid grid-cols-1 lg:grid-cols-12 min-h-[600px] max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT COLUMN: Input Form (5 cols on lg) */}
          <div className="lg:col-span-5 border-r border-white/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] no-scrollbar">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-dark-bg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {feature === 'social' && 'Social Post AI'}
                    {feature === 'email' && 'Email Copy AI'}
                    {feature === 'product' && 'Product Copy AI'}
                    {feature === 'ad' && 'Ad Campaign AI'}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-neon-blue font-bold">Creative Model v4.2</span>
                </div>
              </div>

              {/* SOCIAL MEDIA FORM */}
              {feature === 'social' && (
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aethera SaaS"
                      value={socialForm.productName}
                      onChange={e => setSocialForm({...socialForm, productName: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Description</label>
                    <textarea
                      required
                      placeholder="What does it do?"
                      value={socialForm.productDescription}
                      onChange={e => setSocialForm({...socialForm, productDescription: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white min-h-[60px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Audience</label>
                      <input
                        type="text"
                        placeholder="e.g. Marketers"
                        value={socialForm.targetAudience}
                        onChange={e => setSocialForm({...socialForm, targetAudience: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Platform</label>
                      <select
                        value={socialForm.platform}
                        onChange={e => setSocialForm({...socialForm, platform: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="instagram">Instagram</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Tone</label>
                      <select
                        value={socialForm.tone}
                        onChange={e => setSocialForm({...socialForm, tone: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="professional">Professional</option>
                        <option value="bold">Bold & Hype</option>
                        <option value="educational">Educational</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Goal</label>
                      <input
                        type="text"
                        placeholder="e.g. Conversions"
                        value={socialForm.campaignGoal}
                        onChange={e => setSocialForm({...socialForm, campaignGoal: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Keywords (comma separated)</label>
                    <input
                      type="text"
                      placeholder="ai, startup, growth"
                      value={socialForm.keywords}
                      onChange={e => setSocialForm({...socialForm, keywords: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full py-3 mt-4 rounded-xl text-xs font-semibold text-dark-bg bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer"
                  >
                    Generate Content <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* EMAIL GENERATOR FORM */}
              {feature === 'email' && (
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Product / Service</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aethera Suite"
                      value={emailForm.product}
                      onChange={e => setEmailForm({...emailForm, product: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Recipient (Audience)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Inactive subscribers"
                      value={emailForm.recipient}
                      onChange={e => setEmailForm({...emailForm, recipient: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Purpose</label>
                      <select
                        value={emailForm.purpose}
                        onChange={e => setEmailForm({...emailForm, purpose: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="outreach">Cold Outreach</option>
                        <option value="onboarding">User Onboarding</option>
                        <option value="retention">Retention Offer</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Tone</label>
                      <select
                        value={emailForm.tone}
                        onChange={e => setEmailForm({...emailForm, tone: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="friendly">Friendly</option>
                        <option value="professional">Professional</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Call to Action (CTA)</label>
                    <input
                      type="text"
                      placeholder="e.g. Schedule a 15 min demo"
                      value={emailForm.cta}
                      onChange={e => setEmailForm({...emailForm, cta: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full py-3 mt-6 rounded-xl text-xs font-semibold text-dark-bg bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer"
                  >
                    Generate Email <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* PRODUCT DESCRIPTION FORM */}
              {feature === 'product' && (
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AeroPod Max"
                      value={productForm.productName}
                      onChange={e => setProductForm({...productForm, productName: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Audio Gear"
                      value={productForm.category}
                      onChange={e => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Features (comma separated)</label>
                    <textarea
                      placeholder="Active Noise Cancellation, 40h Battery"
                      value={productForm.features}
                      onChange={e => setProductForm({...productForm, features: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white min-h-[40px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Benefits (comma separated)</label>
                    <textarea
                      placeholder="Silence absolute noise, Long listening trips"
                      value={productForm.benefits}
                      onChange={e => setProductForm({...productForm, benefits: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white min-h-[40px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Audience</label>
                      <input
                        type="text"
                        placeholder="e.g. Audiophiles"
                        value={productForm.audience}
                        onChange={e => setProductForm({...productForm, audience: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Tone</label>
                      <select
                        value={productForm.tone}
                        onChange={e => setProductForm({...productForm, tone: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="persuasive">Persuasive</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="bold">Bold & Punchy</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full py-3 mt-4 rounded-xl text-xs font-semibold text-dark-bg bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer"
                  >
                    Generate Copy <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* AD GENERATOR FORM */}
              {feature === 'ad' && (
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Product / Campaign Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nebula Launch"
                      value={adForm.product}
                      onChange={e => setAdForm({...adForm, product: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Platform</label>
                      <select
                        value={adForm.platform}
                        onChange={e => setAdForm({...adForm, platform: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="facebook">Facebook Ads</option>
                        <option value="google">Google Search Ads</option>
                        <option value="linkedin">LinkedIn Sponsored</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Goal</label>
                      <select
                        value={adForm.campaignGoal}
                        onChange={e => setAdForm({...adForm, campaignGoal: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="leads">Lead Generation</option>
                        <option value="conversions">Conversions</option>
                        <option value="traffic">Traffic Boost</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Target Audience</label>
                    <input
                      type="text"
                      placeholder="e.g. Small business owners"
                      value={adForm.audience}
                      onChange={e => setAdForm({...adForm, audience: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Budget Level</label>
                      <select
                        value={adForm.budget}
                        onChange={e => setAdForm({...adForm, budget: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="conservative">Conservative</option>
                        <option value="balanced">Balanced</option>
                        <option value="aggressive">Aggressive</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Tone</label>
                      <select
                        value={adForm.tone}
                        onChange={e => setAdForm({...adForm, tone: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white"
                      >
                        <option value="bold">Bold & Magnetic</option>
                        <option value="informative">Informative</option>
                        <option value="urgent">Urgent Deal</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full py-3 mt-6 rounded-xl text-xs font-semibold text-dark-bg bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer"
                  >
                    Generate Ad Variant <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
            
            <p className="text-[9px] text-white/20 mt-6 text-center">
              Powered by Aethera AI Neural Network Core LLM. Secure end-to-end sandbox.
            </p>
          </div>

          {/* RIGHT COLUMN: Visual animations & output previews (7 cols on lg) */}
          <div className="lg:col-span-7 bg-black/40 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
            <div className="flex-grow flex flex-col justify-center items-center relative min-h-[350px]">
              
              {/* STATE 1: Empty state before generation */}
              {!isGenerating && !output && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-white/30" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white/80">Awaiting Input Parameters</h4>
                    <p className="text-xs text-white/40 max-w-xs mt-1">
                      Configure the model on the left, then click Generate to spark the neural core.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STATE 2: Generating Content Animations */}
              {isGenerating && (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  
                  {/* Floating particle animations & custom triggers per feature */}
                  {feature === 'social' && (
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Spinning ring */}
                        <div className="absolute inset-0 border-4 border-dashed border-neon-purple/20 rounded-full animate-spin-slow" />
                        <div className="absolute inset-2 border-2 border-neon-blue/30 rounded-full animate-pulse" />
                        {/* Floating social media logos */}
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 left-4 p-2 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                          <TwitterIcon className="w-4 h-4 text-neon-blue" />
                        </motion.div>
                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="absolute -bottom-2 right-2 p-2 bg-neon-purple/10 border border-neon-purple/30 rounded-lg">
                          <LinkedinIcon className="w-4 h-4 text-neon-purple" />
                        </motion.div>
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="absolute top-8 -right-4 p-2 bg-neon-pink/10 border border-neon-pink/30 rounded-lg">
                          <InstagramIcon className="w-4 h-4 text-neon-pink" />
                        </motion.div>
                        <Sparkles className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <span className="text-xs font-semibold text-neon-purple animate-pulse">Compiling Social Engagement Metrics...</span>
                    </div>
                  )}

                  {feature === 'email' && (
                    <div className="flex flex-col items-center gap-6">
                      {/* Envelope Assembly animation */}
                      <div className="relative w-40 h-28 border border-white/10 rounded-xl bg-white/5 overflow-hidden flex flex-col items-center justify-center">
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent"
                        />
                        <Mail className="w-10 h-10 text-neon-blue mb-1" />
                        {/* Digital elements */}
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce delay-75" />
                          <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce delay-150" />
                          <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-neon-blue animate-pulse">Assembling envelope particles...</span>
                    </div>
                  )}

                  {feature === 'product' && (
                    <div className="flex flex-col items-center gap-6">
                      {/* Unfolding Box simulation */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <motion.div
                          animate={{ rotateY: 360, rotateX: 360 }}
                          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                          className="w-16 h-16 border-2 border-neon-cyan/40 bg-neon-cyan/5 rounded-lg flex items-center justify-center"
                        >
                          <Box className="w-8 h-8 text-neon-cyan" />
                        </motion.div>
                        <div className="absolute inset-0 border border-white/5 rounded-full scale-110 animate-ping" />
                      </div>
                      <span className="text-xs font-semibold text-neon-cyan animate-pulse">Unfolding 3D product mesh...</span>
                    </div>
                  )}

                  {feature === 'ad' && (
                    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                      {/* Self assembling billboard */}
                      <div className="w-full h-36 rounded-2xl glass-panel border border-neon-pink/20 bg-neon-pink/5 flex flex-col justify-between p-4 overflow-hidden relative">
                        {/* Scanline */}
                        <div className="absolute inset-x-0 h-1 bg-neon-pink/20 top-0 animate-bounce" />
                        <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-3/4 bg-white/20 rounded animate-pulse" />
                          <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
                        </div>
                        <div className="h-6 w-1/4 bg-neon-pink/20 rounded self-end flex items-center justify-center text-[8px] font-bold text-neon-pink tracking-widest animate-pulse">
                          AD CTA
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-neon-pink animate-pulse">Formatting digital billboard matrix...</span>
                    </div>
                  )}

                  {/* Typing Simulator / Progress glow */}
                  <div className="w-64 bg-white/5 h-1.5 rounded-full overflow-hidden mt-6 border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3.8, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple"
                    />
                  </div>
                </div>
              )}

              {/* STATE 3: Display Generated Outputs */}
              {!isGenerating && output && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full text-left space-y-4"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                    Model Output
                  </span>
                  
                  {/* SOCIAL MEDIA OUTPUT VIEW */}
                  {feature === 'social' && (
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                      <p className="text-xs text-white/80 whitespace-pre-wrap leading-relaxed font-mono">
                        {output.post}
                      </p>
                    </div>
                  )}

                  {/* EMAIL OUTPUT VIEW */}
                  {feature === 'email' && (
                    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden text-xs">
                      {/* Email Header */}
                      <div className="border-b border-white/5 bg-white/5 p-4 space-y-1">
                        <div className="text-white/40">Subject: <span className="text-white font-medium">{output.subject}</span></div>
                        <div className="text-white/40">Preheader: <span className="text-white/60">{output.preheader}</span></div>
                      </div>
                      {/* Email Body */}
                      <div className="p-6 whitespace-pre-wrap leading-relaxed text-white/80 font-serif">
                        {output.body}
                      </div>
                    </div>
                  )}

                  {/* PRODUCT DESCRIPTION VIEW */}
                  {feature === 'product' && (
                    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row bg-[#080518]">
                      {/* Product Preview Card */}
                      <div className="md:w-1/2 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
                        <div>
                          <span className="text-[9px] font-extrabold text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded uppercase tracking-wider">
                            {output.badge}
                          </span>
                          <h4 className="text-lg font-bold text-white mt-2">{output.title}</h4>
                          <span className="text-[10px] text-white/40 uppercase tracking-widest">{output.category}</span>
                          <p className="text-xs text-white/70 mt-3 leading-relaxed">{output.description}</p>
                        </div>
                        <div className="text-lg font-black text-white mt-4">{output.price}</div>
                      </div>
                      
                      {/* Features/Benefits bullet lists */}
                      <div className="md:w-1/2 p-6 space-y-4">
                        <div>
                          <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Key Features</h5>
                          <ul className="space-y-1">
                            {output.featureList.map((f, i) => (
                              <li key={i} className="text-xs text-white/80 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Conversion Benefits</h5>
                          <ul className="space-y-1">
                            {output.benefitList.map((b, i) => (
                              <li key={i} className="text-xs text-white/80 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" /> {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ADVERTISEMENT OUTPUT VIEW */}
                  {feature === 'ad' && (
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                      <div className="border-b border-white/5 pb-3">
                        <span className="text-[9px] text-neon-pink font-semibold uppercase tracking-wider block">Ad Headline</span>
                        <h4 className="text-sm font-bold text-white mt-1">{output.headline}</h4>
                      </div>
                      <div className="border-b border-white/5 pb-3">
                        <span className="text-[9px] text-neon-pink font-semibold uppercase tracking-wider block">Primary Text</span>
                        <p className="text-xs text-white/80 mt-1 leading-relaxed">{output.primaryText}</p>
                      </div>
                      <div className="border-b border-white/5 pb-3">
                        <span className="text-[9px] text-neon-pink font-semibold uppercase tracking-wider block">Description</span>
                        <p className="text-xs text-white/70 mt-1">{output.description}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[9px] text-white/30 uppercase tracking-widest">Optimized platform assets</span>
                        <button className="px-4 py-1.5 rounded bg-neon-pink/20 border border-neon-pink/30 text-[9px] font-bold text-neon-pink tracking-widest uppercase">
                          {output.ctaText}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

            </div>

            {/* ACTION PANEL */}
            {output && (
              <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/80 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-neon-cyan" /> Regenerate
                </button>
                <button
                  onClick={() => handleDownload(
                    feature === 'social' ? output.post :
                    feature === 'email' ? `${output.subject}\n\n${output.body}` :
                    feature === 'product' ? `${output.title}\n\n${output.description}` :
                    `${output.headline}\n\n${output.primaryText}\n\n${output.description}`,
                    `${feature}_copy`
                  )}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/80 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-neon-blue" /> Download
                </button>
                <button
                  onClick={() => handleCopy(
                    feature === 'social' ? output.post :
                    feature === 'email' ? `${output.subject}\n\n${output.body}` :
                    feature === 'product' ? `${output.title}\n\n${output.description}` :
                    `${output.headline}\n\n${output.primaryText}\n\n${output.description}`
                  )}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-dark-bg bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_rgba(189,0,255,0.2)] hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </button>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
