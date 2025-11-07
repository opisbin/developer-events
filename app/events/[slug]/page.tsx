import EventDetails from '@/components/EventDetails';
import { Suspense } from 'react';

type EventDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

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