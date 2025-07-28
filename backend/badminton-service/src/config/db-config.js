const mongoose = require('mongoose');
const { MONGO_URI } = require('./server-config');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('MongoDB connected successfully');
        
        // Drop problematic index if it exists
        try {
            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();
            const matchCollection = collections.find(col => col.name === 'badmintonmatches');
            
            if (matchCollection) {
                await db.collection('badmintonmatches').dropIndex('matchId_1');
                console.log('Dropped problematic matchId index');
            }
        } catch (indexError) {
            // Index might not exist, which is fine
            console.log('No problematic index found or already removed');
        }
    }
    catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;