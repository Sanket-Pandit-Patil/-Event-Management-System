# Event Management System (MERN Stack with Multi-Timezone Support)

A full-stack MERN application built to create and manage events across multiple user profiles and timezones, featuring dynamic timezone formatting, event update audit logs, and custom vanilla CSS styling adhering strictly to the provided Figma design snapshots.

---

## 🚀 Live Demo & Links

- **Hosted Website (Frontend)**: `https://event-management-system-six-swart.vercel.app/`
- **Hosted API (Backend)**: `https://event-management-backend-99rt.onrender.com` 

---

## 🎯 Key Features

- **Multi-Profile Management**: Admin/Users can create and search user profiles (`anuj`, `alpha`, `beta`, etc.).
- **Event Creation across Timezones**: Assign events to one or multiple profiles with custom timezone selection, start/end dates, and time pickers.
- **Dynamic Timezone Converter**: Switch the **"View in Timezone"** selector (e.g., Eastern Time ET, India IST, Pacific Time PT, UTC) to dynamically re-calculate and format all start, end, created, updated, and audit log timestamps in real time.
- **Event Update History Logs (Bonus Feature)**: Every event modification calculates granular field-level diffs and logs changes with timestamps formatted in the active viewing timezone.
- **Validation Rules**: Strict validation ensuring end date/time cannot be in the past relative to the start date/time.
- **Schedule Overlap Detection**: Identifies overlapping event schedules per profile across timezones using an interval sweep-line algorithm.
- **Custom Vanilla CSS**: Sleek UI with zero external CSS UI frameworks, featuring modern purple primary accents (`#7C5CFC`), custom dropdowns, popover calendar pickers, and glassmorphism modals.

---

## 🧮 Data Structures & Algorithms (DSA) Strategies

| Strategy | Algorithm / Concept | Complexity | Description |
| :--- | :--- | :--- | :--- |
| **Field Diffing Engine** | Hash-based Set & Property Diffing | $O(N + M)$ | Calculates exact state deltas between previous and current event states to generate minimal update logs. |
| **Conflict Detector** | Sweep-Line Interval Overlap Algorithm | $O(N \log N)$ | Sorts event intervals in UTC time and scans for overlaps to flag scheduling conflicts. |
| **Profile Filter** | Linear Scan Substring Filter | $O(N)$ | Filters profile multi-select lists rapidly with search query input. |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (Vite JS/JSX), Zustand (State Management), DayJS (UTC & Timezone plugins), Lucide Icons.
- **Styling**: Pure Vanilla CSS (`frontend/src/styles/index.css`).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (Production) with `mongodb-memory-server` automated fallback for zero-config local development.
- **ORM**: Mongoose.

---

## 📂 Project Structure

```text
Skailama/
├── backend/
│   ├── config/
│   │   └── db.js               # Database connection helper (Atlas + Memory Server)
│   ├── controllers/
│   │   ├── eventController.js   # Event CRUD & audit log handlers
│   │   └── profileController.js # Profile handlers
│   ├── models/
│   │   ├── Event.js            # Event schema & pre-save validation
│   │   ├── EventLog.js         # Audit log schema
│   │   └── Profile.js          # User profile schema
│   ├── utils/
│   │   └── diffCalculator.js   # O(N) Hash diff calculator algorithm
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/         # Header, CreateEventForm, EventList, EventCard, Modals
│   │   ├── store/              # Zustand stores (profileStore, eventStore, viewTimezoneStore)
│   │   ├── styles/
│   │   │   └── index.css       # Custom Vanilla CSS design system
│   │   ├── utils/              # Timezone formatters, DSA algorithms, production API wrapper
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json             # Vercel SPA routing rewrites
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/test?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=https://your-backend-app.onrender.com
```

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed.

### 1. Run Backend Server
```bash
cd backend
npm install
npm start
```
*Note: If no `MONGODB_URI` is provided, an in-memory MongoDB instance will automatically start on `http://localhost:5000`.*

### 2. Run Frontend Dev Server
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
