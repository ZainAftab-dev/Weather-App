import { Droplets } from "lucide-react"
import WeatherIcon from "@/components/weather-icon"
import { formatDay, unitLabels, type DailyForecast as Day, type Unit } from "@/lib/weather"

interface DailyForecastProps {
  days: Day[]
  unit: Unit
  offset: number
}

export default function DailyForecast({ days, unit, offset }: DailyForecastProps) {
  if (!days.length) return null
  const { temp: tempUnit } = unitLabels(unit)
  const low = Math.min(...days.map((d) => d.min))
  const high = Math.max(...days.map((d) => d.max))
  const span = Math.max(high - low, 1)

  return (
    <section className="panel min-w-0 p-5 md:p-6" aria-labelledby="daily-title">
      <h2 id="daily-title" className="font-display text-xl font-semibold">
        5-day outlook
      </h2>
      <ul className="relative mt-2 divide-y divide-white/15">
        {days.map((d, i) => {
          const left = ((d.min - low) / span) * 100
          const width = Math.max(((d.max - d.min) / span) * 100, 6)
          const pop = Math.round(d.pop * 100)
          return (
            <li key={d.key} className="grid grid-cols-[3.25rem_2rem_1fr] items-center gap-3 py-3 sm:grid-cols-[4.5rem_2rem_2.75rem_1fr]">
              <span className="font-semibold">{i === 0 ? "Today" : formatDay(d.dt, offset)}</span>
              <WeatherIcon main={d.main} className="size-6" />
              <span className={`hidden items-center gap-0.5 text-xs sm:flex ${pop >= 20 ? "text-sky-100" : "text-white/55"}`}>
                <Droplets className="size-3" aria-hidden />
                {pop}%
              </span>
              <div className="flex items-center gap-3">
                <span className="w-9 text-right tabular-nums text-white/75">{Math.round(d.min)}°</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-white/15" aria-hidden>
                  <div
                    className="absolute inset-y-0 rounded-full bg-gradient-to-r from-sky-200 via-amber-100 to-amber-300"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </div>
                <span className="w-9 font-semibold tabular-nums">{Math.round(d.max)}°</span>
              </div>
              <span className="sr-only">
                {d.description}, low {Math.round(d.min)}
                {tempUnit}, high {Math.round(d.max)}
                {tempUnit}, {pop}% chance of rain
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
