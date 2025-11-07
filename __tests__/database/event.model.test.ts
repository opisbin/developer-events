import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Event, { IEvent } from '@/database/event.model';

describe('Event Model', () => {
  let mongoServer: MongoMemoryServer;

  // Setup: Start in-memory MongoDB before all tests
  beforeAll(async () => {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Cleanup: Clear database after each test
  afterEach(async () => {
    await Event.deleteMany({});
  });

  // Teardown: Stop in-memory MongoDB after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Schema Validation', () => {
    it('should create a valid event with all required fields', async () => {
      const validEvent = {
        title: 'React Summit 2025',
        description: 'A comprehensive conference about React and modern web development',
        overview: 'Join us for two days of React talks, workshops, and networking',
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam, Netherlands',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers, Tech Enthusiasts',
        agenda: ['Keynote', 'Workshop', 'Networking'],
        organizer: 'React Foundation',
        tags: ['react', 'javascript', 'web-development'],
      };

      const event = new Event(validEvent);
      const savedEvent = await event.save();

      expect(savedEvent._id).toBeDefined();
      expect(savedEvent.title).toBe(validEvent.title);
      expect(savedEvent.slug).toBe('react-summit-2025');
      expect(savedEvent.description).toBe(validEvent.description);
      expect(savedEvent.createdAt).toBeDefined();
      expect(savedEvent.updatedAt).toBeDefined();
    });

    it('should fail when title is missing', async () => {
      const eventWithoutTitle = {
        description: 'A conference',
        overview: 'Overview text',
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['tag1'],
      };

      const event = new Event(eventWithoutTitle);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail when description is missing', async () => {
      const eventWithoutDescription = {
        title: 'Event Title',
        overview: 'Overview text',
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['tag1'],
      };

      const event = new Event(eventWithoutDescription);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail when overview is missing', async () => {
      const eventWithoutOverview = {
        title: 'Event Title',
        description: 'Description text',
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['tag1'],
      };

      const event = new Event(eventWithoutOverview);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail when agenda is empty array', async () => {
      const eventWithEmptyAgenda = {
        title: 'Event Title',
        description: 'Description text',
        overview: 'Overview text',
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: [],
        organizer: 'Organizer',
        tags: ['tag1'],
      };

      const event = new Event(eventWithEmptyAgenda);
      await expect(event.save()).rejects.toThrow('Agenda must contain at least one item');
    });

    it('should fail when tags is empty array', async () => {
      const eventWithEmptyTags = {
        title: 'Event Title',
        description: 'Description text',
        overview: 'Overview text',
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: [],
      };

      const event = new Event(eventWithEmptyTags);
      await expect(event.save()).rejects.toThrow('Tags must contain at least one item');
    });

    it('should fail when title exceeds 100 characters', async () => {
      const longTitle = 'A'.repeat(101);
      const eventWithLongTitle = {
        title: longTitle,
        description: 'Description text',
        overview: 'Overview text',
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['tag1'],
      };

      const event = new Event(eventWithLongTitle);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail when description exceeds 1000 characters', async () => {
      const longDescription = 'A'.repeat(1001);
      const eventWithLongDescription = {
        title: 'Event Title',
        description: longDescription,
        overview: 'Overview text',
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['tag1'],
      };

      const event = new Event(eventWithLongDescription);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail when overview exceeds 500 characters', async () => {
      const longOverview = 'A'.repeat(501);
      const eventWithLongOverview = {
        title: 'Event Title',
        description: 'Description text',
        overview: longOverview,
        image: 'https://example.com/event.jpg',
        venue: 'Convention Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['tag1'],
      };

      const event = new Event(eventWithLongOverview);
      await expect(event.save()).rejects.toThrow();
    });
  });

  describe('Slug Generation', () => {
    it('should generate slug from title on creation', async () => {
      const event = new Event({
        title: 'React Summit 2025',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.slug).toBe('react-summit-2025');
    });

    it('should convert title to lowercase in slug', async () => {
      const event = new Event({
        title: 'UPPERCASE EVENT TITLE',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.slug).toBe('uppercase-event-title');
    });

    it('should replace spaces with hyphens in slug', async () => {
      const event = new Event({
        title: 'Multiple Word Event Title',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.slug).toBe('multiple-word-event-title');
    });

    it('should remove special characters from slug', async () => {
      const event = new Event({
        title: 'Event! With@ Special# Characters$',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.slug).toBe('event-with-special-characters');
    });

    it('should handle multiple consecutive hyphens in slug', async () => {
      const event = new Event({
        title: 'Event   With    Multiple    Spaces',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.slug).toBe('event-with-multiple-spaces');
    });

    it('should remove leading and trailing hyphens from slug', async () => {
      const event = new Event({
        title: '  Event With Leading And Trailing Spaces  ',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.slug).toBe('event-with-leading-and-trailing-spaces');
    });

    it('should regenerate slug when title is modified', async () => {
      const event = new Event({
        title: 'Original Title',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.slug).toBe('original-title');

      event.title = 'Updated Title';
      await event.save();
      expect(event.slug).toBe('updated-title');
    });

    it('should not regenerate slug when title is not modified', async () => {
      const event = new Event({
        title: 'Original Title',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      const originalSlug = event.slug;

      event.description = 'Updated Description';
      await event.save();
      expect(event.slug).toBe(originalSlug);
    });
  });

  describe('Date and Time Normalization', () => {
    it('should normalize date to ISO format (YYYY-MM-DD)', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '11/14/2025',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should fail with invalid date format', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: 'invalid-date',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await expect(event.save()).rejects.toThrow('Invalid date format');
    });

    it('should normalize time to HH:MM format with leading zeros', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '9:5',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.time).toBe('09:05');
    });

    it('should accept valid 24-hour time format', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '23:59',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.time).toBe('23:59');
    });

    it('should fail with invalid time format', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '25:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await expect(event.save()).rejects.toThrow('Invalid time format');
    });

    it('should fail with invalid time - minutes over 59', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '12:60',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await expect(event.save()).rejects.toThrow('Invalid time format');
    });

    it('should fail with non-HH:MM format', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '9 AM',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await expect(event.save()).rejects.toThrow('Invalid time format');
    });
  });

  describe('String Trimming', () => {
    it('should trim whitespace from title', async () => {
      const event = new Event({
        title: '  Event Title  ',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.title).toBe('Event Title');
    });

    it('should trim whitespace from description', async () => {
      const event = new Event({
        title: 'Event',
        description: '  Description Text  ',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.description).toBe('Description Text');
    });

    it('should trim whitespace from all string fields', async () => {
      const event = new Event({
        title: '  Event  ',
        description: '  Description  ',
        overview: '  Overview  ',
        image: '  https://example.com/event.jpg  ',
        venue: '  Center  ',
        location: '  Amsterdam  ',
        date: '2025-11-14',
        time: '09:00',
        mode: '  In-person  ',
        audience: '  Developers  ',
        agenda: ['Keynote'],
        organizer: '  Organizer  ',
        tags: ['react'],
      });

      await event.save();
      expect(event.title).toBe('Event');
      expect(event.description).toBe('Description');
      expect(event.overview).toBe('Overview');
      expect(event.image).toBe('https://example.com/event.jpg');
      expect(event.venue).toBe('Center');
      expect(event.location).toBe('Amsterdam');
      expect(event.mode).toBe('In-person');
      expect(event.audience).toBe('Developers');
      expect(event.organizer).toBe('Organizer');
    });
  });

  describe('Slug Uniqueness', () => {
    it('should enforce unique slug constraint', async () => {
      const event1 = new Event({
        title: 'React Summit',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event1.save();

      const event2 = new Event({
        title: 'React Summit',
        description: 'Different Description',
        overview: 'Different Overview',
        image: 'https://example.com/event2.jpg',
        venue: 'Different Center',
        location: 'Rotterdam',
        date: '2025-12-14',
        time: '10:00',
        mode: 'Online',
        audience: 'Students',
        agenda: ['Workshop'],
        organizer: 'Different Organizer',
        tags: ['javascript'],
      });

      await expect(event2.save()).rejects.toThrow();
    });
  });

  describe('Timestamps', () => {
    it('should automatically create createdAt and updatedAt timestamps', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.createdAt).toBeDefined();
      expect(event.updatedAt).toBeDefined();
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(event.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt timestamp on modification', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      const originalUpdatedAt = event.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      event.description = 'Updated Description';
      await event.save();

      expect(event.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Index Creation', () => {
    it('should have an index on slug field', async () => {
      const indexes = await Event.collection.getIndexes();
      expect(indexes).toHaveProperty('slug_1');
    });
  });

  describe('Array Fields', () => {
    it('should accept multiple agenda items', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Registration', 'Keynote', 'Workshop', 'Lunch', 'Networking'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.agenda).toHaveLength(5);
      expect(event.agenda).toEqual(['Registration', 'Keynote', 'Workshop', 'Lunch', 'Networking']);
    });

    it('should accept multiple tags', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react', 'javascript', 'typescript', 'web-development', 'frontend'],
      });

      await event.save();
      expect(event.tags).toHaveLength(5);
      expect(event.tags).toEqual(['react', 'javascript', 'typescript', 'web-development', 'frontend']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string slug generation', async () => {
      const event = new Event({
        title: '!!!',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.slug).toBe('');
    });

    it('should handle midnight time (00:00)', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '0:0',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Organizer',
        tags: ['react'],
      });

      await event.save();
      expect(event.time).toBe('00:00');
    });

    it('should handle single-digit agenda and tags', async () => {
      const event = new Event({
        title: 'Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/event.jpg',
        venue: 'Center',
        location: 'Amsterdam',
        date: '2025-11-14',
        time: '09:00',
        mode: 'In-person',
        audience: 'Developers',
        agenda: ['Item'],
        organizer: 'Organizer',
        tags: ['tag'],
      });

      await event.save();
      expect(event.agenda).toHaveLength(1);
      expect(event.tags).toHaveLength(1);
    });
  });
});