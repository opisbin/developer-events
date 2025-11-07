import EventDetails from '@/components/EventDetails';
import { Suspense, use } from 'react';

type EventDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
  const { slug } = await params;
  
  return (
    <Suspense>
      <EventDetails params={Promise.resolve(slug)} />
    </Suspense>
  );
};

export default EventDetailsPage;