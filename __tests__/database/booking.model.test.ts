import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Booking, { IBooking } from '@/database/booking.model';
import Event, { IEvent } from '@/database/event.model';

describe('Booking Model', () => {
  let mongoServer: MongoMemoryServer;
  let testEventId: mongoose.Types.ObjectId;

  // Setup: Start in-memory MongoDB before all tests
  beforeAll(async () => {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create a test event for bookings
    const event = new Event({
      title: 'Test Event',
      description: 'Test event for booking tests',
      overview: 'Overview of test event',
      image: 'https://example.com/event.jpg',
      venue: 'Test Venue',
      location: 'Test Location',
      date: '2025-12-25',
      time: '10:00',
      mode: 'In-person',
      audience: 'Test Audience',
      agenda: ['Item 1'],
      organizer: 'Test Organizer',
      tags: ['test'],
    });
    const savedEvent = await event.save();
    testEventId = savedEvent._id as mongoose.Types.ObjectId;
  });

  // Cleanup: Clear bookings after each test
  afterEach(async () => {
    await Booking.deleteMany({});
  });

  // Teardown: Stop in-memory MongoDB after all tests
  afterAll(async () => {
    await Event.deleteMany({});
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Schema Validation', () => {
    it('should create a valid booking with all required fields', async () => {
      const validBooking = {
        eventId: testEventId,
        email: 'test@example.com',
      };

      const booking = new Booking(validBooking);
      const savedBooking = await booking.save();

      expect(savedBooking._id).toBeDefined();
      expect(savedBooking.eventId.toString()).toBe(testEventId.toString());
      expect(savedBooking.email).toBe('test@example.com');
      expect(savedBooking.createdAt).toBeDefined();
      expect(savedBooking.updatedAt).toBeDefined();
    });

    it('should fail when eventId is missing', async () => {
      const bookingWithoutEventId = {
        email: 'test@example.com',
      };

      const booking = new Booking(bookingWithoutEventId);
      await expect(booking.save()).rejects.toThrow();
    });

    it('should fail when email is missing', async () => {
      const bookingWithoutEmail = {
        eventId: testEventId,
      };

      const booking = new Booking(bookingWithoutEmail);
      await expect(booking.save()).rejects.toThrow();
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email addresses', async () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
        '123@example.com',
      ];

      for (const email of validEmails) {
        const booking = new Booking({
          eventId: testEventId,
          email: email,
        });
        const saved = await booking.save();
        expect(saved.email).toBe(email.toLowerCase());
        await Booking.deleteOne({ _id: saved._id });
      }
    });

    it('should fail with invalid email - no @ symbol', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'invalidemail.com',
      });

      await expect(booking.save()).rejects.toThrow('Please provide a valid email address');
    });

    it('should fail with invalid email - no domain', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@',
      });

      await expect(booking.save()).rejects.toThrow('Please provide a valid email address');
    });

    it('should fail with invalid email - no local part', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: '@example.com',
      });

      await expect(booking.save()).rejects.toThrow('Please provide a valid email address');
    });

    it('should fail with invalid email - spaces', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user name@example.com',
      });

      await expect(booking.save()).rejects.toThrow('Please provide a valid email address');
    });

    it('should fail with invalid email - no TLD', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@domain',
      });

      await expect(booking.save()).rejects.toThrow('Please provide a valid email address');
    });

    it('should convert email to lowercase', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'TEST@EXAMPLE.COM',
      });

      const saved = await booking.save();
      expect(saved.email).toBe('test@example.com');
    });

    it('should trim whitespace from email', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: '  test@example.com  ',
      });

      const saved = await booking.save();
      expect(saved.email).toBe('test@example.com');
    });
  });

  describe('Event Reference Validation', () => {
    it('should fail when referenced event does not exist', async () => {
      const nonExistentEventId = new mongoose.Types.ObjectId();
      const booking = new Booking({
        eventId: nonExistentEventId,
        email: 'test@example.com',
      });

      await expect(booking.save()).rejects.toThrow('Event does not exist');
    });

    it('should pass validation when event exists', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });

      await expect(booking.save()).resolves.toBeDefined();
    });

    it('should validate eventId only when modified', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });

      await booking.save();

      // Update email without changing eventId
      booking.email = 'newemail@example.com';
      await expect(booking.save()).resolves.toBeDefined();
    });

    it('should revalidate eventId when it is modified', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });

      await booking.save();

      // Try to change to non-existent event
      const nonExistentEventId = new mongoose.Types.ObjectId();
      booking.eventId = nonExistentEventId;
      
      await expect(booking.save()).rejects.toThrow('Event does not exist');
    });
  });

  describe('Timestamps', () => {
    it('should automatically create createdAt and updatedAt timestamps', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });

      await booking.save();
      expect(booking.createdAt).toBeDefined();
      expect(booking.updatedAt).toBeDefined();
      expect(booking.createdAt).toBeInstanceOf(Date);
      expect(booking.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt timestamp on modification', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });

      await booking.save();
      const originalUpdatedAt = booking.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      booking.email = 'updated@example.com';
      await booking.save();

      expect(booking.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should not change createdAt on update', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });

      await booking.save();
      const originalCreatedAt = booking.createdAt;

      await new Promise((resolve) => setTimeout(resolve, 10));

      booking.email = 'updated@example.com';
      await booking.save();

      expect(booking.createdAt.getTime()).toBe(originalCreatedAt.getTime());
    });
  });

  describe('Indexes', () => {
    it('should have an index on eventId', async () => {
      const indexes = await Booking.collection.getIndexes();
      expect(indexes).toHaveProperty('eventId_1');
    });

    it('should have a compound index on eventId and email', async () => {
      const indexes = await Booking.collection.getIndexes();
      expect(indexes).toHaveProperty('eventId_1_email_1');
    });
  });

  describe('Multiple Bookings', () => {
    it('should allow multiple bookings for the same event', async () => {
      const booking1 = new Booking({
        eventId: testEventId,
        email: 'user1@example.com',
      });

      const booking2 = new Booking({
        eventId: testEventId,
        email: 'user2@example.com',
      });

      await booking1.save();
      await booking2.save();

      const bookings = await Booking.find({ eventId: testEventId });
      expect(bookings).toHaveLength(2);
    });

    it('should allow same email for different events', async () => {
      // Create second event
      const event2 = new Event({
        title: 'Second Test Event',
        description: 'Second test event',
        overview: 'Overview',
        image: 'https://example.com/event2.jpg',
        venue: 'Venue 2',
        location: 'Location 2',
        date: '2025-12-26',
        time: '11:00',
        mode: 'Online',
        audience: 'Everyone',
        agenda: ['Item 1'],
        organizer: 'Organizer 2',
        tags: ['test2'],
      });
      const savedEvent2 = await event2.save();

      const booking1 = new Booking({
        eventId: testEventId,
        email: 'same@example.com',
      });

      const booking2 = new Booking({
        eventId: savedEvent2._id,
        email: 'same@example.com',
      });

      await booking1.save();
      await booking2.save();

      const bookings = await Booking.find({ email: 'same@example.com' });
      expect(bookings).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email addresses within limits', async () => {
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      const booking = new Booking({
        eventId: testEventId,
        email: longEmail,
      });

      const saved = await booking.save();
      expect(saved.email).toBe(longEmail);
    });

    it('should handle special characters in email local part', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user+tag123@example.com',
      });

      const saved = await booking.save();
      expect(saved.email).toBe('user+tag123@example.com');
    });

    it('should handle hyphenated domains', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@my-domain.com',
      });

      const saved = await booking.save();
      expect(saved.email).toBe('user@my-domain.com');
    });

    it('should handle subdomains in email', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@mail.example.com',
      });

      const saved = await booking.save();
      expect(saved.email).toBe('user@mail.example.com');
    });
  });

  describe('Model Population', () => {
    it('should populate event details when querying bookings', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });

      await booking.save();

      const populatedBooking = await Booking.findById(booking._id).populate('eventId');
      expect(populatedBooking).toBeDefined();
      expect(populatedBooking!.eventId).toBeDefined();
      
      const event = populatedBooking!.eventId as unknown as IEvent;
      expect(event.title).toBe('Test Event');
    });
  });

  describe('Query Performance', () => {
    it('should efficiently query bookings by eventId', async () => {
      // Create multiple bookings
      const bookingPromises = Array.from({ length: 10 }, (_, i) => {
        return new Booking({
          eventId: testEventId,
          email: `user${i}@example.com`,
        }).save();
      });

      await Promise.all(bookingPromises);

      const startTime = Date.now();
      const bookings = await Booking.find({ eventId: testEventId });
      const queryTime = Date.now() - startTime;

      expect(bookings).toHaveLength(10);
      expect(queryTime).toBeLessThan(100); // Should be fast due to index
    });

    it('should efficiently query bookings by email', async () => {
      const email = 'test@example.com';
      const booking = new Booking({
        eventId: testEventId,
        email: email,
      });

      await booking.save();

      const startTime = Date.now();
      const bookings = await Booking.find({ email: email });
      const queryTime = Date.now() - startTime;

      expect(bookings).toHaveLength(1);
      expect(queryTime).toBeLessThan(100);
    });
  });
});