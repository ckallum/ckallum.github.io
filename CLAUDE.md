# CLAUDE.md - Agent Reference Guide

## Build and Test Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`
- Test (all): `npm test`
- Test (single): `npm test -- -t "test name"`
- Dev server: `npm run dev`

## Code Style Guidelines
- **Formatting**: Use Prettier with default config
- **Imports**: Group imports (React, libraries, internal components, styles)
- **Types**: Use TypeScript with strict mode; prefer interfaces for objects
- **Functions**: Use arrow functions; avoid anonymous functions
- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **Error Handling**: Use try/catch for async operations; log errors appropriately
- **Components**: Prefer functional components with hooks over class components
- **State Management**: Use React hooks (useState, useReducer) for local state
- **CSS**: Use CSS modules or styled-components; avoid inline styles

## Project Structure
This project appears to be a new repo for Opendoor State of AI 2025. As the project develops, document key directories and files here.