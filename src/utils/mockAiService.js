export function generateSocialCopy(data) {
  const { productName, productDescription, targetAudience, platform, tone, language, campaignGoal, keywords } = data;
  const kws = keywords ? keywords.split(',').map(k => `#${k.trim()}`).join(' ') : '#ai #marketing';

  let post = '';
  if (platform === 'linkedin') {
    post = `🚀 Introducing ${productName || 'our new solution'} — built specifically for ${targetAudience || 'professionals'}!

${productDescription || 'A revolutionary new platform designed to automate and optimize workflows.'}

Why is this a game changer?
✅ Direct alignment with your ${campaignGoal || 'business goals'}.
✅ Built to match a ${tone || 'professional'} tone for modern audiences.
✅ Easy integration and immediate 10x output.

What are your thoughts on this approach? Let's discuss in the comments! 👇

${kws}`;
  } else if (platform === 'twitter') {
    post = `⚡ The future of marketing is here. Meet ${productName || 'Aethera'}.

👉 ${productDescription || 'Create high-converting copy in seconds using AI.'}

- Tailored for ${targetAudience || 'builders'}
- Focuses on ${campaignGoal || 'conversions'}
- Tone: ${tone || 'persuasive'}

Get started today. ${kws}`;
  } else {
    post = `✨ ${productName || 'Aethera'} ✨

${productDescription || 'Beautiful, high-converting copy in seconds.'}

🎯 Targeted for: ${targetAudience || 'creatives'}
🔥 Campaign Goal: ${campaignGoal || 'brand awareness'}
🎭 Tone: ${tone || 'bold'}

Swipe left to learn more! Link in bio. 🔗

${kws}`;
  }

  return {
    post,
    hashtags: kws
  };
}

export function generateEmailCopy(data) {
  const { product, recipient, purpose, tone, language, cta } = data;
  
  return {
    subject: `Unlocking new possibilities with ${product || 'Aethera'} ⚡`,
    preheader: `We designed this specifically for ${recipient || 'you'}. Here is how it helps.`,
    body: `Hi there,

Are you looking to optimize your workflow for ${purpose || 'content generation'}?

We'd love to introduce you to ${product || 'Aethera'}, an AI-powered engine engineered to automate high-converting copy. With its ${tone || 'compelling'} approach, it will transform how you interact with your customers.

Here is what you get:
• 10x speedups in copywriting drafting
• Precise keyword target selection
• Instant multi-variant deployment

Ready to see it in action?

👉 ${cta || 'Click here to start generating copy'}

Best regards,
The ${product || 'Aethera'} Team`
  };
}

export function generateProductCopy(data) {
  const { productName, category, features, benefits, audience, tone } = data;

  return {
    title: productName || 'Aethera Pro',
    category: category || 'SaaS & Marketing',
    price: '$49.00',
    description: `Meet ${productName || 'Aethera'} — the premium ${category || 'marketing'} tool optimized for ${audience || 'teams'}. Featuring a ${tone || 'premium'} layout, it enables seamless scaling.`,
    featureList: features ? features.split(',').map(f => f.trim()) : ['Neural Core 3D engine', 'Scroll storytelling triggers', 'Glassmorphism responsive layouts'],
    benefitList: benefits ? benefits.split(',').map(b => b.trim()) : ['10x conversion uplift', 'Decreased visual fatigue', 'Highly customizable cards'],
    badge: 'NEW RELEASE'
  };
}

export function generateAdCopy(data) {
  const { product, campaignGoal, audience, platform, budget, tone } = data;

  return {
    headline: `Supercharge ${product || 'Aethera'} — Scale to ${campaignGoal || '10x Conversions'}`,
    primaryText: `Stop spending thousands on ad copywriting. Deploy custom visual ads targeted for ${audience || 'professionals'} using the standard-setting ${tone || 'bold'} marketing engine.`,
    description: `Launch campaigns on ${platform || 'Google & Facebook'} instantly. Optimised for a ${budget || 'balanced'} budget.`,
    ctaText: campaignGoal === 'leads' ? 'SIGN UP NOW' : 'LEARN MORE'
  };
}
