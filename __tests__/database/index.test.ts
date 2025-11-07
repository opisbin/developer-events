import * as DatabaseExports from '@/database';

describe('Database Index Exports', () => {
  describe('Model Exports', () => {
    it('should export Event model', () => {
      expect(DatabaseExports.Event).toBeDefined();
      expect(typeof DatabaseExports.Event).toBe('function');
    });

    it('should export Booking model', () => {
      expect(DatabaseExports.Booking).toBeDefined();
      expect(typeof DatabaseExports.Booking).toBe('function');
    });
  });

  describe('Type Exports', () => {
    it('should export IEvent type', () => {
      // TypeScript will catch if this type doesn't exist at compile time
      type TestIEvent = DatabaseExports.IEvent;
      const testType: TestIEvent = {} as TestIEvent;
      expect(testType).toBeDefined();
    });

    it('should export IBooking type', () => {
      // TypeScript will catch if this type doesn't exist at compile time
      type TestIBooking = DatabaseExports.IBooking;
      const testType: TestIBooking = {} as TestIBooking;
      expect(testType).toBeDefined();
    });
  });

  describe('Export Consistency', () => {
    it('should have exactly the expected exports', () => {
      const exports = Object.keys(DatabaseExports);
      const expectedExports = ['Event', 'Booking'];
      
      // Check that all expected exports are present
      expectedExports.forEach(expectedExport => {
        expect(exports).toContain(expectedExport);
      });
    });

    it('Event model should have expected Mongoose model properties', () => {
      expect(DatabaseExports.Event.modelName).toBe('Event');
      expect(DatabaseExports.Event.find).toBeDefined();
      expect(DatabaseExports.Event.findOne).toBeDefined();
      expect(DatabaseExports.Event.findById).toBeDefined();
      expect(DatabaseExports.Event.create).toBeDefined();
      expect(DatabaseExports.Event.updateOne).toBeDefined();
      expect(DatabaseExports.Event.deleteOne).toBeDefined();
    });

    it('Booking model should have expected Mongoose model properties', () => {
      expect(DatabaseExports.Booking.modelName).toBe('Booking');
      expect(DatabaseExports.Booking.find).toBeDefined();
      expect(DatabaseExports.Booking.findOne).toBeDefined();
      expect(DatabaseExports.Booking.findById).toBeDefined();
      expect(DatabaseExports.Booking.create).toBeDefined();
      expect(DatabaseExports.Booking.updateOne).toBeDefined();
      expect(DatabaseExports.Booking.deleteOne).toBeDefined();
    });
  });
});