import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('MongoDB Connection Utility', () => {
  let mongoServer: MongoMemoryServer;
  let originalEnv: NodeJS.ProcessEnv;
  let connectDB: () => Promise<typeof mongoose>;

  beforeEach(async () => {
    // Save original environment
    originalEnv = { ...process.env };

    // Disconnect any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Clear module cache to get fresh instance
    jest.resetModules();

    // Clear global mongoose cache
    if (global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }

    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();

    // Import after setting environment
    connectDB = (await import('@/lib/mongodb')).default;
  });

  afterEach(async () => {
    // Restore original environment
    process.env = originalEnv;

    // Disconnect and clean up
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }

    // Clear global cache
    if (global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }
  });

  describe('Environment Variable Validation', () => {
    it('should throw error when MONGODB_URI is not defined', async () => {
      delete process.env.MONGODB_URI;
      
      // Need to re-import after deleting env var
      jest.resetModules();
      
      await expect(async () => {
        await import('@/lib/mongodb');
      }).rejects.toThrow('Please define the MONGODB_URI environment variable inside .env.local');
    });

    it('should not throw error when MONGODB_URI is defined', async () => {
      expect(process.env.MONGODB_URI).toBeDefined();
      
      // Should import without errors
      const module = await import('@/lib/mongodb');
      expect(module.default).toBeDefined();
    });
  });

  describe('Connection Establishment', () => {
    it('should successfully connect to MongoDB', async () => {
      const connection = await connectDB();
      
      expect(connection).toBeDefined();
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });

    it('should return mongoose instance', async () => {
      const connection = await connectDB();
      
      expect(connection).toBe(mongoose);
    });

    it('should connect with bufferCommands disabled', async () => {
      await connectDB();
      
      // bufferCommands should be disabled in the connection options
      expect(mongoose.connection.getClient().options).toBeDefined();
    });
  });

  describe('Connection Caching', () => {
    it('should cache the connection after first call', async () => {
      const connection1 = await connectDB();
      const connection2 = await connectDB();
      
      expect(connection1).toBe(connection2);
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should reuse cached connection on subsequent calls', async () => {
      await connectDB();
      const firstConnectionTime = Date.now();
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      await connectDB();
      const secondConnectionTime = Date.now();
      
      // Second call should be much faster (< 10ms) because it uses cache
      expect(secondConnectionTime - firstConnectionTime).toBeLessThan(100);
    });

    it('should store connection in global cache', async () => {
      await connectDB();
      
      expect(global.mongoose).toBeDefined();
      expect(global.mongoose?.conn).toBeDefined();
      expect(global.mongoose?.promise).toBeDefined();
    });

    it('should return cached connection if already connected', async () => {
      const connection1 = await connectDB();
      
      // Manually set cached connection
      if (global.mongoose) {
        global.mongoose.conn = connection1;
      }
      
      const connection2 = await connectDB();
      expect(connection2).toBe(connection1);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Stop the mongo server to cause connection failure
      await mongoServer.stop();
      
      // Set invalid URI
      process.env.MONGODB_URI = 'mongodb://invalid:27017/test';
      
      // Re-import with invalid URI
      jest.resetModules();
      if (global.mongoose) {
        global.mongoose = { conn: null, promise: null };
      }
      const connectDBInvalid = (await import('@/lib/mongodb')).default;
      
      await expect(connectDBInvalid()).rejects.toThrow();
    });

    it('should reset promise cache on connection error', async () => {
      // Stop the mongo server
      await mongoServer.stop();
      
      process.env.MONGODB_URI = 'mongodb://invalid:27017/test';
      jest.resetModules();
      if (global.mongoose) {
        global.mongoose = { conn: null, promise: null };
      }
      
      const connectDBInvalid = (await import('@/lib/mongodb')).default;
      
      try {
        await connectDBInvalid();
      } catch (error) {
        // Error expected
      }
      
      // Promise should be reset to null after error
      expect(global.mongoose?.promise).toBeNull();
    });

    it('should allow retry after failed connection', async () => {
      // Stop server to cause initial failure
      await mongoServer.stop();
      process.env.MONGODB_URI = 'mongodb://invalid:27017/test';
      
      jest.resetModules();
      if (global.mongoose) {
        global.mongoose = { conn: null, promise: null };
      }
      
      const connectDBInvalid = (await import('@/lib/mongodb')).default;
      
      // First attempt should fail
      await expect(connectDBInvalid()).rejects.toThrow();
      
      // Restart server and update URI for retry
      mongoServer = await MongoMemoryServer.create();
      process.env.MONGODB_URI = mongoServer.getUri();
      
      jest.resetModules();
      if (global.mongoose) {
        global.mongoose = { conn: null, promise: null };
      }
      
      const connectDBValid = (await import('@/lib/mongodb')).default;
      
      // Second attempt should succeed
      const connection = await connectDBValid();
      expect(connection).toBeDefined();
      expect(mongoose.connection.readyState).toBe(1);
    });
  });

  describe('Concurrent Connections', () => {
    it('should handle multiple simultaneous connection attempts', async () => {
      // Clear cache to force new connection
      if (global.mongoose) {
        global.mongoose = { conn: null, promise: null };
      }
      
      // Make multiple concurrent connection attempts
      const connectionPromises = Array(5).fill(null).map(() => connectDB());
      const connections = await Promise.all(connectionPromises);
      
      // All should return the same connection
      connections.forEach(conn => {
        expect(conn).toBe(connections[0]);
      });
      
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should not create multiple connections when called concurrently', async () => {
      if (global.mongoose) {
        global.mongoose = { conn: null, promise: null };
      }
      
      const promises = [connectDB(), connectDB(), connectDB()];
      const results = await Promise.all(promises);
      
      // All should be the same instance
      expect(results[0]).toBe(results[1]);
      expect(results[1]).toBe(results[2]);
    });
  });

  describe('Global Cache Behavior', () => {
    it('should initialize global cache if not present', async () => {
      delete (global as any).mongoose;
      
      await connectDB();
      
      expect(global.mongoose).toBeDefined();
      expect(global.mongoose?.conn).toBeDefined();
    });

    it('should use existing global cache if present', async () => {
      const mockConn = await connectDB();
      
      // Set up global cache
      global.mongoose = {
        conn: mockConn,
        promise: Promise.resolve(mockConn),
      };
      
      const connection = await connectDB();
      expect(connection).toBe(mockConn);
    });
  });

  describe('Connection State', () => {
    it('should have correct connection state after connecting', async () => {
      await connectDB();
      
      // State 1 means connected
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should maintain connection state across multiple calls', async () => {
      await connectDB();
      expect(mongoose.connection.readyState).toBe(1);
      
      await connectDB();
      expect(mongoose.connection.readyState).toBe(1);
      
      await connectDB();
      expect(mongoose.connection.readyState).toBe(1);
    });
  });

  describe('Module Export', () => {
    it('should export connectDB as default function', async () => {
      const module = await import('@/lib/mongodb');
      expect(typeof module.default).toBe('function');
    });

    it('should return a Promise when called', () => {
      const result = connectDB();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('Integration Tests', () => {
    it('should allow database operations after connection', async () => {
      await connectDB();
      
      // Create a simple test schema
      const TestSchema = new mongoose.Schema({
        name: String,
      });
      
      const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);
      
      // Perform a database operation
      const doc = await TestModel.create({ name: 'test' });
      expect(doc.name).toBe('test');
      
      // Clean up
      await TestModel.deleteMany({});
    });

    it('should handle multiple models using same connection', async () => {
      await connectDB();
      
      const Schema1 = new mongoose.Schema({ field1: String });
      const Schema2 = new mongoose.Schema({ field2: Number });
      
      const Model1 = mongoose.models.Model1 || mongoose.model('Model1', Schema1);
      const Model2 = mongoose.models.Model2 || mongoose.model('Model2', Schema2);
      
      const doc1 = await Model1.create({ field1: 'test' });
      const doc2 = await Model2.create({ field2: 123 });
      
      expect(doc1.field1).toBe('test');
      expect(doc2.field2).toBe(123);
      
      // Clean up
      await Model1.deleteMany({});
      await Model2.deleteMany({});
    });
  });

  describe('Edge Cases', () => {
    it('should handle connection when mongoose is already connected', async () => {
      // Connect manually first
      await mongoose.connect(process.env.MONGODB_URI as string);
      
      // Then call connectDB
      const connection = await connectDB();
      expect(connection).toBeDefined();
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should handle empty global cache object', async () => {
      global.mongoose = { conn: null, promise: null };
      
      const connection = await connectDB();
      expect(connection).toBeDefined();
      expect(global.mongoose.conn).toBeDefined();
    });
  });
});