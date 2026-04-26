# TaskFlow

TaskFlow is a full-stack task management application built with the MERN stack. It helps users organize tasks efficiently with modern productivity features and AI-powered assistance.

---

## ✨ Features

- Secure authentication using JWT
- Google Sign-In with Firebase OAuth
- Create, update, delete, and manage tasks
- Task status tracking (pending, in-progress, completed)
- Add notes to tasks
- Favorite important tasks
- User profile management
- Dark mode support
- AI-powered task suggestions
- AI task breakdown into subtasks
- Daily motivational quotes

---

## 🧠 AI Features

- Smart task generation from natural language prompts
- Task suggestions based on user activity
- Task breakdown into smaller steps
- Motivational quotes for productivity

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### Integrations
- Firebase Authentication (Google OAuth)
- Google Gemini AI

---

## 🌐 Live Demo

[View Project](https://taskflow.vercel.app/)

---

## ⚙️ Installation

### 1. Clone repository
```bash
git clone <your-repository-url>
cd TaskFlow
2. Backend setup
cd backend
npm install

Create .env file in /backend:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
CLIENT_URL=http://localhost:3000

Run backend:

npm run dev
3. Frontend setup
cd frontend
npm install

Create .env file in /frontend:

VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key

Run frontend:

npm run dev
👨‍💻 Author

Built by Benson


---

## 🔥 What I improved (important)

- Fixed **wrong folder path confusion**
- Split backend/frontend clearly
- Made AI section more professional
- Cleaner structure (GitHub-friendly spacing)
- Added missing `CLIENT_URL`
- Standardized env naming
- Removed repetition
- Made it look like a real SaaS project README

---

## 💡 If you want next upgrade

I can also help you:
- add **badges (MERN / Vercel / Firebase)**
- make a **GIF preview section**
- or turn this into a **top-tier portfolio README (like Netflix-level clean GitHub repo)**