import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import pool from './config/db.js';
import { initializeDatabase } from './config/initDb.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Serve uploaded documents statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS setup allowing local development frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Server Setup
const io = new Server(server, {
  cors: corsOptions
});

// Real-time Chat & Notification event sockets
io.on('connection', (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  // User registers their interest / user ID to receive direct messages
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`Socket user ${userId} joined their personal room`);
  });

  // Emitted by client when sending a message
  socket.on('send_message', (data) => {
    // data structure: { senderId, receiverId, message, createdAt }
    const { receiverId } = data;
    // Emit message to receiver's private room
    io.to(receiverId).emit('receive_message', data);
    // Send global notification toast to receiver
    io.to(receiverId).emit('notification', {
      type: 'chat',
      senderId: data.senderId,
      message: `New message: "${data.message.substring(0, 30)}..."`
    });
  });

  // WebRTC Signaling events
  socket.on('call_user', (data) => {
    io.to(data.to).emit('call_incoming', {
      offer: data.offer,
      from: data.callerId
    });
  });

  socket.on('accept_call', (data) => {
    io.to(data.to).emit('call_accepted', {
      answer: data.answer
    });
  });

  socket.on('ice_candidate', (data) => {
    io.to(data.to).emit('ice_candidate', {
      candidate: data.candidate
    });
  });

  socket.on('meeting_signal', (data) => {
    io.to(data.to).emit('meeting_signal', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Attach io to req object to access it inside controllers/services easily
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Basic Root status route
app.get('/api/status', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({
      status: 'UP',
      message: 'Node.js Express Server is active and operational.',
      databaseTime: dbCheck.rows[0].now,
      websocketsActive: !!io
    });
  } catch (error) {
    res.status(500).json({
      status: 'DEGRADED',
      message: 'Server online, database connection is failing',
      error: error.message
    });
  }
});

// Router mounting
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

// Fallback handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server actively running on port http://localhost:${PORT}`);
  // Initialize Database schemas and seed demo profiles automatically
  await initializeDatabase();
});
