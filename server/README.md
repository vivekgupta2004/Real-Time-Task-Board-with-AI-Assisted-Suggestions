# Real-Time Task Board - Backend API

Production-ready Express.js and TypeScript backend service.

## Project Structure

```
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Scripts

- **Development Mode**: `npm run dev`
- **Build Production Bundle**: `npm run build`
- **Start Production Server**: `npm run start`
