# Padel Connect

A responsive Next.js web application for connecting padel players and organizing matches in real-time.

## Features

- 🔐 **Authentication**: Email/password signup and login powered by Supabase
- 👥 **Player Dashboard**: View all online players with their skill levels and locations
- 🎾 **Match Requests**: Send, accept, or reject match requests between players
- ⚡ **Live Matches**: Real-time match status updates using Supabase Realtime
- 🔒 **Secure**: Row-level security ensures users only see authorized data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Fonts**: Montserrat (headings), Inter (body text)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create a `.env.local` file with your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── match/[id]/        # Live match page (dynamic route)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (redirects)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── LogoutButton.tsx
│   ├── PlayerList.tsx
│   ├── MatchRequestActions.tsx
│   └── LiveMatchClient.tsx
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client configuration
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client
│   └── auth.ts           # Authentication helpers
├── middleware.ts          # Route protection middleware
└── SUPABASE_SETUP.md     # Database setup instructions
```

## Code Explanation

### Authentication Flow

1. **Signup/Login Pages** (`app/login/page.tsx`, `app/signup/page.tsx`)
   - Client components that handle form submission
   - Use Supabase client to authenticate users
   - Redirect to dashboard on success

2. **Authentication Helpers** (`lib/auth.ts`)
   - `getUser()`: Gets current authenticated user
   - `requireAuth()`: Ensures user is logged in (redirects if not)
   - `getUserProfile()`: Gets user's player profile from database

### Dashboard

The dashboard (`app/dashboard/page.tsx`) is a Server Component that:
- Fetches all online players from the database
- Displays match requests (incoming and outgoing)
- Only authenticated users can access (enforced by `requireAuth()`)

### Match Requests

When a player clicks "Request Match":
1. A record is created in the `match_requests` table
2. The recipient sees it in their "Incoming Match Requests" section
3. They can accept or reject it
4. If accepted, a match is created and both players are redirected to the live match page

### Live Matches

The live match page (`app/match/[id]/page.tsx`) uses:
- **Server Component**: Fetches initial match data and verifies user is a participant
- **Client Component** (`LiveMatchClient.tsx`): Subscribes to real-time updates
- Supabase Realtime listens for changes to the match record
- When status changes, the UI updates instantly for both players

### Security

- **Middleware** (`middleware.ts`): Protects routes at the edge
- **Row Level Security (RLS)**: Database-level security policies
- **Server-side checks**: Additional verification in Server Components

## Branding

- **Primary Color**: #1D4ED8 (Blue)
- **Secondary Color**: #22C55E (Lime Green)
- **Neutral**: #FFFFFF (White)
- **Dark**: #111827 (Dark Gray)
- **Heading Font**: Montserrat
- **Body Font**: Inter

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deployment

Ready to share your app with the world? Deploy to Vercel in minutes!

📚 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for a complete, step-by-step deployment guide.**

The deployment guide covers:
- Setting up a GitHub repository
- Connecting to Vercel
- Adding environment variables (Supabase credentials)
- Automatic deployments
- Troubleshooting

### Quick Deployment Overview

1. **Push code to GitHub** - Upload your code to GitHub ([GITHUB_SETUP.md](./GITHUB_SETUP.md))
2. **Connect to Vercel** - Import your GitHub repository to Vercel
3. **Add environment variables** - Add your Supabase credentials in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy!** - Vercel automatically builds and deploys your app

**Every push to GitHub = automatic deployment!** 🚀

**Deployment Checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a complete checklist.

## License

MIT

