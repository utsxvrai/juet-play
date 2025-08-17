const mongoose = require('mongoose');
const { seedData } = require('./src/seeders/sample-data');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/juetplay', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log('🔌 Connected to MongoDB');
  await seedData();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
