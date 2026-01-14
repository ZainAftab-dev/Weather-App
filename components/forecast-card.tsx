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

interface ForecastCardProps {
  data: ForecastItem
  unit: "metric" | "imperial"
}

const getWeatherIcon = (main: string) => {
  const mainUpper = main.toUpperCase()
  if (mainUpper.includes("RAIN") || mainUpper.includes("DRIZZLE")) {
    return <CloudRain className="w-10 h-10 text-blue-400" />
  }
  if (mainUpper.includes("CLOUD")) {
    return <Cloud className="w-10 h-10 text-gray-400" />
  }
  if (mainUpper.includes("CLEAR") || mainUpper.includes("SUNNY")) {
    return <Sun className="w-10 h-10 text-yellow-400" />
  }
  return <Sun className="w-10 h-10 text-yellow-400" />
}

export default function ForecastCard({ data, unit }: ForecastCardProps) {
  try {
    if (!data || !data.main || !data.weather) {
      return <Card className="p-6 text-red-500">Invalid data</Card>
    }

    const date = new Date(data.dt * 1000)
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
    const temp = Math.round(data.main.temp)
    const condition = data.weather[0].main
    const humidity = data.main.humidity
    const tempUnit = unit === "metric" ? "°C" : "°F"

    return (
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-200 p-6 text-center">
        <h3 className="font-semibold text-lg text-foreground mb-4">{dayName}</h3>

        <div className="flex justify-center mb-4">{getWeatherIcon(condition)}</div>

        <p className="text-3xl font-bold text-primary mb-2">
          {temp}
          {tempUnit}
        </p>

        <p className="text-sm text-muted-foreground capitalize mb-4">{data.weather[0].description}</p>

        <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
          <Droplets size={14} />
          <span>{humidity}%</span>
        </div>
      </Card>
    )
  } catch (error) {
    console.error("[v0] Error rendering ForecastCard:", error)
    return <Card className="p-6 text-red-500">Error displaying forecast</Card>
  }
}
