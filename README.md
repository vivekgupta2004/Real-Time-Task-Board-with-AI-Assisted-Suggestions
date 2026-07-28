# Real-Time Task Board with AI-Assisted Suggestions

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Subtasks-8E75B2?logo=google)](https://ai.google.dev/)

A production-ready, full-stack Task Management application featuring **real-time Socket.IO synchronization**, **AI-powered subtask generation using Google Gemini**, **strict email domain validation**, **server-side MongoDB pagination, filtering, searching, and priority sorting**, and **Light/Dark/System theme support**.

---

## 🌟 Key Features

- ⚡ **Real-Time Task Synchronization**: Multi-user live board updates powered by Socket.IO without page refreshes.
- 🤖 **Google Gemini AI Subtask Suggestions**: Automated AI subtask breakdown based on task title and description with UI locks during generation.
- 🔍 **Server-Side MongoDB Query Engine**:
  - **Pagination**: 9 items per page with custom pagination bar.
  - **Case-Insensitive Search**: Search by task title.
  - **Filtering**: Filter by Status (`pending`, `in_progress`, `completed`) and Priority (`low`, `medium`, `high`).
  - **Sorting**: Priority weight sort (`high` → `medium` → `low`), due date, creation date, and title.
- 🔒 **Security & Authentication**:
  - JWT Access & Refresh Token auth flow.
  - Strict Email Validation accepting only trusted providers (`@gmail.com`, `@outlook.com`, `@yahoo.com`, `@hotmail.com`, `@icloud.com`).
- 🔔 **Firebase Notifications**: In-app and push notification system backed by Firestore & Socket.IO.
- 🎨 **Responsive UI & Modern Aesthetics**:
  - Full Light, Dark, and System mode support with 1-click header switcher.
  - Custom scrollbars, glassmorphic headers, and mobile menu drawers.
  - Scroll-locked, ESC-key dismissible modals with backdrop click protection.

---

## 🏗 Architecture Overview

```mermaid
graph TD
    Client["Client (Next.js 15 + React 19)"]
    Server["Server (Express + TypeScript)"]
    Mongo[("MongoDB Database")]
    Firestore[("Firebase Admin / Firestore")]
    Gemini["Google Gemini AI API"]

    Client <-->|"HTTP / REST API (Axios)"| Server
    Client <-->|"WebSocket Events (Socket.IO)"| Server
    Server <-->|"Mongoose ODM"| Mongo
    Server <-->|"Firebase Admin SDK"| Firestore
    Server <-->|"@google/genai SDK"| Gemini
```

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v3.4 with dark mode (`class` strategy)
- **State Management**: Zustand v5
- **Forms & Validation**: React Hook Form + Zod
- **Icons & UI**: Lucide React, React Hot Toast
- **Real-Time**: Socket.IO Client

### Backend
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-Time Engine**: Socket.IO Server
- **AI Engine**: Google Gemini AI (`@google/genai`)
- **Notifications**: Firebase Admin SDK (Firestore)
- **Security & Auth**: JWT (jsonwebtoken), bcryptjs, Zod
- **Documentation**: Swagger OpenAPI (`swagger-ui-express`)

---

## 📂 Project Structure

```text
.
├── client/                     # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                # App Router (Home, Dashboard, Login, Signup, Notifications)
│   │   ├── components/         # UI, Layout, Task, Notification, Dashboard Components
│   │   ├── providers/          # Auth, Socket, Toast, and Theme Providers
│   │   ├── services/           # Axios API services
│   │   ├── store/              # Zustand stores (useTaskStore, useAuthStore, etc.)
│   │   ├── types/              # TypeScript interfaces
│   │   └── utils/              # Form validation schemas
│   └── package.json
├── server/                     # Express Backend Application
│   ├── src/
│   │   ├── config/             # Database, Firebase, Gemini configurations
│   │   ├── controllers/        # Request handlers (Auth, Task, Notification, AI)
│   │   ├── middleware/         # Auth guard, Zod validation, Error middleware
│   │   ├── models/             # Mongoose schemas (User, Task)
│   │   ├── routes/             # Express API routes & Swagger specs
│   │   ├── services/           # Business logic & Database queries
│   │   ├── socket/             # Socket.IO event handlers
│   │   └── utils/              # AppError class, Auth validation
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas Connection String
- **Google Gemini API Key**: [Google AI Studio](https://aistudio.google.com/)
- **Firebase Service Account Credentials**: [Firebase Console](https://console.firebase.google.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/vivekgupta2004/Real-Time-Task-Board-with-AI-Assisted-Suggestions.git
cd Real-Time-Task-Board-with-AI-Assisted-Suggestions
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task_board?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email@iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
```

Start the backend development server:

```bash
npm run dev
```

The backend server will run at `http://localhost:5000`. Swagger documentation will be available at `http://localhost:5000/api-docs`.

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd client
npm install
```

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start the frontend Next.js development server:

```bash
npm run dev
```

The frontend app will be accessible at `http://localhost:3000`.

---

## 📄 Documentation Links

For detailed, component-level documentation:

- 📘 [Backend Documentation](file:///e:/Real-Time%20Task%20Board%20with%20AI-Assisted%20Suggestions/server/README.md)
- 📙 [Frontend Documentation](file:///e:/Real-Time%20Task%20Board%20with%20AI-Assisted%20Suggestions/client/README.md)

---

## 🔮 Future Improvements

- 📊 **Kanban Drag-and-Drop View**: Interactive drag-and-drop column board.
- 👥 **Team Task Sharing**: Collaborative project workspaces and task assignment.
- 📈 **Analytics Dashboard**: Graphical insights into completion rate and weekly velocity.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
