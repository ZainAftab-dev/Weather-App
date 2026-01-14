"use client"

import { useEffect, useState } from "react"
import CurrentWeather from "@/components/current-weather"
import SearchBar from "@/components/search-bar"
import ForecastCard from "@/components/forecast-card"
import LoadingSpinner from "@/components/loading-spinner"
import HourlyForecast from "@/components/hourly-forecast"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WeatherData {
  name: string
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
  }>
  wind: {
    speed: number
  }
  visibility: number
}

interface ForecastItem {
  dt: number
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
  }>
}

const API_KEY = "fb8de5c7d63da57183ef875cd7a1103e"

export default function Home() {
  const [city, setCity] = useState("New York")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [hourlyForecast, setHourlyForecast] = useState<ForecastItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [initialized, setInitialized] = useState(false)
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchWeather = async (searchCity: string, selectedUnit: "metric" | "imperial" = unit) => {
    setLoading(true)
    setError("")
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchCity)}&units=${selectedUnit}&appid=${API_KEY}`,
      )

      if (!weatherRes.ok) {
        throw new Error(weatherRes.status === 404 ? "City not found" : "Failed to fetch weather")
      }

      const weather: WeatherData = await weatherRes.json()

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(searchCity)}&units=${selectedUnit}&appid=${API_KEY}`,
      )

      if (!forecastRes.ok) {
        throw new Error("Failed to fetch forecast")
      }

      const forecastData = await forecastRes.json()

      setWeatherData(weather)
      setCity(weather.name)
      setLastUpdated(new Date())

      // Get hourly forecasts (next 24 hours)
      const hourly = forecastData.list.slice(0, 8)
      setHourlyForecast(hourly)

      // Get one forecast per day (every 8 items = 24 hours)
      const dailyForecasts = forecastData.list.filter((_: any, index: number) => index % 8 === 0)
      setForecast(dailyForecasts.slice(0, 5))

      console.log("[v0] Weather data fetched successfully for:", weather.name)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather"
      setError(errorMessage)
      console.error("[v0] Weather fetch error:", errorMessage)
      setWeatherData(null)
      setForecast([])
      setHourlyForecast([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchCity: string) => {
    const trimmed = searchCity.trim()
    if (trimmed) {
      console.log("[v0] Searching for city:", trimmed)
      fetchWeather(trimmed, unit)
    } else {
      setError("Please enter a city name")
    }
  }

  const handleGeolocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setLoading(true)
    setError("")

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log("[v0] Geolocation obtained:", latitude, longitude)

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${API_KEY}`,
          )

          if (!res.ok) {
            throw new Error("Failed to fetch weather for your location")
          }

          const data: WeatherData = await res.json()
          console.log("[v0] Location-based weather fetched:", data.name)
          await fetchWeather(data.name, unit)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather for your location"
          setError(errorMessage)
          console.error("[v0] Geolocation weather fetch error:", errorMessage)
          setLoading(false)
        }
      },
      (error) => {
        let errorMessage = "Unable to access your location"
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied"
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable"
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out"
        }
        console.error("[v0] Geolocation error:", errorMessage)
        setError(errorMessage)
        setLoading(false)
      },
    )
  }

  const handleUnitToggle = () => {
    const newUnit = unit === "metric" ? ("imperial" as const) : ("metric" as const)
    console.log("[v0] Toggling unit to:", newUnit)
    setUnit(newUnit)
    if (weatherData && city) {
      fetchWeather(city, newUnit)
    }
  }

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      console.log("[v0] Initializing weather app with city:", city)
      fetchWeather(city)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">Weather Forecast</h1>
            <p className="text-blue-100 text-lg drop-shadow">Real-time weather updates and forecasts</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGeolocation}
              className="bg-white/95 hover:bg-white text-blue-600 font-semibold rounded-lg flex items-center gap-2 shadow-lg"
            >
              <MapPin size={18} />
              <span className="hidden sm:inline">My Location</span>
            </Button>
            <Button
              onClick={handleUnitToggle}
              className="bg-white/95 hover:bg-white text-blue-600 font-semibold rounded-lg shadow-lg"
            >
              {unit === "metric" ? "°C" : "°F"}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-lg border border-red-300 dark:border-red-700 flex justify-between items-center">
            <span>{error}</span>
            <Button
              onClick={() => {
                if (city) fetchWeather(city, unit)
              }}
              className="text-sm bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Current Weather */}
        {!loading && weatherData && (
          <>
            <CurrentWeather data={weatherData} unit={unit} lastUpdated={lastUpdated} />

            {hourlyForecast.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg">Hourly Forecast</h2>
                <HourlyForecast forecast={hourlyForecast} unit={unit} />
              </div>
            )}

            {/* Forecast Section */}
            {forecast.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-lg">5-Day Forecast</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecast.map((item, index: number) => (
                    <ForecastCard key={`${item.dt}-${index}`} data={item} unit={unit} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !weatherData && !error && (
          <div className="text-center mt-12">
            <p className="text-white text-lg drop-shadow">Search for a city to get started</p>
          </div>
        )}
      </div>
    </main>
  )
}
