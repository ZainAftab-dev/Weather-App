export type Unit = "metric" | "imperial"

export interface WeatherData {
  name: string
  timezone: number
  sys: { country: string; sunrise: number; sunset: number }
  main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min: number; temp_max: number }
  weather: Array<{ main: string; description: string; icon?: string }>
  wind: { speed: number; deg?: number }
  visibility: number
  dt: number
}

export interface ForecastItem {
  dt: number
  main: { temp: number; humidity: number; temp_min?: number; temp_max?: number }
  weather: Array<{ main: string; description: string; icon?: string }>
  pop?: number
}

export interface DailyForecast {
  key: string
  dt: number
  min: number
  max: number
  main: string
  description: string
  humidity: number
  pop: number
}

export const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "fb8de5c7d63da57183ef875cd7a1103e"
const BASE = "https://api.openweathermap.org/data/2.5"

export async function getWeather(query: string, unit: Unit) {
  const weatherRes = await fetch(`${BASE}/weather?${query}&units=${unit}&appid=${API_KEY}`)
  if (!weatherRes.ok) {
    throw new Error(weatherRes.status === 404 ? "City not found" : "Couldn't load the weather")
  }
  const weather: WeatherData = await weatherRes.json()

  const forecastRes = await fetch(`${BASE}/forecast?${query}&units=${unit}&appid=${API_KEY}`)
  if (!forecastRes.ok) throw new Error("Couldn't load the forecast")
  const forecast: { list: ForecastItem[] } = await forecastRes.json()

  return { weather, list: forecast.list ?? [] }
}

/* ---------- time helpers (city-local, using the API's UTC offset) ---------- */

export function cityDate(unixSeconds: number, offsetSeconds: number) {
  return new Date((unixSeconds + offsetSeconds) * 1000)
}

export function formatTime(unixSeconds: number, offsetSeconds: number, withMinutes = true) {
  const d = cityDate(unixSeconds, offsetSeconds)
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: withMinutes ? "2-digit" : undefined,
    hour12: true,
    timeZone: "UTC",
  })
}

export function formatDay(unixSeconds: number, offsetSeconds: number, style: "short" | "long" = "short") {
  return cityDate(unixSeconds, offsetSeconds).toLocaleDateString("en-US", { weekday: style, timeZone: "UTC" })
}

export function formatLongDate(unixSeconds: number, offsetSeconds: number) {
  return cityDate(unixSeconds, offsetSeconds).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

/* ---------- forecast grouping ---------- */

export function groupDaily(list: ForecastItem[], offsetSeconds: number): DailyForecast[] {
  const days = new Map<string, ForecastItem[]>()
  for (const item of list) {
    const key = cityDate(item.dt, offsetSeconds).toISOString().slice(0, 10)
    if (!days.has(key)) days.set(key, [])
    days.get(key)!.push(item)
  }

  return [...days.entries()].slice(0, 5).map(([key, items]) => {
    const temps = items.flatMap((i) => [i.main.temp_min ?? i.main.temp, i.main.temp_max ?? i.main.temp])
    // the condition closest to midday represents the day
    const midday = items.reduce((best, i) => {
      const h = cityDate(i.dt, offsetSeconds).getUTCHours()
      const bh = cityDate(best.dt, offsetSeconds).getUTCHours()
      return Math.abs(h - 13) < Math.abs(bh - 13) ? i : best
    }, items[0])
    return {
      key,
      dt: midday.dt,
      min: Math.min(...temps),
      max: Math.max(...temps),
      main: midday.weather[0]?.main ?? "Clear",
      description: midday.weather[0]?.description ?? "",
      humidity: Math.round(items.reduce((s, i) => s + i.main.humidity, 0) / items.length),
      pop: Math.max(...items.map((i) => i.pop ?? 0)),
    }
  })
}

/* ---------- conditions ---------- */

export type Sky = "clear" | "clouds" | "rain" | "storm" | "snow" | "mist"

export function skyFor(main: string): Sky {
  const m = main.toLowerCase()
  if (m.includes("thunder")) return "storm"
  if (m.includes("rain") || m.includes("drizzle")) return "rain"
  if (m.includes("snow")) return "snow"
  if (m.includes("cloud")) return "clouds"
  if (m === "clear") return "clear"
  return "mist"
}

export function isNight(w: WeatherData) {
  return w.dt < w.sys.sunrise || w.dt > w.sys.sunset
}

export function compass(deg?: number) {
  if (deg === undefined) return ""
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(deg / 45) % 8]
}

export const unitLabels = (unit: Unit) => ({
  temp: unit === "metric" ? "°C" : "°F",
  speed: unit === "metric" ? "m/s" : "mph",
})
