const express = require("express");
const cors = require("cors");
const { ServerConfig , Logger} = require('./config')
const connectDB = require('./config/db-config');
const http = require('http');
const { Server } = require('socket.io');

// Importing PORT from config.js
const app = express();
const apiRoutes = require('./routes');

// CORS middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://juet-play.vercel.app'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/api' , apiRoutes);

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
  });
  socket.on('leaveMatch', (matchId) => {
    socket.leave(matchId);
  });
});

app.set('io', io); // Make io accessible in routes/controllers

server.listen(ServerConfig.PORT, () => {
    console.log(`Listening on port ${ServerConfig.PORT}`);
    Logger.info("Successfully started the Server" , {});
});
