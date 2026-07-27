const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Production CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Main Root Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Event Management System API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      profiles: '/api/profiles',
      events: '/api/events'
    }
  });
});

// Health check endpoint for cloud monitoring (Render/Railway)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
const profileController = require('./controllers/profileController');
const profileRouter = express.Router();
profileRouter.get('/', profileController.getProfiles);
profileRouter.post('/', profileController.createProfile);
app.use('/api/profiles', profileRouter);

const eventController = require('./controllers/eventController');
const eventRouter = express.Router();
eventRouter.get('/', eventController.getEvents);
eventRouter.post('/', eventController.createEvent);
eventRouter.put('/:id', eventController.updateEvent);
eventRouter.get('/:id/logs', eventController.getEventLogs);
app.use('/api/events', eventRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Connect DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
