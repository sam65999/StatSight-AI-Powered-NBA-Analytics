<h1 align="center">StatSight - AI Sports Prediction Platform</h1>

<p align="center">
 AI-powered sports analytics and prediction platform built with Next.js 14 and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
</p>
<br/>

🔴🔴NOT STABLE RIGHT NOW WILL BE FIXING SOON🔴🔴

## Features

### 🏀 Core Features
- **AI-Powered Predictions** - Get AI-driven predictions for player props and game outcomes
- **Player Statistics** - Comprehensive player stats and performance analysis
- **Player Comparison** - Side-by-side comparison of player statistics
- **Upcoming Games** - Real-time upcoming game schedules
- **Query History** - Track all your past predictions and analyses
- **User Settings** - Manage account, change password, update username

### 🎨 Design & UX
- Modern dark theme with glass-morphism effects
- Smooth animations with Framer Motion
- Fully responsive design (mobile, tablet, desktop)
- Accessible UI components
- Cookie consent banner
- AI caution disclaimers

### 🔐 Authentication & Security
- Supabase authentication with email/password
- Username system with uniqueness validation
- Row Level Security (RLS) policies
- Secure API routes with service role key
- Password verification for sensitive operations

### 💻 Technical Features
- Next.js 14 App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Supabase for backend and database
- Server-side rendering (SSR)
- API routes for backend logic

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui, Lucide Icons
- **Animations:** Framer Motion
- **Backend:** Supabase (Auth, Database, RLS)
- **Deployment:** Vercel


## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── check-username/
│   │   ├── update-email/
│   │   ├── update-password/
│   │   └── ...
│   ├── dashboard/           # Dashboard pages
│   │   ├── ai-prediction/
│   │   ├── player-stats/
│   │   ├── player-comparison/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── login/               # Auth pages
│   ├── page.tsx             # Landing page
│   └── layout.tsx           # Root layout
├── components/
│   ├── landing/             # Landing page components
│   └── ui/                  # Reusable UI components
├── lib/
│   └── supabaseClient.ts    # Supabase client config
└── types/                   # TypeScript types
```

## Key Features Implementation

### Authentication
- Email/password authentication via Supabase
- Username system with validation
- Secure session management with cookies
- Password change with verification

### User Settings
- Change email (with password verification)
- Change password (with old password verification)
- Update username (with uniqueness check)
- Delete account (with confirmation)

### AI Features
- Player prop predictions
- Game outcome predictions
- Player statistics analysis
- Player comparison tool

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

- GitHub: [@sam65999](https://github.com/sam65999)
- Email: samuelr.aidev@gmail.com

Once again this is just a project to learn more about intergrating AI into websites, i built this in 20 hours and the demo url can be found at: https://statsightai.vercel.app/ if you want to contact me my contact is above. Thanks for viewing.
