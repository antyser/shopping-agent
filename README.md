# AI Shopping Assistant - Chrome Extension

This Chrome extension provides AI-powered insights and chat capabilities while browsing shopping websites (currently focused on Amazon).

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Firebase CLI](https://firebase.google.com/docs/cli#setup_update_cli) (for deploying mock API functions)

## Building the Extension

To build the extension for development or production:

```bash
npm run build
# or
yarn build
```

This command will compile the source code (from `src/`) and place the bundled extension files into the `dist/` directory.

## Loading the Extension in Chrome

1.  Open Google Chrome.
2.  Navigate to `chrome://extensions/`.
3.  Enable "Developer mode" using the toggle switch in the top-right corner.
4.  Click the "Load unpacked" button.
5.  Select the `dist` directory from your project folder.
6.  The AI Shopping Assistant extension should now appear in your list of extensions and be active.



After the build completes, you may need to manually reload the extension in `chrome://extensions/` by clicking the refresh icon on the extension's card.

## Project Structure

```
shopping-agent/
├── dist/                 # Built extension files (output)
├── functions/            # Firebase Cloud Functions (if using, add manually)
├── src/                  # Source code for the Chrome Extension
│   ├── manifest.json     # (Expected location)
│   ├── background/       # (Expected location)
│   ├── content/          # (Expected location)
│   ├── popup/            # (Expected location)
│   └── ...               # Other source files/folders
├── .env                  # Firebase config (Needs to be created manually)
├── .gitignore
├── eslint.config.js      # ESLint configuration
├── package.json          # Project dependencies & scripts
├── package-lock.json     # NPM lock file
├── postcss.config.js     # PostCSS configuration
├── README.md             # This file
├── tsconfig.json         # TypeScript configuration
├── webpack.config.js     # Webpack configuration
└── yarn.lock             # Yarn lock file
```

