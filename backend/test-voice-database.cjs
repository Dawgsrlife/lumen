const mongoose = require('mongoose');
require('dotenv').config();

async function checkVoiceSessionInDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');
    
    // Check voice sessions
    const VoiceSessionModel = mongoose.model('VoiceSession', new mongoose.Schema({}, { strict: false }));
    const voiceSessions = await VoiceSessionModel.find({ clerkId: 'voice_test_user' });
    
    console.log('🎙️ Voice sessions found:', voiceSessions.length);
    if (voiceSessions.length > 0) {
      const session = voiceSessions[0];
      console.log('📝 Session details:', {
        sessionId: session.sessionId,
        emotion: session.emotion,
        intensity: session.intensity,
        status: session.status,
        conversationLog: session.conversationLog?.length || 0,
        createdAt: session.createdAt,
        endTime: session.endTime
      });
      
      if (session.conversationLog && session.conversationLog.length > 0) {
        console.log('💬 Conversation messages:');
        session.conversationLog.forEach((msg, i) => {
          console.log(`  ${i + 1}. [${msg.role}]: ${msg.content}`);
        });
      }
    }
    
    // Check if user was created
    const UserModel = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const user = await UserModel.findOne({ clerkId: 'voice_test_user' });
    
    if (user) {
      console.log('✅ Voice test user found in database:', {
        clerkId: user.clerkId,
        email: user.email,
        totalEmotionEntries: user.totalEmotionEntries
      });
    } else {
      console.log('❌ Voice test user not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkVoiceSessionInDatabase();