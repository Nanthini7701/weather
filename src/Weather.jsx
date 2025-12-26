import { useEffect, useState } from 'react'

// Use Vite env when available, fall back to global (useful for tests)
const getApiKey = () => (import.meta.env?.VITE_OPENWEATHERMAP_API_KEY || globalThis.__VITE_OPENWEATHERMAP_API_KEY || '7e50b8c95baa5cbb469ad405527d2acf')

export default function Weather() {
  const [city, setCity] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  // load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('weather:recent')
      if (stored) setHistory(JSON.parse(stored))
    } catch {
      setHistory([])
    }
  }, [])

  const saveHistory = (cityName) => {
    if (!cityName) return
    const normalized = cityName.trim()
    const updated = [normalized, ...history.filter(h => h.toLowerCase() !== normalized.toLowerCase())].slice(0,5)
    setHistory(updated)
    localStorage.setItem('weather:recent', JSON.stringify(updated))
  }

  const fetchWeather = async (cityName) => {
    const apiKey = getApiKey()
    setLoading(true)
    setError('')
    setData(null)

    if (!cityName || !cityName.trim()) {
      setError('Please enter a city name')
      setLoading(false)
      return
    }

    if (!apiKey) {
      setError('Missing API key. Set VITE_OPENWEATHERMAP_API_KEY')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}`
      )

      const json = await res.json()

      if (!res.ok) {
        setError(json?.message || 'City not found')
        return
      }

      setData({
        name: json.name,
        country: json.sys?.country,
        tempC: json.main?.temp ? +(json.main.temp - 273.15).toFixed(1) : null,
        humidity: json.main?.humidity,
        condition: json.weather?.[0]?.main || '',
        description: json.weather?.[0]?.description || '',
        icon: json.weather?.[0]?.icon || null,
      })

      saveHistory(cityName)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="weather-shell">
      <div className="weather-card">
        <h2 className="title">Weather Lookup</h2>

        <form className="search" onSubmit={(e) => { e.preventDefault(); fetchWeather(city) }}>
          <div className="input-wrap">
            <input
              aria-label="City name"
              placeholder="Enter city name (e.g., London)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="city-input"
            />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? (<><span className="dot" />Searching...</>) : 'Search'}
          </button>
        </form>

        <div className="history-row">
          {history.length === 0 ? (
            <div className="history-empty">No recent searches</div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <button key={item} className="history-item" onClick={() => fetchWeather(item)}>{item}</button>
              ))}
            </div>
          )}
        </div>

        {loading && <div className="loader"><div className="spinner" /><div className="loader-text">Fetching weather…</div></div>}

        {error && !loading && <div className="error">⚠️ {error}</div>}

        {data && !loading && (
          <div className="result" role="region" aria-label="Weather result">
            <div className="location">{data.name}, {data.country}</div>

            <div className="top-row">
              {data.icon && <img src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} alt={data.description} />}
              <div className="temp">{data.tempC}°C</div>
            </div>

            <div className="details">
              <div>Condition: <strong>{data.condition}</strong></div>
              <div>Humidity: <strong>{data.humidity}%</strong></div>
              <div className="desc">{data.description}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
