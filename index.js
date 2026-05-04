const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Route files
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

// Load env vars
dotenv.config({ override: true });

const User = require('./models/User');

// Connect to database
connectDB().then(async () => {
  try {
    const adminExists = await User.findOne({ role: 'superadmin' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'superadmin@aionai.com',
        password: 'superadmin123',
        role: 'superadmin',
      });
      console.log('✅ Super Admin auto-initialized');
    }
  } catch (error) {
    console.error('❌ Super Admin initialization failed:', error.message);
  }
});

const app = express();

// Middleware
// Allow dynamic CORS based on environment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL // To be set in production
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Production setup for static serving
if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res) => {
    res.send('AIONAI API is running and MongoDB is connected.');
  });
} else {
  app.get('/', (req, res) => {
    res.send('AIONAI API is running...');
  });
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_event', (eventId) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined event ${eventId}`);
  });

  socket.on('slide_changed', ({ eventId, currentSlide }) => {
    io.to(eventId).emit('sync_slide', currentSlide);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
