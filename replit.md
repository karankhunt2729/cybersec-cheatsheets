# CyberSec CheatSheets

## Overview

CyberSec CheatSheets is a full-stack web application designed for creating, managing, and organizing cybersecurity documentation and cheat sheets. The application provides a rich text editing interface with real-time saving, search functionality, and a clean, professional user interface optimized for technical documentation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Middleware**: Express middleware for JSON parsing, logging, and error handling
- **Development**: Hot reloading with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Storage**: Fallback MemStorage implementation for development/testing

## Key Components

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **CheatsheetPages Table**: Core content storage (id, title, content, lastModified, wordCount)
- **Validation**: Zod schemas for runtime type validation and API request/response validation

### API Endpoints
- `GET /api/pages` - Retrieve all cheat sheet pages
- `GET /api/pages/:id` - Retrieve a specific page by ID
- `POST /api/pages` - Create a new cheat sheet page
- `PATCH /api/pages/:id` - Update an existing page (partial updates)
- `DELETE /api/pages/:id` - Delete a page

### Frontend Components
- **Sidebar**: Navigation, search, and page management
- **RichTextEditor**: Markdown-style formatting with preview capability
- **PageList**: Paginated list with search and delete functionality
- **Modals**: Add page and delete confirmation dialogs

### Key Features
- **Real-time Auto-save**: Debounced saving (1-second delay) of title and content changes
- **Search Functionality**: Full-text search across page titles and content
- **Word Count Tracking**: Automatic word count calculation and display
- **Rich Text Editing**: Markdown-style formatting with toolbar controls
- **Responsive Design**: Mobile-friendly interface with proper breakpoints

## Data Flow

1. **Page Loading**: React Query fetches pages from `/api/pages` endpoint
2. **Content Editing**: User input triggers debounced updates via `PATCH /api/pages/:id`
3. **Search**: Client-side filtering of fetched pages based on search query
4. **Navigation**: Wouter handles client-side routing between home and editor views
5. **State Synchronization**: React Query automatically invalidates and refetches data after mutations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for Neon
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **date-fns**: Date formatting and manipulation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives (dialogs, dropdowns, tooltips, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles TypeScript server to `dist/index.js`
3. **Database Setup**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment flag (development/production)
- **REPL_ID**: Replit-specific environment detection

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon serverless recommended)
- Static file serving for frontend assets
- Environment variable support

### Development Workflow
- `npm run dev`: Start development server with hot reloading
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run db:push`: Apply database schema changes

## Changelog
- July 07, 2025. Initial setup
- July 07, 2025. Added PIN authentication with hardcoded PIN "909913" for single-user access
- July 07, 2025. Applied hacker-style color scheme (black/dark gray backgrounds, green text, monospace fonts) and welcome popup for "bitmonk"

## User Preferences

Preferred communication style: Simple, everyday language.
Authentication: Single-user access with PIN "909913" - no additional users or PIN changes allowed.
UI Theme: Hacker-style dark theme with green-on-black color scheme, monospace fonts, terminal aesthetic.
Welcome Message: Custom "bitmonk" greeting on login.