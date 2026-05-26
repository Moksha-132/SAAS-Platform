import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import pool from './config/db.js';
import { initializeDatabase } from './config/initDb.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { findUserById } from './models/userModel.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`Socket user ${userId} joined their personal room`);
  });

  socket.on('send_message', async (data) => {
    const { receiverId, senderId } = data;
    let senderName = 'User';
    try {
      const sender = await findUserById(senderId);
      if (sender) {
        senderName = sender.company_name || (sender.role === 'admin' ? 'Admin' : sender.email);
      }
    } catch (err) {
      console.error(err);
    }
    io.to(receiverId).emit('receive_message', data);
    io.to(receiverId).emit('notification', {
      type: 'chat',
      senderId,
      senderName,
      message: `New message: "${data.message.substring(0, 30)}..."`
    });
  });

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

app.use((req, res, next) => {
  req.io = io;
  next();
});

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

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server actively running on port http://localhost:${PORT}`);
  await initializeDatabase();
});
