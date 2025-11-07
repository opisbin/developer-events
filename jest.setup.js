// Mock environment variables for testing
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

// Increase timeout for database operations
jest.setTimeout(10000);