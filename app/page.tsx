import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'

const events = [
  {image: '/images/event1.png', title: 'Event 1'},
  {image: '/images/event2.png', title: 'Event 2'},
]

const page = () => {
  return (
    <section>
      <h1 className='text-center'>The hub of developer <br />Events you cant miss</h1>
      <p className='text-center mt-5'>Stay updated with the latest events in the developer community.</p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>

        <ul className='events'>
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page