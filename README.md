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

```
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

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
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

```
http://localhost:5173
```

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

## 🏠 Home Page

_Add Screenshot_

---

## 📱 Social Media Generator

_Add Screenshot_

---

## 📧 Email Generator

_Add Screenshot_

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
| **Priyansu Chatterjee** | Full Stack Developer |
| **Rohan Majumdar** | AI & Generative AI Developer |
| **Soumalya Ghosh** | MERN Stack Developer |
| **Dipa Dey** | Full Stack Developer |
| **Zufishan Rais** | Developer |

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
