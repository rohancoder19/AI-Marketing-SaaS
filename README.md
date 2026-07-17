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

_✨ Features
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
