# Open-Notes 📝

Open-Notes is a minimal, private note-sharing application built for small, close groups. It's designed to be simple, secure, mobile-first, and privacy-oriented.

## Features

- 🔐 **Authentication System:** Password-based login with secure hashed storage (.env), JWT authentication, and no password exposure in code.
- 📝 **Notes System:** 
  - Add new notes (message, timestamp, target person, unique ID)
  - View all notes in a clean list
  - Modal view for reading long notes
- 💻 **Frontend (React + Tailwind):** 
  - Mobile-optimized, modern UI
  - Minimal design, modal for long notes, quick add-form and hint-enabled login page
- 🗄️ **Backend (Node.js + Express + MongoDB):**
  - REST API for note actions
  - Password hash managed via script.js
  - JWT-based authorization
  - Clean endpoint structure

## Project Structure

```
open-notes/
├── backend/
│   ├── server.js
│   ├── script.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── public/
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint  | Description           |
|--------|-----------|----------------------|
| POST   | /login    | Authenticate user    |
| POST   | /post     | Create a new note    |
| GET    | /notes    | Fetch all notes      |

## Getting Started

### Prerequisites

- Node.js 14+
- MongoDB
- npm or yarn

### Backend Setup

1. `cd backend && npm install`
2. Create a `.env` file:

```
PASSWORD_HASH=your_generated_hash
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

3. Run `node script.js` to generate your password hash, update `.env`
4. Start backend: `npm start`

### Frontend Setup

1. `cd frontend && npm install`
2. `npm run dev`
3. Open `http://localhost:5173`

## Security Notes

- Passwords hashed (bcrypt), never in code or plain text
- JWT-based authentication for all API requests
- Sensitive config in `.env`

## License

MIT License – For personal and private group usage.

---

Inspired by minimalism and privacy—Open-Notes keeps your group's notes truly yours.
