import { Droplets } from "lucide-react"
import WeatherIcon from "@/components/weather-icon"
import { formatTime, unitLabels, type ForecastItem, type Unit } from "@/lib/weather"

interface HourlyForecastProps {
  forecast: ForecastItem[]
  unit: Unit
  offset: number
  sunrise: number
  sunset: number
}

/* smooth curve through the points (Catmull-Rom converted to cubic Béziers) */
function smoothPath(points: Array<[number, number]>) {
  if (points.length < 2) return ""
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`
  }
  return d
}

function nightAt(dt: number, sunrise: number, sunset: number) {
  const day = 86400
  const s = ((dt - sunrise) % day + day) % day
  return s > sunset - sunrise
}

export default function HourlyForecast({ forecast, unit, offset, sunrise, sunset }: HourlyForecastProps) {
  if (!forecast.length) return null
  const { temp: tempUnit } = unitLabels(unit)
  const temps = forecast.map((f) => f.main.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const span = Math.max(max - min, 1)
  const n = forecast.length
  const W = 100
  const H = 100
  const points: Array<[number, number]> = temps.map((t, i) => [((i + 0.5) / n) * W, 32 + (1 - (t - min) / span) * 56])
  const line = smoothPath(points)
  const area = `${line} L ${points[n - 1][0]} ${H} L ${points[0][0]} ${H} Z`

  return (
    <section className="panel flex min-w-0 flex-col p-5 md:p-6" aria-labelledby="hourly-title">
      <div className="flex items-baseline justify-between">
        <h2 id="hourly-title" className="font-display text-xl font-semibold">
          Next 24 hours
        </h2>
        <p className="text-xs text-white/75">3-hour steps</p>
      </div>

      <div className="relative -mx-2 mt-2 flex flex-1 flex-col justify-center overflow-x-auto px-2 pb-1">
        <div className="min-w-[560px]">
          <div className="relative h-28">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
              <defs>
                <linearGradient id="hourly-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#hourly-fill)" />
              <path d={line} fill="none" stroke="#fff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </svg>
            {points.map(([x, y], i) => (
              <div key={i} className="absolute -translate-x-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <span className="absolute left-1/2 top-0 block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-800" />
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-display text-lg font-semibold tabular-nums">
                  {Math.round(temps[i])}°
                </span>
              </div>
            ))}
          </div>

          <ol className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {forecast.map((item, i) => {
              const pop = Math.round((item.pop ?? 0) * 100)
              return (
                <li key={item.dt} className="flex flex-col items-center gap-1.5 text-center">
                  <WeatherIcon main={item.weather[0]?.main ?? "Clear"} night={nightAt(item.dt, sunrise, sunset)} className="size-6" />
                  <span className="text-sm font-semibold">{formatTime(item.dt, offset, false)}</span>
                  <span className={`flex items-center gap-0.5 text-xs ${pop >= 20 ? "text-sky-100" : "text-white/60"}`}>
                    <Droplets className="size-3" aria-hidden />
                    {pop}%
                  </span>
                  <span className="sr-only">
                    {Math.round(temps[i])}
                    {tempUnit}, {item.weather[0]?.description}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
