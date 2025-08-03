#!/usr/bin/env node

/**
 * Test MongoDB connection and create a sample user
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumen-hackathon';

// Simple User schema for testing
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const User = mongoose.model('User', userSchema);

async function testConnection() {
  try {
    console.log('🔗 Testing MongoDB connection...');
    console.log('📍 URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test creating a user
    console.log('\n👤 Creating test user...');
    
    // Remove existing test user if any
    await User.deleteOne({ clerkId: 'test123' });
    
    const testUser = new User({
      clerkId: 'test123',
      email: 'test@lumen.com',
      firstName: 'Test',
      lastName: 'User'
    });
    
    const savedUser = await testUser.save();
    console.log('✅ Test user created:', {
      id: savedUser.id,
      clerkId: savedUser.clerkId,
      email: savedUser.email,
      name: `${savedUser.firstName} ${savedUser.lastName}`,
      createdAt: savedUser.createdAt
    });
    
    // Verify user can be retrieved
    const retrievedUser = await User.findOne({ clerkId: 'test123' });
    if (retrievedUser) {
      console.log('✅ Test user retrieved successfully');
    } else {
      console.log('❌ Failed to retrieve test user');
    }
    
    // Test database operations work
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // Clean up test user
    await User.deleteOne({ clerkId: 'test123' });
    console.log('🧹 Test user cleaned up');
    
    console.log('\n🎉 Database connection test PASSED!');
    console.log('✅ MongoDB is working correctly for the Lumen application');
    
  } catch (error) {
    console.error('❌ Database connection test FAILED:');
    console.error('Error:', error.message);
    
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.error('\n💡 Authentication failed. Please check:');
      console.error('   1. MongoDB Atlas username and password');
      console.error('   2. Database user permissions');
      console.error('   3. IP whitelist settings (try 0.0.0.0/0 for testing)');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('\n💡 Connection failed. Please check:');
      console.error('   1. Internet connection');
      console.error('   2. MongoDB Atlas cluster status');
      console.error('   3. Connection string format');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

testConnection();