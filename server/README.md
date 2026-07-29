# Backend Documentation - Real-Time Task Board Server

Production-grade Express.js & TypeScript REST API and Socket.IO server powering real-time task management, Kanban status updates, AI subtask generation via Google Gemini, server-side MongoDB aggregation, and Firebase notifications.

---

## Features

- **Authentication & JWT Session Management**:
  - Secure signup and login with bcrypt password hashing (10 salt rounds).
  - Dual JWT token system (Short-lived Access Token, Long-lived Refresh Token).
  - Strict password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character).
  - Strict email provider validation (allows only `@gmail.com`, `@outlook.com`, `@yahoo.com`, `@hotmail.com`, and `@icloud.com`).
- **Kanban & Task Management Logic**:
  - Status updates (`pending` ↔ `in_progress` ↔ `completed`) saved directly in MongoDB.
  - Automatic parent task completion when all subtasks become completed.
  - Automatic subtask completion when parent task is moved directly to Completed status.
- **Real-Time Sync (Socket.IO)**:
  - User-isolated WebSocket rooms (`user:<userId>`).
  - Broadcasts live events for task creation, status updates, completion, deletion, and notifications.
- **Google Gemini AI Integration**:
  - Automatically parses task title and description to produce structured, actionable subtasks using `@google/genai`.
- **Server-Side MongoDB Search, Filter & Sort Engine**:
  - Executed directly inside MongoDB queries (`skip`, `limit`, `$regex`, `$switch` priority weight aggregations).
  - Configurable page size with multi-field sorting by Priority, Due Date, Creation Date, and Title.
- **Firebase Admin SDK Notification Engine & Due Date Logic**:
  - Initializes via environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).
  - Automatically sends 24-hour due date reminders ONLY for active tasks (`Pending` or `In Progress`). Completed tasks are automatically skipped and never receive due reminders.
  - Persists notifications to Firestore with in-memory fallback.
- **Swagger OpenAPI Specs**:
  - Self-documenting API available at `/api-docs`.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js & Express.js** | Server framework & HTTP router |
| **TypeScript** | Strongly-typed application code |
| **MongoDB & Mongoose ODM** | Database models, indexes, and queries |
| **Socket.IO** | Bi-directional WebSocket communication |
| **Google Gemini SDK (`@google/genai`)** | AI subtask generation |
| **Firebase Admin SDK** | Firestore database & push notification services |
| **Zod** | Request payload validation schemas |
| **JWT & bcryptjs** | Authentication & password hashing |
| **Swagger UI Express** | OpenAPI documentation UI |

---

## Folder Structure

```text
server/
├── src/
│   ├── config/             # Database, Firebase Admin, and Gemini AI configurations
│   ├── controllers/        # Request controllers (Auth, Task, Notification, AI)
│   ├── middleware/         # Auth guard, Zod validation, Error handler
│   ├── models/             # Mongoose Models (User, Task)
│   ├── routes/             # Express Route definitions & OpenAPI specs
│   ├── services/           # Database queries, MongoDB aggregations, AI logic, Notification filters
│   ├── socket/             # Socket.IO connection & user room emitter helpers
│   ├── utils/              # AppError class, Auth & Task validation schemas
│   ├── app.ts              # Express application setup
│   └── server.ts           # HTTP & Socket.IO server listener
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Environment Variables

Copy `.env.example` to `.env` and populate the following variables:

```env
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/task_board?retryWrites=true&w=majority

# Authentication Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email@iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_RSA_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Google Gemini AI Config
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash

# Allowed Client Origin
CLIENT_URL=http://localhost:3000
```

---

## Running the Server

### Development Mode

```bash
npm run dev
```

### Build & Run Production

```bash
npm run build
npm start
```

---

## API Endpoints Summary

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & get JWT tokens | No |
| `POST` | `/api/auth/logout` | Invalidate user session | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get paginated, filtered, searched & sorted tasks | Yes |
| `POST` | `/api/tasks` | Create a new task (with optional subtasks) | Yes |
| `GET` | `/api/tasks/:id` | Get specific task details | Yes |
| `PUT` | `/api/tasks/:id` | Update task details, status (`pending`, `in_progress`, `completed`), or subtasks | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |
| `PATCH` | `/api/tasks/:id/complete` | Mark task as completed | Yes |
| `PATCH` | `/api/tasks/:id/subtasks/:subtaskId/toggle` | Toggle subtask completion status | Yes |

### AI Routes (`/api/ai`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/ai/suggest-subtasks` | Generate AI subtask suggestions using Gemini | Yes |

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/notifications` | Get user notifications from Firestore | Yes |
| `PATCH` | `/api/notifications/:id/read` | Mark single notification as read | Yes |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read | Yes |

---

## Database Schema & ER Diagram

```mermaid
erDiagram
    USER ||--o{ TASK : owns
    USER ||--o{ NOTIFICATION : receives

    USER {
        string _id PK
        string name
        string email
        string password
        date createdAt
        date updatedAt
    }

    TASK {
        string _id PK
        string owner FK
        string title
        string description
        string status "pending | in_progress | completed"
        string priority "low | medium | high"
        date dueDate
        array subtasks
        date completedAt
        date createdAt
        date updatedAt
    }

    NOTIFICATION {
        string _id PK
        string userId FK
        string title
        string message
        string type "info | due_soon | completed | warning"
        boolean isRead
        date createdAt
    }
```

---

## Security Considerations

1. **Strict Regex Validation**:
   - Emails restricted to `@gmail.com`, `@outlook.com`, `@yahoo.com`, `@hotmail.com`, `@icloud.com`.
   - Passwords validated for length, uppercase, lowercase, numbers, and special characters.
2. **Password Hashing**:
   - Salted `bcryptjs` hashing with cost factor 10.
3. **No Unhandled Crashes**:
   - Operational errors wrapped in `AppError` class and handled by `error.middleware.ts`.
4. **Environment Security**:
   - Secrets, `CLIENT_URL`, and Firebase RSA keys stored exclusively in `.env`.

---

## License

This project is licensed under the [MIT License](../LICENSE).
