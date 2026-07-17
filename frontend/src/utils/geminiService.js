const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-1.5-flash';

function cleanJsonResponse(rawText) {
  let cleaned = rawText.trim();
  // Strip markdown code block wrappers if the model returned them
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '')
      .trim();
  }
  return JSON.parse(cleaned);
}

async function callGemini(prompt) {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured in .env file.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textResponse) {
    throw new Error('Empty response received from Gemini.');
  }

  return cleanJsonResponse(textResponse);
}

export async function generateSocialWithGemini(data) {
  const prompt = `You are a world-class SaaS copywriter. Generate a social media post.
Return ONLY a JSON object matching this structure:
{
  "post": "Main content of the social post, structured with line breaks, bullet points, and appropriate emojis. For Twitter it must be concise, for LinkedIn professional.",
  "hashtags": "Space-separated hashtags matching the content keywords."
}

Details:
Product Name: ${data.productName}
Description: ${data.productDescription}
Audience: ${data.targetAudience}
Platform: ${data.platform}
Tone: ${data.tone}
Campaign Goal: ${data.campaignGoal}
Keywords: ${data.keywords}`;

  return callGemini(prompt);
}

export async function generateEmailWithGemini(data) {
  const prompt = `You are a B2B SaaS cold outreach and customer lifecycle email expert. Generate a marketing email.
Return ONLY a JSON object matching this structure:
{
  "subject": "Compelling subject line",
  "preheader": "Preheader snippet text",
  "body": "Email body content starting with greeting and concluding with CTA."
}

Details:
Product/Service: ${data.product}
Recipient: ${data.recipient}
Purpose: ${data.purpose}
Tone: ${data.tone}
Call to Action (CTA): ${data.cta}`;

  return callGemini(prompt);
}

export async function generateProductWithGemini(data) {
  const prompt = `You are an e-commerce copywriter. Generate an attractive product description.
Return ONLY a JSON object matching this structure:
{
  "title": "Clean, punchy product title",
  "category": "Product category",
  "price": "Estimate standard price format e.g. $49.00",
  "description": "2-3 sentence engaging product overview",
  "featureList": ["Feature 1", "Feature 2", "Feature 3"],
  "benefitList": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "badge": "e.g. NEW RELEASE or BESTSELLER"
}

Details:
Product Name: ${data.productName}
Category: ${data.category}
Features: ${data.features}
Benefits: ${data.benefits}
Audience: ${data.audience}
Tone: ${data.tone}`;

  return callGemini(prompt);
}

export async function generateAdWithGemini(data) {
  const prompt = `You are a digital advertising specialist. Generate advertisement copy variants.
Return ONLY a JSON object matching this structure:
{
  "headline": "Magnetic short ad headline",
  "primaryText": "Primary text copy detailing value proposition and benefits",
  "description": "Short description helper text",
  "ctaText": "CTA uppercase button name (e.g. LEARN MORE, SIGN UP, SHOP NOW)"
}

Details:
Product: ${data.product}
Goal: ${data.campaignGoal}
Audience: ${data.audience}
Platform: ${data.platform}
Budget Level: ${data.budget}
Tone: ${data.tone}`;

  return callGemini(prompt);
}
