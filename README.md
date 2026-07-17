AI Marketing Agent

An AI-powered marketing automation platform built with FastAPI, React, and LLMs to generate high-quality marketing content in seconds.

🚀 Overview

AI Marketing Agent is a full-stack Generative AI application that helps businesses, startups, marketers, and content creators automate their marketing workflow. Instead of using multiple AI tools separately, users can access everything from one platform.

The application uses modern Large Language Models (LLMs) through the Groq API to generate professional marketing content with a fast and responsive user experience.
✨ Features
📱 Social Media Post Generator

Generate engaging social media posts for multiple platforms.

Supports
Instagram
LinkedIn
Facebook
Twitter (X)
Generates
Captions
Hashtags
Emojis
Call-To-Action (CTA)
Multiple tone options
Platform-specific formatting
📧 AI Email Generator

Create professional marketing emails instantly.

Generates
Promotional Emails
Product Launch Emails
Welcome Emails
Newsletter Emails
Sales Emails
Follow-up Emails
Cold Outreach Emails
Customization
Tone
Audience
Email Length
CTA
Brand Voice
🛍 AI Product Description Generator

Generate SEO-friendly product descriptions.

Features
Product Highlights
SEO Optimization
Benefits
Key Features
Keywords
Bullet Points
Long & Short Description
📢 AI Advertisement Generator

Generate ad copy for multiple platforms.

Platforms
Google Ads
Facebook Ads
Instagram Ads
LinkedIn Ads
Generates
Headlines
Primary Text
Description
CTA
Target Audience
Marketing Hooks
🛠 Tech Stack
Frontend
React
React Router
Axios
CSS3
Responsive UI
Backend
FastAPI
Pydantic
Uvicorn
AI
Groq API
Llama 3.3 70B Versatile
Development Tools
Python
JavaScript
Git
GitHub
VS Code
📂 Project Structure
AI-Marketing-Agent/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── prompts/
│   │   ├── models/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── LICENSE
⚙ Installation
Clone Repository
git clone https://github.com/yourusername/AI-Marketing-Agent.git

cd AI-Marketing-Agent
Backend Setup

Create a virtual environment

python -m venv venv

Activate it

Windows
venv\Scripts\activate
Linux / macOS
source venv/bin/activate

Install dependencies

pip install -r requirements.txt

Create a .env file

Groq_API_Key=YOUR_GROQ_API_KEY

Run backend

uvicorn app.main:app --reload
Frontend Setup
cd frontend

npm install

npm run dev
📡 API Endpoints
Social Media
POST /api/social-media/generate
Email
POST /api/email/generate
Product Description
POST /api/product-description/generate
Advertisement
POST /api/advertisement/generate
📷 Screenshots

Add screenshots here.

Home Page

Social Media Generator

Email Generator

Advertisement Generator

Product Description Generator
🔮 Future Improvements
AI Marketing Strategy Generator
Campaign Planner
Brand Voice Memory
AI Image Generation
AI Video Script Generator
AI Blog Writer
AI SEO Assistant
Competitor Analysis
Marketing Analytics Dashboard
Multi-language Support
User Authentication
History Management
Export to PDF & DOCX
Team Collaboration
Template Library
💡 Use Cases
Digital Marketing Agencies
Content Creators
Freelancers
E-commerce Businesses
Startups
Small Businesses
Students
Marketing Teams
🤝 Contributing

Contributions are welcome.

Fork the repository.
Create a new feature branch.
Commit your changes.
Push the branch.
Open a Pull Request.
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Priyansu Chatterjee
Rohan Majumdar
Soumalya Ghosh
Dipa Dey
Zufishan Rais

Full Stack Developer
AI & Generative AI Enthusiast
MERN Stack Developer
⭐ Support

If you found this project helpful:

⭐ Star the repository
🍴 Fork it
🐛 Report issues
💡 Suggest new features
🎯 Why AI Marketing Agent?

AI Marketing Agent combines multiple AI-powered marketing tools into one unified platform, enabling users to create high-quality marketing content quickly and consistently. With a modern React frontend, FastAPI backend, and Groq-powered LLMs, it delivers fast, scalable, and production-ready AI content generation for social media, email marketing, product descriptions, and advertising.
