import EventDetails from '@/components/EventDetails';
import { Suspense } from 'react';
import Event from '@/database/event.model';
import connectDB from '@/lib/mongodb';

type EventDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

// Generate static params for all events at build time
export async function generateStaticParams() {
  try {
    await connectDB();
    const events = await Event.find().select('slug').lean();
    
    return events.map((event: any) => ({
      slug: event.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
  const { slug } = await params;
  
  return (
    <main>
      <Suspense fallback={<div className="container mx-auto py-20 text-center">Loading event details...</div>}>
        <EventDetails slug={slug} />
      </Suspense>
    </main>
  );
};

export default EventDetailsPage;