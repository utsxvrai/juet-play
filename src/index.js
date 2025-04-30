const express = require("express");
const { ServerConfig , Logger} = require('./config')
 // Importing PORT from config.js
const app = express();
const apiRoutes = require('./routes');

app.use('/api' , apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Listening on port ${ServerConfig.PORT}`);
    Logger.info("Successfully started the Server" , {});
});
