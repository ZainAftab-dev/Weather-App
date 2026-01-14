"use client"

import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Sunrise, Sunset } from "lucide-react"
import { Card } from "@/components/ui/card"

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

interface CurrentWeatherProps {
  data: WeatherData
  unit: "metric" | "imperial"
  lastUpdated: Date | null
}

const getWeatherIcon = (description: string, main: string) => {
  const mainUpper = main.toUpperCase()
  if (mainUpper.includes("RAIN") || mainUpper.includes("DRIZZLE")) {
    return <CloudRain className="w-16 h-16 text-blue-400" />
  }
  if (mainUpper.includes("CLOUD")) {
    return <Cloud className="w-16 h-16 text-gray-400" />
  }
  if (mainUpper.includes("CLEAR") || mainUpper.includes("SUNNY")) {
    return <Sun className="w-16 h-16 text-yellow-400" />
  }
  // Default to sun for unknown conditions
  return <Sun className="w-16 h-16 text-yellow-400" />
}

export default function CurrentWeather({ data, unit, lastUpdated }: CurrentWeatherProps) {
  try {
    if (!data || !data.main || !data.sys || !data.weather || !data.wind) {
      return <div className="text-red-500">Error: Invalid weather data</div>
    }

    const temp = Math.round(data.main.temp)
    const feelsLike = Math.round(data.main.feels_like)
    const condition = data.weather[0].main
    const description = data.weather[0].description
    const tempUnit = unit === "metric" ? "°C" : "°F"
    const speedUnit = unit === "metric" ? "m/s" : "mph"

    let sunrise = "N/A"
    let sunset = "N/A"

    try {
      sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (e) {
      console.error("[v0] Error formatting sunset/sunrise:", e)
    }

    const formattedTime = lastUpdated
      ? lastUpdated.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "Unknown"

    return (
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur border-0 shadow-2xl p-8 md:p-10">
        <div className="text-right text-xs text-muted-foreground mb-4">Last updated: {formattedTime}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: City and Temperature */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {data.name}, {data.sys.country}
            </h2>
            <div className="flex items-center gap-4 my-6">
              {getWeatherIcon(description, condition)}
              <div>
                <div className="text-6xl font-bold text-primary">
                  {temp}
                  {tempUnit}
                </div>
                <p className="text-lg text-muted-foreground capitalize">{description}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Feels like {feelsLike}
              {tempUnit}
            </p>
          </div>

          {/* Right: Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wind size={18} />
                <span className="text-sm font-semibold">Wind Speed</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {data.wind.speed} {speedUnit}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Droplets size={18} />
                <span className="text-sm font-semibold">Humidity</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{data.main.humidity}%</p>
            </div>

            <div className="bg-blue-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Eye size={18} />
                <span className="text-sm font-semibold">Visibility</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {unit === "metric"
                  ? (data.visibility / 1000).toFixed(1) + " km"
                  : (data.visibility / 1609).toFixed(1) + " mi"}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Gauge size={18} />
                <span className="text-sm font-semibold">Pressure</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{data.main.pressure} hPa</p>
            </div>

            <div className="bg-blue-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Sunrise size={18} />
                <span className="text-sm font-semibold">Sunrise</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{sunrise}</p>
            </div>

            <div className="bg-blue-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Sunset size={18} />
                <span className="text-sm font-semibold">Sunset</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{sunset}</p>
            </div>
          </div>
        </div>
      </Card>
    )
  } catch (error) {
    console.error("[v0] Error rendering CurrentWeather:", error)
    return <div className="text-red-500">Error displaying weather information</div>
  }
}
