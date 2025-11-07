export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    image: '/images/event1.png',
    title: 'React Summit 2025',
    slug: 'react-summit-2025',
    location: 'Amsterdam, Netherlands',
    date: '2025-11-14',
    time: '09:00 AM',
  },
  {
    image: '/images/event2.png',
    title: 'GitHub Universe',
    slug: 'github-universe-2025',
    location: 'San Francisco, CA',
    date: '2025-11-19',
    time: '10:00 AM',
  },
  {
    image: '/images/event3.png',
    title: 'AWS re:Invent',
    slug: 'aws-reinvent-2025',
    location: 'Las Vegas, NV',
    date: '2025-12-02',
    time: '08:30 AM',
  },
  {
    image: '/images/event4.png',
    title: 'DevOps World',
    slug: 'devops-world-2025',
    location: 'London, UK',
    date: '2025-12-10',
    time: '09:00 AM',
  },
  {
    image: '/images/event5.png',
    title: 'KubeCon + CloudNativeCon',
    slug: 'kubecon-cloudnativecon-2026',
    location: 'Paris, France',
    date: '2026-03-19',
    time: '08:00 AM',
  },
  {
    image: '/images/event6.png',
    title: 'Google I/O',
    slug: 'google-io-2026',
    location: 'Mountain View, CA',
    date: '2026-05-12',
    time: '10:00 AM',
  },
];
