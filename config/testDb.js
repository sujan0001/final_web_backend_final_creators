const mongoose = require('mongoose');

const connectTestDB = async () => {
  try {
    // Use a separate test database
    const testDbUri = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/sujan_backend_test';
    
    await mongoose.connect(testDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to Test Database');
  } catch (error) {
    console.error('Test Database connection failed:', error);
    process.exit(1);
  }
};

const disconnectTestDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from Test Database');
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
  }
};

const clearTestDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log('Test database cleared');
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearTestDB
};