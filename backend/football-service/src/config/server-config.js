const dotenv = require('dotenv');

dotenv.config();
module.exports ={
    PORT: process.env.PORT || 3002,
    MONGO_URI : process.env.MONGODB_URI,
}