# Callum Ke's Personal Website

This repository hosts my personal website published at [ckallum.github.io](https://ckallum.github.io).

## Repository Structure

The website follows a modern, simplified file structure with TypeScript:

```
/
├── index.html             # Main landing page
├── assets/                # All static assets
│   ├── css/               # Stylesheets
│   │   ├── home.css       # Styles for the landing page
│   │   └── article.css    # Styles for article pages
│   ├── js/                # Compiled JavaScript files
│   │   ├── darkmode.js    # Dark mode functionality (compiled from TS)
│   │   ├── toc.js         # Table of contents functionality (compiled from TS)
│   │   └── footnotes.js   # Footnote functionality (compiled from TS)
│   └── fonts/             # Web fonts
│       ├── Newsreader.woff2
│       └── Newsreader-italic.woff2
├── src/                   # TypeScript source files
│   ├── darkmode.ts        # Dark mode functionality source
│   ├── toc.ts             # Table of contents functionality source
│   └── footnotes.ts       # Footnote functionality source
└── articles/              # All articles
    └── the-investment-state-of-ai-2025/
        └── index.html     # Article content
```

## GitHub Pages Setup

This repository is configured to deploy as a GitHub Pages site. The main branch is published at the root of the GitHub Pages URL.

## Features

- Responsive design for all device sizes
- Dark mode support with preference memory
- Clean, minimal design
- Table of contents for articles
- TypeScript for improved code quality and maintainability

## Local Development

To run the site locally:

1. Clone the repository
2. Navigate to the repository directory
3. Install dependencies: `npm install`
4. Build TypeScript files: `npm run build`
5. For development with auto-recompile: `npm run watch`
6. Open `index.html` in your browser

## Technologies Used

- HTML5
- CSS3
- TypeScript
- GitHub Pages for hosting
- ESLint for code quality

## License

All rights reserved.