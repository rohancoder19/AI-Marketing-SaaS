import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, RefreshCw, Sparkles } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export default function AdvertisementForm({ onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      campaignName: '',
      objective: 'Brand Awareness',
      brandName: '',
      productName: '',
      industry: '',
      companyDescription: '',
      websiteUrl: '',
      targetAudience: 'General Audience',
      ageGroup: '25-34',
      gender: 'All',
      location: 'Global',
      interests: '',
      incomeLevel: 'Any',
      occupation: '',
      platform: 'Meta Ads',
      adType: 'Image',
      tone: 'Professional',
      language: 'English',
      creativityLevel: 'High',
      brandVoice: 'Authoritative',
      emotionalTrigger: 'Trust',
      marketingFramework: 'AIDA',
      budget: 'Moderate',
      campaignDuration: '1 month',
      callToAction: 'Learn More',
      competitor: '',
      keywords: '',
      usp: '',
      painPoints: '',
      benefits: '',
      imageStyle: 'Photorealistic',
      imageAspectRatio: '1:1',
      imageMood: 'Vibrant',
      brandColors: '#6b7280, #e5e7eb',
      logoUrl: '',
      numVariations: '3',
      outputLength: 'Medium',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campaign Details */}
      <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-wider border-b border-white/5 pb-2">Campaign Details</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Campaign Name</label>
          <input type="text" required {...register('campaignName')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Objective</label>
          <select {...register('objective')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white">
            <option>Brand Awareness</option>
            <option>Lead Generation</option>
            <option>Sales</option>
            <option>Website Traffic</option>
            <option>App Installs</option>
          </select>
        </div>
      </div>

      {/* Business Information */}
      <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-wider border-b border-white/5 pb-2 mt-4">Business Info</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Brand Name</label>
          <input type="text" required {...register('brandName')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Product Name</label>
          <input type="text" required {...register('productName')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Company Description</label>
        <textarea required {...register('companyDescription')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white min-h-[60px]" />
      </div>

      {/* Audience */}
      <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-wider border-b border-white/5 pb-2 mt-4">Audience</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Target Audience</label>
          <input type="text" required {...register('targetAudience')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Interests</label>
          <input type="text" required {...register('interests')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Age</label>
          <input type="text" {...register('ageGroup')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Gender</label>
          <input type="text" {...register('gender')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Location</label>
          <input type="text" {...register('location')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
      </div>

      {/* Settings */}
      <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-wider border-b border-white/5 pb-2 mt-4">Settings</h4>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Platform</label>
          <select {...register('platform')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white">
            <option>Meta Ads</option>
            <option>Google Ads</option>
            <option>LinkedIn Ads</option>
            <option>X Ads</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Framework</label>
          <select {...register('marketingFramework')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white">
            <option>AIDA</option>
            <option>PAS</option>
            <option>FAB</option>
            <option>BAB</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Keywords</label>
          <input type="text" required {...register('keywords')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">USP</label>
          <input type="text" required {...register('usp')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Pain Points</label>
        <textarea required {...register('painPoints')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white min-h-[40px]" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Benefits</label>
        <textarea required {...register('benefits')} className="w-full px-3 py-2 rounded-xl glow-input text-xs text-white min-h-[40px]" />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 mt-4 rounded-xl text-xs font-semibold text-dark-bg bg-gradient-to-r from-neon-pink to-neon-purple shadow-[0_0_15px_rgba(255,0,122,0.3)] flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer"
      >
        {loading ? (
           <><RefreshCw className="w-4 h-4 animate-spin" /> Compiling Ads...</>
        ) : (
           <>Generate Advertisements <Send className="w-3.5 h-3.5" /></>
        )}
      </button>
    </form>
  );
}
