const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');

    // Use environment variable for connection string
    const uri = process.env.MONGODB_URI || 'mongodb://username:password@your-cluster-shard-00-00.mongodb.net:27017,your-cluster-shard-00-01.mongodb.net:27017,your-cluster-shard-00-02.mongodb.net:27017/?ssl=true&replicaSet=your-replica-set&authSource=admin&retryWrites=true&w=majority&appName=YourApp';

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();