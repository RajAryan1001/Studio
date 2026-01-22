// config/db.js - SIMPLIFIED VERSION
const mongoose = require('mongoose');

const connect = async () => {
  try {
    // NO OPTIONS NEEDED for latest mongoose
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inksesh-studio');
    console.log('✅ MongoDB Connected Successfully!');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 SOLUTION: Make sure MongoDB is running');
    console.log('Run this command in a new terminal:');
    console.log('   mongod');
    process.exit(1);
  }
};

module.exports = { connect };