"use client"

import { Cloud, CloudRain, Sun, Droplets } from "lucide-react"
import { Card } from "@/components/ui/card"

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

interface HourlyForecastProps {
  forecast: ForecastItem[]
  unit: "metric" | "imperial"
}

const getWeatherIcon = (main: string) => {
  const mainUpper = main.toUpperCase()
  if (mainUpper.includes("RAIN") || mainUpper.includes("DRIZZLE")) {
    return <CloudRain className="w-8 h-8 text-blue-400" />
  }
  if (mainUpper.includes("CLOUD")) {
    return <Cloud className="w-8 h-8 text-gray-400" />
  }
  if (mainUpper.includes("CLEAR") || mainUpper.includes("SUNNY")) {
    return <Sun className="w-8 h-8 text-yellow-400" />
  }
  return <Sun className="w-8 h-8 text-yellow-400" />
}

export default function HourlyForecast({ forecast, unit }: HourlyForecastProps) {
  try {
    if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
      return <div className="text-muted-foreground">No hourly forecast available</div>
    }

    const tempUnit = unit === "metric" ? "°C" : "°F"

    return (
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max">
          {forecast.map((item, index) => {
            try {
              if (!item || !item.main || !item.weather) {
                return null
              }

              const date = new Date(item.dt * 1000)
              const time = date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              const temp = Math.round(item.main.temp)
              const condition = item.weather[0].main
              const humidity = item.main.humidity

              return (
                <Card
                  key={`hourly-${item.dt}-${index}`}
                  className="bg-white/95 dark:bg-slate-800/95 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-200 p-4 flex-shrink-0 min-w-40 text-center"
                >
                  <p className="text-sm font-semibold text-foreground mb-3">{time}</p>
                  <div className="flex justify-center mb-2">{getWeatherIcon(condition)}</div>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {temp}
                    {tempUnit}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize mb-2">{condition}</p>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                    <Droplets size={12} />
                    <span>{humidity}%</span>
                  </div>
                </Card>
              )
            } catch (error) {
              console.error("[v0] Error rendering hourly item:", error)
              return null
            }
          })}
        </div>
      </div>
    )
  } catch (error) {
    console.error("[v0] Error rendering HourlyForecast:", error)
    return <div className="text-red-500">Error displaying hourly forecast</div>
  }
}
