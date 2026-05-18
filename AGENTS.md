# MyBandLab Frontend - Agent Notes

## Dev Commands
- `npm run dev` - Start dev server (port 5173)
- `npm run lint` - Run ESLint (zero warnings required)
- `npm run type-check` - Run TypeScript check
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run with coverage report

## Verification Order
Run these before committing: `lint` → `type-check` → `test:run`

## Backend Dependency
- Frontend proxies `/graphql`, `/api`, `/auth` to `http://localhost:9000`
- Backend must be running for full functionality
- `.env` config: `VITE_API_URL=/graphql`, `VITE_WS_URL=ws://localhost:9000/subscriptions`

## Architecture
- React 19 + TypeScript + Vite + TailwindCSS 4
- Apollo Client for GraphQL
- Path aliases: `@/` → `src/`, `@components/` → `src/components/`, etc.
- PWA enabled (VitePWA plugin with workbox)

## Key Patterns
- Components use `bg-gradient-to-br from-gray-800/50 to-gray-900/50` style
- UI components in `src/components/ui/`
- Hooks for data fetching in `src/hooks/`
- GraphQL queries/mutations in `src/graphql/`

## Style Conventions
- Use `gray-*` palette (not slate) for consistent dark theme
- Rounded corners: `rounded-xl` for cards, `rounded-lg` for inputs
- Accent color: `text-purple-400`, `bg-purple-500/20`
- Border: `border-gray-700` / `hover:border-purple-500/50`