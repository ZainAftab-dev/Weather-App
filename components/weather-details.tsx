import type React from "react"
import { Droplets, Eye, Gauge, Navigation, Sunrise, Sunset, Wind } from "lucide-react"
import { compass, formatTime, unitLabels, type Unit, type WeatherData } from "@/lib/weather"

function Tile({ icon, label, children, className = "" }: { icon: React.ReactNode; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`panel flex flex-col justify-between gap-3 p-4 ${className}`}>
      <p className="label flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      {children}
    </div>
  )
}

function SunArc({ sunrise, sunset, now }: { sunrise: number; sunset: number; now: number }) {
  const t = Math.min(1, Math.max(0, (now - sunrise) / (sunset - sunrise)))
  const up = now >= sunrise && now <= sunset
  // quadratic arc from (10,70) through peak (110,6) to (210,70)
  const x = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 110 + t * t * 210
  const y = (1 - t) * (1 - t) * 70 + 2 * (1 - t) * t * -58 + t * t * 70
  return (
    <svg viewBox="0 0 220 80" className="h-20 w-full" aria-hidden>
      <path d="M10 70 Q110 -58 210 70" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="3 5" />
      <line x1="0" y1="70" x2="220" y2="70" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      {up && (
        <>
          <circle cx={x} cy={y} r="12" fill="rgba(255,214,120,0.35)" />
          <circle cx={x} cy={y} r="6.5" fill="#ffd27a" />
        </>
      )}
    </svg>
  )
}

export default function WeatherDetails({ data, unit }: { data: WeatherData; unit: Unit }) {
  const { speed } = unitLabels(unit)
  const now = Math.floor(Date.now() / 1000)
  const daylight = data.sys.sunset - data.sys.sunrise
  const hours = Math.floor(daylight / 3600)
  const minutes = Math.round((daylight % 3600) / 60)
  const visibility = unit === "metric" ? `${(data.visibility / 1000).toFixed(1)} km` : `${(data.visibility / 1609).toFixed(1)} mi`
  const pressureHint = data.main.pressure < 1005 ? "Low, unsettled" : data.main.pressure > 1020 ? "High, settled" : "Normal"

  return (
    <section aria-label="Details" className="grid grid-cols-2 gap-3 sm:gap-4">
      <Tile icon={<Wind className="size-4" aria-hidden />} label="Wind">
        <div className="flex items-end justify-between gap-2">
          <p className="font-display text-3xl font-medium tabular-nums">
            {Math.round(data.wind.speed * 10) / 10}
            <span className="ml-1 font-sans text-sm font-semibold text-white/80">{speed}</span>
          </p>
          {data.wind.deg !== undefined && (
            <span className="flex flex-col items-center text-xs font-bold text-white/85">
              <Navigation
                className="size-6"
                style={{ transform: `rotate(${data.wind.deg + 180}deg)` }}
                aria-label={`From the ${compass(data.wind.deg)}`}
              />
              {compass(data.wind.deg)}
            </span>
          )}
        </div>
      </Tile>

      <Tile icon={<Droplets className="size-4" aria-hidden />} label="Humidity">
        <div>
          <p className="font-display text-3xl font-medium tabular-nums">{data.main.humidity}%</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20" aria-hidden>
            <div className="h-full rounded-full bg-white/85" style={{ width: `${data.main.humidity}%` }} />
          </div>
        </div>
      </Tile>

      <Tile icon={<Eye className="size-4" aria-hidden />} label="Visibility">
        <p className="font-display text-3xl font-medium tabular-nums">{visibility}</p>
      </Tile>

      <Tile icon={<Gauge className="size-4" aria-hidden />} label="Pressure">
        <div>
          <p className="font-display text-3xl font-medium tabular-nums">
            {data.main.pressure}
            <span className="ml-1 font-sans text-sm font-semibold text-white/80">hPa</span>
          </p>
          <p className="text-xs text-white/80">{pressureHint}</p>
        </div>
      </Tile>

      <Tile icon={<Sunrise className="size-4" aria-hidden />} label="Sun" className="col-span-2">
        <SunArc sunrise={data.sys.sunrise} sunset={data.sys.sunset} now={now} />
        <div className="flex items-end justify-between text-sm">
          <p>
            <span className="flex items-center gap-1 text-white/80">
              <Sunrise className="size-4" aria-hidden /> Sunrise
            </span>
            <span className="font-display text-xl font-medium">{formatTime(data.sys.sunrise, data.timezone)}</span>
          </p>
          <p className="pb-1 text-center text-xs text-white/80">
            {hours}h {minutes}m of daylight
          </p>
          <p className="text-right">
            <span className="flex items-center justify-end gap-1 text-white/80">
              Sunset <Sunset className="size-4" aria-hidden />
            </span>
            <span className="font-display text-xl font-medium">{formatTime(data.sys.sunset, data.timezone)}</span>
          </p>
        </div>
      </Tile>
    </section>
  )
}
