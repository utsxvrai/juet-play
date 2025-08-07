const express = require("express");
const cors = require("cors");
const { ServerConfig , Logger} = require('./config')
const connectDB = require('./config/db-config');

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

app.listen(ServerConfig.PORT, () => {
    console.log(`Listening on port ${ServerConfig.PORT}`);
    Logger.info("Successfully started the Server" , {});
});
