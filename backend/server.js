// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- CORS Configuration -----------------
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Allow requests from multiple origins (local development + deployed frontend)
const allowedOrigins = [
  'http://localhost:3000',  // Local development
  'https://mern-todo-phi-rose.vercel.app',  // Your deployed Vercel frontend
  FRONTEND_URL  // Environment variable
];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (server-to-server, Postman, etc.)
    if (!origin) return cb(null, true);
    
    // Allow requests from whitelisted origins
    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    
    // Allow wildcard if explicitly set
    if (FRONTEND_URL === '*') return cb(null, true);
    
    // Block all other origins
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Middleware
app.use(express.json());

// ----------------- MongoDB connection -----------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: true,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority'
}).catch(err => {
  // initial connection error (will also be captured by connection 'error' event)
  console.error('Initial mongoose.connect() error:', err);
});

// connection lifecycle logs
mongoose.connection.on('connected', () => {
  console.log('Mongoose: connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('Mongoose: connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose: disconnected from MongoDB');
});

// Catch unhandled rejections / uncaught exceptions (helpful for debugging)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

// ----------------- Todo model -----------------
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Todo = mongoose.model('Todo', todoSchema);

// ----------------- Routes -----------------

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.json(todos);
  } catch (error) {
    console.error('GET /api/todos error:', error);
    const payload = { error: 'Failed to fetch todos' };
    if (process.env.NODE_ENV !== 'production') payload.details = error.message;
    return res.status(500).json(payload);
  }
});

// POST new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }
    const todo = new Todo({ text: text.trim() });
    await todo.save();
    return res.status(201).json(todo);
  } catch (error) {
    console.error('POST /api/todos error:', error);
    const payload = { error: 'Failed to create todo' };
    if (process.env.NODE_ENV !== 'production') payload.details = error.message;
    return res.status(500).json(payload);
  }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    const updateData = {};
    if (text !== undefined) updateData.text = text.trim();
    if (completed !== undefined) updateData.completed = completed;
    const todo = await Todo.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    return res.json(todo);
  } catch (error) {
    console.error(`PUT /api/todos/${req.params.id} error:`, error);
    const payload = { error: 'Failed to update todo' };
    if (process.env.NODE_ENV !== 'production') payload.details = error.message;
    return res.status(500).json(payload);
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    return res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/todos/${req.params.id} error:`, error);
    const payload = { error: 'Failed to delete todo' };
    if (process.env.NODE_ENV !== 'production') payload.details = error.message;
    return res.status(500).json(payload);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Todo API is running' });
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
