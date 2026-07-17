# 🚀 AI Marketing Agent

> **An AI-powered Marketing Automation Platform built with FastAPI, React, and Groq LLMs to generate high-quality marketing content in seconds.**

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

---

# 📌 Overview

**AI Marketing Agent** is a full-stack **Generative AI** application that helps businesses, startups, marketers, freelancers, and content creators automate their marketing workflow.

Instead of switching between multiple AI tools, users can generate professional marketing content from a single platform.

The application leverages the **Groq API** with **Llama 3.3 70B Versatile** to provide fast, intelligent, and high-quality AI-generated marketing content.

---

# ✨ Features

## 📱 AI Social Media Post Generator

Generate engaging posts for multiple platforms.

### Supported Platforms

- Instagram
- LinkedIn
- Facebook
- Twitter (X)

### Generates

- Captions
- Trending Hashtags
- Emojis
- Call-To-Action (CTA)
- Platform-specific formatting
- Multiple writing tones

---

## 📧 AI Email Generator

Generate professional marketing emails instantly.

### Email Types

- Promotional Emails
- Welcome Emails
- Newsletter Emails
- Product Launch Emails
- Sales Emails
- Cold Outreach Emails
- Follow-up Emails

### Customization

- Audience
- Tone
- Email Length
- CTA
- Brand Voice

---

## 🛍 AI Product Description Generator

Create SEO-friendly product descriptions.

### Features

- Product Highlights
- SEO Optimization
- Keywords
- Benefits
- Features
- Bullet Points
- Long Description
- Short Description

---

## 📢 AI Advertisement Generator

Generate high-converting advertisements.

### Platforms

- Google Ads
- Facebook Ads
- Instagram Ads
- LinkedIn Ads

### Generates

- Headlines
- Primary Text
- Description
- CTA
- Target Audience
- Marketing Hooks

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router
- Axios
- CSS3
- Vite

## Backend

- FastAPI
- Pydantic
- Uvicorn
- Python

## AI

- Groq API
- Llama 3.3 70B Versatile

## Development

- Git
- GitHub
- VS Code

---

# 📂 Project Structure

```text
AI-Marketing-Agent/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── prompts/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── LICENSE
```

---

# ⚙ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/AI-Marketing-Agent.git
cd AI-Marketing-Agent
```

---

# 🔧 Backend Setup

## Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
cd backend

pip install -r requirements.txt
```

---

## Create `.env`

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

---

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# 🚀 Deployment to Vercel

The application is structured as a monorepo and can be deployed to Vercel either as a **single unified project** (simplest setup, no CORS or URL configuration needed) or as **two separate projects** (frontend and backend).

> [!NOTE]
> When naming your Vercel projects or repositories, ensure the names contain only lowercase letters, numbers, hyphens, and underscores (e.g., `ai-marketing-saas`). Spaces and uppercase characters are not allowed by Vercel/GitHub naming conventions.

---

## 📦 Option A: Unified Deployment (Single Project - Easiest)

With the root-level `vercel.json` configuration, you can deploy both the frontend and backend under a single Vercel URL.

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Import your GitHub repository.
3. In the project configuration, leave the **Root Directory** as the default root (`/` or `./`).
4. Expand **Environment Variables** and add the following:
   - `DATABASE_URL`: Your MongoDB connection string (e.g., MongoDB Atlas).
   - `GROQ_API_KEY`: Your Groq API key.
   - `JWT_SECRET`: A secure random string for JWT token generation.
   - `JWT_ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
   - `VITE_GEMINI_API_KEY`: Your Gemini API key.
   - *(Note: `VITE_API_BASE_URL` is not required for unified deployment, as the frontend dynamically falls back to the same-domain backend API).*
5. Click **Deploy**.

---

## 🔀 Option B: Split Deployment (Two Separate Projects)

### 1️⃣ Deploy the Backend (FastAPI)

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
2. Import your GitHub repository.
3. In the project configuration:
   - Set **Project Name** to a valid lowercase name (e.g., `ai-marketing-backend`).
   - Set **Root Directory** to `backend`.
   - Vercel will automatically detect `vercel.json` and configure the Python serverless environment.
4. Expand **Environment Variables** and add the following:
   - `DATABASE_URL`: Your MongoDB connection string (e.g., MongoDB Atlas).
   - `GROQ_API_KEY`: Your Groq API key.
   - `JWT_SECRET`: A secure random string for JWT token generation.
   - `JWT_ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
5. Click **Deploy**. Note down the deployment URL once completed (e.g., `https://ai-marketing-backend.vercel.app`).

### 2️⃣ Deploy the Frontend (React + Vite)

1. In the Vercel Dashboard, click **Add New** > **Project**.
2. Import your GitHub repository again.
3. In the project configuration:
   - Set **Project Name** to a valid lowercase name (e.g., `ai-marketing-frontend`).
   - Set **Root Directory** to `frontend`.
   - Select **Vite** as the **Framework Preset**.
4. Expand **Environment Variables** and add the following:
   - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://ai-marketing-backend.vercel.app`).
   - `VITE_GEMINI_API_KEY`: Your Gemini API key.
5. Click **Deploy**.

---

# 📡 API Endpoints

