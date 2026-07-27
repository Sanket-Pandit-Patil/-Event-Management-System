const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('MONGODB_URI environment variable is required in production.');
      }

      console.log('No MONGODB_URI found. Starting MongoMemoryServer for local development...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`In-memory MongoDB running at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
