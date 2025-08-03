const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log('Testing MongoDB connection...');
console.log('URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

const client = new MongoClient(uri);

async function testConnection() {
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Test database access
    const db = client.db('lumen');
    const collections = await db.listCollections().toArray();
    console.log('✅ Database accessible, collections:', collections.map(c => c.name));
    
    // Test write operation
    const testCollection = db.collection('test');
    const result = await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Write test successful:', result.insertedId);
    
    // Clean up test
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('✅ Test cleanup complete');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error codeName:', error.codeName);
  } finally {
    await client.close();
  }
}

testConnection();