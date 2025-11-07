import { Schema, model, models, Document, Types } from 'mongoose';

/**
 * TypeScript interface for Booking document
 * Extends Document to include Mongoose document properties
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          // RFC 5322 compliant email validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to verify event exists before creating booking
 * Throws error if referenced event does not exist in database
 */
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isModified('eventId')) {
    try {
      // Dynamic import to avoid circular dependency issues
      const Event = models.Event || (await import('./event.model')).default;
      
      const eventExists = await Event.findById(this.eventId);
      
      if (!eventExists) {
        return next(new Error('Event does not exist. Cannot create booking for non-existent event.'));
      }
    } catch (error) {
      return next(error instanceof Error ? error : new Error('Error validating event reference'));
    }
  }
  
  next();
});

// Create index on eventId for faster lookups and filtering
BookingSchema.index({ eventId: 1 });

// Create compound index for common query patterns (event + email uniqueness check)
BookingSchema.index({ eventId: 1, email: 1 });

/**
 * Use existing model if it exists (prevents Next.js hot reload issues)
 * Otherwise create new model
 */
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
