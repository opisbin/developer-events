import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {cacheLife} from "next/cache";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

const Page = async () => {
    let events: any[] = [];
    
    try {
        await connectDB();
        events = await Event.find().sort({ createdAt: -1 }).lean();
    } catch (error) {
        console.error('Error fetching events:', error);
    }

    return (
        <section>
            <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events && events.length > 0 && events.map((event: any) => (
                        <li key={event._id?.toString() || event.slug} className="list-none">
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default Page;