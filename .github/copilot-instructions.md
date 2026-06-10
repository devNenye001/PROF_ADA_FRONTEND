<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Prof. Ada Workspace Guidelines

### Project Overview

Prof. Ada is a premium AI academic supervisor platform built with React, TypeScript, and modern design principles. It provides Computer Science students with an AI-powered guidance system for research projects.

### Design Principles

- **Premium aesthetics**: Apple-level cleanliness, Linear/Arc Browser quality
- **Dark mode first**: Deep black (#030303) and navy (#0B0C10) backgrounds
- **Glassmorphism**: All major panels use frosted glass styling with blur(20px)
- **Subtle animations**: 200ms transitions, no excessive motion
- **Performance-focused**: Minimal re-renders, optimized animations

### Technology Stack

- React 18 with TypeScript
- Vite for fast builds
- Tailwind CSS for styling
- Framer Motion for animations
- WaveSurfer.js for audio visualization

### Code Style

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript strictly (no `any` types)
- Follow naming conventions: PascalCase for components, camelCase for functions
- Add JSDoc comments for complex functions

### Component Guidelines

1. All UI panels should use `GlassmorphicPanel` component
2. Use `motion` from framer-motion for animations (200ms duration)
3. Import icons from `lucide-react`
4. Define prop types in interfaces
5. Use Tailwind CSS classes, avoid inline styles

### Styling Approach

- Use Tailwind's dark mode (already configured)
- Reference custom colors from tailwind.config.js
- Use glass-panel class for glassmorphic styling
- Leverage custom animations defined in config

### File Organization

- Components in `src/components/`
- Pages in `src/pages/`
- Types in `src/types/`
- Utilities in `src/utils/`
- Styles in `src/styles/`

### API Integration

- Mock responses are currently in `src/utils/ai.ts`
- Replace with actual API calls to backend
- Use async/await for API calls
- Add proper error handling

### Best Practices

1. Keep component props minimal and typed
2. Use composition over prop drilling
3. Memoize expensive computations
4. Optimize images and assets
5. Test responsive behavior across devices

### Development Workflow

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start dev server
3. Run `npm run build` to create production build
4. Run `npm run lint` for ESLint checks

### Common Tasks

- Adding new components: Create in `src/components/`, export in components directory
- Adding new pages: Create in `src/pages/`
- Adding types: Add to `src/types/index.ts` or create new file
- Styling: Use Tailwind classes, extend config as needed
