# CyberSec CheatSheets

A cybersecurity cheatsheet management application with hacker-style UI and PIN authentication.

## Features

- 🔐 PIN Authentication (default: 909913)
- 📝 Rich text editor with markdown support
- 🔍 Search functionality
- 💾 Auto-save capability
- 🎨 Hacker-style dark theme (green-on-black)
- 👤 Personalized "bitmonk" welcome
- 📱 Responsive design

## Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. **Clone or download this project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser to:** `http://localhost:5000`

5. **Login with PIN:** `909913`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Authentication

- **Default PIN:** `909913`
- **Username:** bitmonk (displayed on welcome)
- No user registration - single user application

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js
- **Storage:** In-memory (data resets on server restart)
- **Build:** Vite

## File Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared TypeScript schemas
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## Deployment Options

### Free Hosting Services
- **Vercel** (recommended for frontend)
- **Netlify** 
- **Railway**
- **Render**
- **Heroku** (with limitations)

### Self-Hosting
- Any VPS with Node.js support
- Docker containers
- Local development server

## Environment Variables

No environment variables required for basic setup. The app uses in-memory storage by default.

## Customization

### Change PIN
Edit `client/src/components/auth-guard.tsx`:
```typescript
const CORRECT_PIN = "YOUR_NEW_PIN";
```

### Change Username
Edit the welcome message in `auth-guard.tsx`:
```typescript
Welcome Back, YOUR_USERNAME
```

### Modify Colors
Edit `client/src/index.css` to change the color scheme.

## License

Free to use for personal and educational purposes.