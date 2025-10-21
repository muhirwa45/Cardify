````markdown name=README.md url=https://github.com/muhirwa45/Cardify/blob/4562750a0881660a072b819a3d747f23690ec3d5/README.md
# Cardify

View your app in AI Studio: https://ai.studio/apps/drive/1X7mj7Sj-no7myTjj9f47lbC8PikLVZGW

Cardify is an offline-first flashcard application scaffolded with Vite and React. The project includes an optional integration with Gemini through the @google/genai package for AI-powered features (see dependencies in package.json).

## Tech stack
- React 19
- Vite
- TypeScript
- @google/genai (Gemini client) — optional AI features

You can see the declared dependencies and scripts in package.json:
- main dependencies: react, react-dom, @google/genai
- dev dependencies: vite, typescript, @vitejs/plugin-react, @types/node

## Prerequisites
- Node.js (v18+ recommended)
- npm (or use a Node package manager of your choice)

## Quick start (run locally)

1. Clone the repository and change into the project directory.

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the project root and set your Gemini API key if you want to enable AI features:
```env
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```
If you don't intend to use the Gemini integration, you can omit this variable.

4. Start the development server:
```bash
npm run dev
```
Vite starts a dev server (by default at http://localhost:5173). Open that URL in your browser to view the app.

## Build & preview

- Build a production bundle:
```bash
npm run build
```

- Preview the production build locally:
```bash
npm run preview
```

## Notes & troubleshooting
- If the dev server runs on a different port, Vite will print the correct URL in the terminal.
- If AI features don't work, ensure `GEMINI_API_KEY` is set correctly in `.env.local` and restart the dev server.
- If you run into TypeScript or type errors, confirm you are using a supported Node and TypeScript version compatible with the devDependencies listed in package.json.

## Where to look next
- package.json — see scripts and dependencies.
- src/ — (application source) — open components and logic to understand how flashcards and any AI features are wired.

Enjoy using Cardify!
````


View your app in AI Studio: https://ai.studio/apps/drive/1X7mj7Sj-no7myTjj9f47lbC8PikLVZGW

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
