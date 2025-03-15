# CLAUDE.md - Agent Reference Guide

## Website Structure
This is a personal website with a simple, modern structure:

```
/
├── index.html           # Main landing page
├── assets/              # All static assets
│   ├── css/             # Stylesheets
│   ├── js/              # Compiled JavaScript files
│   └── fonts/           # Web fonts
├── src/                 # TypeScript source files
└── articles/            # All articles
    └── [article-name]/  # Individual article folders
```

## Build and Development Commands
- Build TypeScript: `npm run build`
- Watch for changes: `npm run watch`
- Lint TypeScript: `npm run lint`
- Fix linting issues: `npm run lint:fix`

## Dark Mode Implementation
The website implements dark mode using CSS variables and localStorage for persistence. The toggle is present in both the home page and article pages.

## Code Style Guidelines
- **Formatting**: Use consistent indentation (2 spaces)
- **Naming**: Use clear, descriptive names for files and variables
- **CSS**: Use CSS variables for theming and consistent colors
- **TypeScript**: 
  - Use type annotations for all functions and variables
  - Keep scripts modular and focused on specific functionality
  - Follow ESLint rules for consistent code style

## Project Goals
This website aims to:
1. Showcase personal projects and articles
2. Maintain a clean, minimalist aesthetic
3. Provide excellent reading experience with dark mode and responsive design
4. Use TypeScript for improved code quality and maintainability