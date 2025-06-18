const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1h',
}
