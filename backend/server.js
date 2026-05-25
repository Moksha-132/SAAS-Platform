import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import pool from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import managerRoutes from './routes/managerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS setup
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

io.on('connection', (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`Socket user ${userId} joined their personal room`);
  });
  socket.on('send_message', (data) => {
    const { receiverId } = data;
    io.to(receiverId).emit('receive_message', data);
    io.to(receiverId).emit('notification', {
      type: 'chat',
      senderId: data.senderId,
      message: `New message: "${data.message.substring(0, 30)}..."`
    });
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

// Router mounting
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server actively running on port http://localhost:${PORT}`);
});