| Feature | Endpoint |
|----------|----------|
| Social Media Generator | `POST /api/social-media/generate` |
| Email Generator | `POST /api/email/generate` |
| Product Description Generator | `POST /api/product-description/generate` |
| Advertisement Generator | `POST /api/advertisement/generate` |

---

# 📷 Screenshots

# 🤖 AI Marketing Agent

An all-in-one, AI-powered marketing tool that leverages **FastAPI** and **React** alongside the **Groq API (Llama 3.3 70B Versatile)** to generate high-converting social media posts, professional emails, SEO-friendly product descriptions, and multi-platform ad copies.

---

## 🏠 Home Page Features

### 📱 Social Media Post Generator
Generate engaging social media posts tailored for multiple platforms.
* **Supported Platforms:** Instagram, LinkedIn, Facebook, Twitter (X)
* **Outputs:** Captions, Hashtags, Emojis, and Call-To-Action (CTA) phrases.
* **Customization:** Multiple tone options and platform-specific formatting.

### 📧 AI Email Generator
Create high-converting, professional marketing emails instantly.
* **Supported Types:** Promotional, Product Launch, Welcome, Newsletters, Sales, Follow-up, and Cold Outreach.
* **Customization:** Tone, Target Audience, Email Length, CTA, and Brand Voice.

### 🛍 AI Product Description Generator
Generate compelling, SEO-friendly descriptions to boost product sales.
* **Features:** Product Highlights, SEO Optimization, Benefits, Key Features, Keyword Insertion, Bullet Points, and Long/Short description toggles.

### 📢 AI Advertisement Generator
Generate persuasive ad copies optimized for various advertising networks.
* **Supported Platforms:** Google Ads, Facebook Ads, Instagram Ads, LinkedIn Ads.
* **Outputs:** Headlines, Primary Text, Descriptions, CTAs, Target Audience suggestions, and Marketing Hooks.

---

## 🛠 Tech Stack

### Frontend
* **Core:** React, React Router
* **Networking:** Axios
* **Styling:** CSS3 (Fully Responsive UI)

### Backend & AI
* **Framework:** FastAPI
* **Data Validation:** Pydantic
* **Server:** Uvicorn
* **LLM Engine:** Groq API (`llama-3.3-70b-versatile`)

### Development Tools
* Python, JavaScript, Git, GitHub, VS Code

---

## 📂 Project Structure

```text
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

Social Media Generator
<img width="1731" height="843" alt="Screenshot 2026-07-16 233307" src="https://github.com/user-attachments/assets/7b6cd962-f701-49ff-a83a-b3bad004a63e" />

<img width="1672" height="754" alt="Screenshot 2026-07-16 233620" src="https://github.com/user-attachments/assets/df32d50e-79e5-4713-88ef-7e763d685d31" />
<img width="1672" height="754" alt="Screenshot 2026-07-16 233620" src="https://github.com/user-attachments/assets/e4477ffc-3caa-4486-9d98-d0aad86e53b4" />


Email Generator


Advertisement Generator


<img width="1672" height="754" alt="Screenshot 2026-07-16 233620" src="https://github.com/user-attachments/assets/a86d9354-58e5-4f53-a442-c413b039fa7c" />


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

---## Home Page


## 📱 Social Media Generator



---

## 📧 Email Generator

_Add Screenshot_
<img width="1861" height="876" alt="Screenshot 2026-07-16 224530" src="https://github.com/user-attachments/assets/f49d9f71-dd9f-4fb3-ba65-0ffddcaf23ee" />


---

## 📢 Advertisement Generator

_Add Screenshot_

---

## 🛍 Product Description Generator

_Add Screenshot_

---

# 🎯 Use Cases

- 📈 Digital Marketing Agencies
- 🛒 E-commerce Businesses
- 🚀 Startups
- 👨‍💻 Freelancers
- 🎥 Content Creators
- 💼 Marketing Teams
- 🏢 Small Businesses
- 🎓 Students

---

# 🔮 Future Improvements

- AI Blog Writer
- AI SEO Assistant
- Campaign Planner
- AI Marketing Strategy Generator
- Brand Voice Memory
- AI Image Generation
- AI Video Script Generator
- Competitor Analysis
- Marketing Analytics Dashboard
- Multi-language Support
- User Authentication
- Export to PDF & DOCX
- History Management
- Team Collaboration
- Template Library

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Authors

| Name | Role |
|------|------|
| **Priyansu Chatterjee** | Backend , Generative AI |
| **Rohan Majumdar** | AI Tools Expert |
| **Soumalya Ghosh** | Generative AI |
| **Dipa Dey** | Research and Documentation |
| **Zufishan Rais** | React Developer |

---

# ⭐ Support

If you like this project, please consider:

⭐ Star the repository

🍴 Fork the repository

🐛 Report issues

💡 Suggest new features

---

# 💡 Why AI Marketing Agent?

AI Marketing Agent brings multiple AI-powered marketing tools into one unified platform, allowing users to generate professional-quality marketing content within seconds.

By combining a **React frontend**, **FastAPI backend**, and **Groq-powered Llama 3.3 70B** model, the platform delivers **fast, scalable, and production-ready AI content generation** for:

- 📱 Social Media Posts
- 📧 Marketing Emails
- 🛍 Product Descriptions
- 📢 Advertisements

Empowering marketers to create better content—faster.

---

## 🌟 If you found this project useful, don't forget to ⭐ Star the repository!
