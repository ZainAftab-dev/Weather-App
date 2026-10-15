"use client"

import { useCallback, useEffect, useState } from "react"
import { CloudOff, LocateFixed, RotateCw } from "lucide-react"
import CurrentWeather from "@/components/current-weather"
import WeatherDetails from "@/components/weather-details"
import HourlyForecast from "@/components/hourly-forecast"
import DailyForecast from "@/components/daily-forecast"
import SearchBar from "@/components/search-bar"
import LoadingSpinner from "@/components/loading-spinner"
import { getWeather, groupDaily, isNight, skyFor, type ForecastItem, type Unit, type WeatherData } from "@/lib/weather"

const RECENT_KEY = "weather-recent-cities"

type Source = { kind: "city"; name: string } | { kind: "coords"; lat: number; lon: number }

export default function Home() {
  const [source, setSource] = useState<Source>({ kind: "city", name: "New York" })
  const [unit, setUnit] = useState<Unit>("metric")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [list, setList] = useState<ForecastItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]")
      if (Array.isArray(saved)) setRecent(saved.filter((x) => typeof x === "string").slice(0, 5))
    } catch {}
  }, [])

  const remember = useCallback((name: string) => {
    setRecent((prev) => {
      const next = [name, ...prev.filter((c) => c.toLowerCase() !== name.toLowerCase())].slice(0, 5)
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const load = useCallback(
    async (src: Source, u: Unit) => {
      setLoading(true)
      setError("")
      try {
        const query = src.kind === "city" ? `q=${encodeURIComponent(src.name)}` : `lat=${src.lat}&lon=${src.lon}`
        const data = await getWeather(query, u)
        setWeather(data.weather)
        setList(data.list)
        setLastUpdated(new Date())
        remember(data.weather.name)
      } catch (err) {
        setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Couldn't reach the weather service")
      } finally {
        setLoading(false)
      }
    },
    [remember],
  )

  useEffect(() => {
    load(source, unit)
  }, [source, unit, load])

  const search = (city: string) => {
    const name = city.trim()
    if (!name) return
    setSource({ kind: "city", name })
  }

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setError("Your browser can't share its location")
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => setSource({ kind: "coords", lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        setLoading(false)
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied"
            : err.code === err.TIMEOUT
              ? "Finding your location took too long"
              : "Your location isn't available right now",
        )
      },
      { timeout: 10000 },
    )
  }

  const sky = weather ? skyFor(weather.weather[0]?.main ?? "Clear") : "clear"
  const night = weather ? isNight(weather) : false
  const daily = weather ? groupDaily(list, weather.timezone) : []

  return (
    <main className="sky min-h-dvh" data-sky={sky} data-night={night}>
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-6 md:px-8 md:pt-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-2xl font-semibold tracking-tight text-shadow">
            Weather<span className="text-white/70">cast</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={locate}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 text-sm font-semibold backdrop-blur transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <LocateFixed className="size-4" aria-hidden />
              <span className="hidden sm:inline">My location</span>
              <span className="sr-only sm:hidden">Use my location</span>
            </button>
            <div role="group" aria-label="Temperature unit" className="flex h-10 rounded-full border border-white/25 bg-white/10 p-1 backdrop-blur">
              {(["metric", "imperial"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={unit === u}
                  onClick={() => setUnit(u)}
                  className="min-w-11 rounded-full px-3 text-sm font-bold text-white/80 transition aria-pressed:bg-white aria-pressed:text-slate-900 focus-visible:outline-2 focus-visible:outline-white"
                >
                  {u === "metric" ? "°C" : "°F"}
                </button>
              ))}
            </div>
          </div>
        </header>

        <SearchBar onSearch={search} recent={recent} />

        {error && (
          <div role="alert" className="panel mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CloudOff className="mt-0.5 size-6 shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="text-sm text-white/80">
                  {error === "City not found" ? "Check the spelling, or add the country: “Paris, FR”." : "Check your connection and try again."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => load(source, unit)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-slate-900 transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <RotateCw className="size-4" aria-hidden />
              Try again
            </button>
          </div>
        )}

        {loading && !weather && <LoadingSpinner />}

        {weather && (
          <div className={`grid grid-cols-[minmax(0,1fr)] gap-5 transition-opacity ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <CurrentWeather data={weather} unit={unit} today={daily[0]} lastUpdated={lastUpdated} night={night} />
              <WeatherDetails data={weather} unit={unit} />
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <HourlyForecast forecast={list.slice(0, 8)} unit={unit} offset={weather.timezone} sunrise={weather.sys.sunrise} sunset={weather.sys.sunset} />
              <DailyForecast days={daily} unit={unit} offset={weather.timezone} />
            </div>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-white/75">
          Data from{" "}
          <a href="https://openweathermap.org" className="underline underline-offset-2 hover:text-white">
            OpenWeatherMap
          </a>
          . Times are shown in the city&apos;s local time.
        </footer>
      </div>
    </main>
  )
}
