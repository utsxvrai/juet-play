const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const { ServerConfig, DbConfig} = require('./config');


const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', apiRoutes);

// Database connection
DbConfig.connectDB();

// Start server
app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});