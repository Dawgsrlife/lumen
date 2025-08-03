import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumen-hackathon';
const HACKATHON_MODE = process.env.HACKATHON_MODE === 'true';

export const connectDatabase = async (): Promise<void> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    console.log('Hackathon Mode:', HACKATHON_MODE ? 'enabled' : 'disabled');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database connection status: ACTIVE');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      console.log('💡 Server will continue in degraded mode with mock data');
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      console.log('💡 Server will continue in degraded mode with mock data');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔄 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    console.log('💡 For the hackathon demo, you can:');
    console.log('   1. Use MongoDB Atlas with IP whitelisting');
    console.log('   2. Install MongoDB locally: brew install mongodb-community');
    console.log('   3. Use a different MongoDB connection string');
    console.log('   4. The frontend will still work for UI demonstration');
    console.log('   5. Server will run in degraded mode with mock data');
    
    // Don't exit for hackathon - let the server start without DB
    console.log('🚀 Starting server without database connection...');
    console.log('📊 Database connection status: DEGRADED (using mock data)');
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

export const getDatabaseStatus = (): { connected: boolean; mode: string } => {
  const connected = mongoose.connection.readyState === 1;
  return {
    connected,
    mode: HACKATHON_MODE ? 'hackathon' : 'production'
  };
}; 