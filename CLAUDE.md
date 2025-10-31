# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HKP WebFilter is a web-based domain filtering management system frontend built with React, Vite, and Tailwind CSS. The application allows administrators to manage domain whitelist/blacklist rules with scheduling capabilities. The frontend communicates with a backend API at `http://192.168.121.135:8000`.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on default Vite port, typically 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Architecture Overview

### Application Structure

The application uses React Router with three main routes:
- `/` - Dashboard (DomainManager) - TEMPORARY: currently defaults to dashboard for development
- `/login` - Login page
- `/dashboard` - Domain management interface

### Key Components Hierarchy

```
App (BrowserRouter)
├── LoginForm - Authentication page
└── DomainManager - Main dashboard
    ├── ModeSwitch - Toggle between whitelist/blacklist modes
    └── DisplayView - Conditional renderer
        ├── WhiteListView - Whitelist management UI
        └── BlackListView - Blacklist management UI
```

### State Management

The app uses React local state (useState) throughout - there is no global state management library (Redux, Zustand, etc.). Key state is managed at the DomainManager level:
- `mode` - Current filter mode ('whitelist' or 'blacklist')
- `domains` - Domain records array
- Authentication token stored in `localStorage`

### API Integration Pattern

Both LoginForm and DomainManager implement a `makeRequest` helper function for API calls. The pattern:
1. Retrieve token from localStorage
2. Set Authorization header if token exists
3. Make fetch request to `API_BASE_URL/endpoint`
4. Handle response with code/msg/data structure
5. Update local state based on response

API endpoints used:
- `POST /login` - User authentication
- `GET /display` - Fetch domain list
- `POST /add` - Add new domain
- `DELETE /delete` - Remove domain
- `POST /mode` - Save filter mode (whitelist/blacklist)

### Component Communication

- WhiteListView and BlackListView are self-contained with mock data for demonstration
- Real data integration happens at DomainManager level via API calls
- DisplayView acts as a simple conditional renderer based on mode prop

### Styling System

The project uses Tailwind CSS with custom animations defined in `src/index.css`:
- `animate-fadeIn` - Fade in effect (0.6s)
- `animate-slideUp` - Slide up from bottom (0.6s)
- `animate-shake` - Shake effect for errors (0.5s)
- `animate-pulse-slow` - Slow pulsing (2s infinite)
- `animate-slideInRight` - Toast notifications slide in
- `animate-scaleIn` - Scale in animation

Color scheme follows mode-based theming:
- Whitelist mode: Green/Emerald gradients
- Blacklist mode: Red/Rose gradients
- Shared UI: Blue/Indigo gradients

## Important Development Notes

### Authentication

- Token-based authentication using JWT stored in localStorage
- Token included as `Bearer ${token}` in Authorization header
- Currently the app has TEMPORARY development routes that skip auth (default route is dashboard)

### Data Structures

Domain records contain:
- `id` - Unique identifier
- `url`/`domain` - The domain string
- `isScheduled` - Boolean for scheduled filtering
- `scheduleTimeSlots` - Array of time slot objects with `start`, `end`, `weekdays`
- `isEnabled` - Boolean to enable/disable individual rules

Weekday representation: 0 (Sunday) through 6 (Saturday), with 1-5 being Monday-Friday

### Mock Data

WhiteListView and BlackListView currently use hardcoded mock data (`mockWhiteListData`, `mockBlackListData`). When integrating with real API:
1. Remove mock data constants
2. Connect to API calls from DomainManager or implement new API calls
3. Ensure data structure matches API response format

### Common Component Patterns

Both WhiteListView and BlackListView share identical structure:
- Search functionality with filtered display
- Expandable create form with URL input and scheduling options
- TimeSlotPicker integration for scheduled rules
- Table display with enable/disable, edit, and delete actions
- Color-coded UI based on list type (green for whitelist, red for blacklist)

### Backend API Contract

The backend expects/returns JSON with structure:
```json
{
  "code": 200,
  "msg": "success message",
  "data": { ... }
}
```

## Known Development Patterns

- All buttons use `type="button"` to prevent form submission unless explicitly submit buttons
- Conditional CSS classes use template literals with mode-based theming
- Loading states tracked with boolean flags (`loading`, `isSaving`)
- Error handling displays user-friendly messages from API `msg` field
- Icons from `lucide-react` library used throughout

## UI/UX Conventions

- Responsive design using Tailwind breakpoints (sm, md, lg)
- Gradient backgrounds and glassmorphism effects (backdrop-blur)
- Smooth transitions (duration-200, duration-300)
- Transform effects on interactive elements (hover:scale, active:scale)
- Toast notifications for success/error feedback
- Modal confirmations for destructive actions (logout, delete)
