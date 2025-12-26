// App.jsx
// This project (react-app) has a Weather feature that meets the following requirements:
// 1) Fetch live weather data from OpenWeatherMap API (using env var VITE_OPENWEATHERMAP_API_KEY)
// 2) Input for entering city name
// 3) Display temperature, humidity, and weather condition
// 4) Handle invalid city names with friendly messages
// 5) Show a loader while fetching data

import './App.css'
import Weather from './Weather'

export default function App() {
  return (
    <div id="app-root">
      <header className="hero">
        <div>
          <h1 className="app-title">Weather App</h1>
          <p className="subtitle">Search live weather by city — powered by OpenWeatherMap</p>
        </div>
      </header>

      <main>
        <Weather />
      </main>

      <footer className="site-footer">
        <small>Built with ❤️ </small>
      </footer>
    </div>
  )
}
