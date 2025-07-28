const express = require("express");
const cors = require("cors");
const { ServerConfig , Logger} = require('./config')
const connectDB = require('./config/db-config');

// Importing PORT from config.js
const app = express();
const apiRoutes = require('./routes');

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/api' , apiRoutes);


connectDB();

app.listen(ServerConfig.PORT, () => {
    console.log(`Listening on port ${ServerConfig.PORT}`);
    Logger.info("Successfully started the Server" , {});
});
