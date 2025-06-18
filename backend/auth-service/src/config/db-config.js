const mongoose = require('mongoose');
const ServerConfig = require('./server-config');

const connectDB = async () => {
  try {
    await mongoose.connect(ServerConfig.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = {
    connectDB
};
