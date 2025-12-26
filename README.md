# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Weather App feature (added)

This project includes a simple Weather lookup UI that meets the following requirements:

1. Fetch live weather data from OpenWeatherMap API (use `VITE_OPENWEATHERMAP_API_KEY` in `.env`).
2. Input field for entering city name.
3. Displays temperature (°C), humidity and weather condition (also an icon and description).
4. Handles invalid city names and displays friendly errors.
5. Shows a loader while fetching data.

How to use:

- Get an API key from https://openweathermap.org/api
- Create a `.env` file at the project root and add:

```
VITE_OPENWEATHERMAP_API_KEY=your_api_key_here
```

- Start the app:

```
npm install
npm run dev
```

Open the app and search a city (e.g., "London") to see live results.

Files of interest:

- `src/Weather.jsx` — main component implementing requirements
- `src/Weather.css` — styling, loader, history, and small animations
- `src/App.jsx` — integrates the Weather UI

Testing and extra features:

- Unit tests added: `src/Weather.test.jsx` (Vitest + Testing Library). Run `npm run test`.
- Recent search history is persisted (localStorage) and shown under the search bar.
- Icons and subtle animations added (uses `react-icons` and `framer-motion`).

Happy building! 🎯
