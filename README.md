# 🎯 Developer Events Platform

> **The Hub for Every Dev Event You Can't Miss** — Discover, explore, and book hackathons, meetups, and conferences all in one place.

---

## ✨ Features

- 🔍 **Event Discovery** — Browse featured developer events from around the world
- 📅 **Event Details** — Comprehensive information including agenda, location, and organizers
- 🎫 **Easy Booking** — Simple registration system with email notifications
- 🔎 **Smart Recommendations** — Discover similar events based on tags and categories
- ⚡ **Real-time Updates** — Powered by Next.js 15 with optimized caching
- 🎨 **Stunning UI** — Beautiful animations with WebGL light rays and smooth transitions
- 📱 **Responsive Design** — Perfect experience on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** — React framework with App Router and Server Components
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[OGL](https://github.com/oframe/ogl)** — WebGL for stunning visual effects

### Backend
- **[MongoDB](https://www.mongodb.com/)** — NoSQL database with Mongoose ODM
- **[Cloudinary](https://cloudinary.com/)** — Image hosting and optimization
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** — Serverless backend

### Analytics & Monitoring
- **[PostHog](https://posthog.com/)** — Product analytics and feature flags

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm/yarn/pnpm/bun**
- **MongoDB Atlas** account or local MongoDB instance
- **Cloudinary** account for image uploads

### 1. Clone the Repository

```bash
git clone https://github.com/opisbin/developer-events.git
cd developer-events
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Cloudinary
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# PostHog (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app! 🎉

---

## 📁 Project Structure

```
fullstack/
├── app/
│   ├── api/
│   │   └── events/
│   │       ├── route.ts           # GET & POST events
│   │       └── [slug]/
│   │           └── route.ts       # GET event by slug
│   ├── events/
│   │   └── [slug]/
│   │       └── page.tsx           # Event detail page
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Homepage
├── components/
│   ├── BookEvent.tsx              # Booking form component
│   ├── EventCard.tsx              # Event card component
│   ├── EventDetails.tsx           # Event details view
│   ├── ExploreBtn.tsx             # Explore button
│   ├── LightRays.tsx              # WebGL light effects
│   └── Navbar.tsx                 # Navigation bar
├── database/
│   ├── booking.model.ts           # Booking schema
│   ├── event.model.ts             # Event schema
│   └── index.ts                   # Database exports
├── lib/
│   ├── actions/
│   │   ├── booking.actions.ts     # Booking server actions
│   │   └── event.actions.ts       # Event server actions
│   ├── constants.ts               # Sample event data
│   └── mongodb.ts                 # Database connection
└── public/
    ├── icons/                     # SVG icons
    └── images/                    # Event images
```

---

## 🎨 Key Features Explained

### Server Components & Caching

Uses Next.js 15's new caching strategy:

```tsx
'use cache'
cacheLife('hours');
```

### API Routes with Validation

Secure event creation with field whitelisting:

```typescript
// Only allowed fields are passed to database
const allowedFields = {
  title, description, overview, image,
  venue, location, date, time, mode,
  audience, organizer, tags, agenda
};
```

### WebGL Visual Effects

Stunning light ray animations with optimized performance:

- Refs prevent stale closures
- Separate effects for dynamic updates
- Stable WebGL pipeline

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 📝 API Documentation

### Get All Events
```http
GET /api/events
```

### Get Event by Slug
```http
GET /api/events/:slug
```

### Create Event
```http
POST /api/events
Content-Type: multipart/form-data

{
  "title": "React Summit 2025",
  "description": "...",
  "image": <file>,
  "tags": ["React", "JavaScript"],
  "agenda": ["09:00 - Keynote", "..."],
  ...
}
```

---

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/opisbin/developer-events)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy! 🎉

### Other Platforms

- **[Netlify](https://www.netlify.com/)**
- **[Railway](https://railway.app/)**
- **[Render](https://render.com/)**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [MongoDB](https://www.mongodb.com/) for the database
- [Cloudinary](https://cloudinary.com/) for image management

---

## 📧 Contact

**Developer**: opisbin  
**Repository**: [github.com/opisbin/developer-events](https://github.com/opisbin/developer-events)

---

<div align="center">
  <strong>Built with ❤️ using Next.js 15</strong>
</div>
