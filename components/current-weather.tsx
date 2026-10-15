import WeatherIcon from "@/components/weather-icon"
import { formatLongDate, formatTime, unitLabels, type DailyForecast, type Unit, type WeatherData } from "@/lib/weather"

interface CurrentWeatherProps {
  data: WeatherData
  unit: Unit
  today?: DailyForecast
  lastUpdated: Date | null
  night: boolean
}

export default function CurrentWeather({ data, unit, today, lastUpdated, night }: CurrentWeatherProps) {
  const { temp: tempUnit } = unitLabels(unit)
  const condition = data.weather[0]
  const high = Math.round(Math.max(data.main.temp_max, today?.max ?? -Infinity))
  const low = Math.round(Math.min(data.main.temp_min, today?.min ?? Infinity))
  const nowUnix = Math.floor(Date.now() / 1000)

  return (
    <section className="panel relative overflow-hidden p-6 md:p-8" aria-labelledby="city-name">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 size-64 rounded-full blur-3xl ${night ? "bg-indigo-200/15" : "bg-amber-200/30"}`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h1 id="city-name" className="font-display text-4xl font-semibold leading-tight tracking-tight text-shadow md:text-5xl">
            {data.name}
            <span className="ml-2 align-middle text-base font-semibold tracking-wide text-white/75 md:text-lg">{data.sys.country}</span>
          </h1>
          <p className="mt-1 text-white/85">
            {formatLongDate(nowUnix, data.timezone)} · {formatTime(nowUnix, data.timezone)}
          </p>
        </div>
        <WeatherIcon main={condition?.main ?? "Clear"} night={night} className="size-20 shrink-0 md:size-28" strokeWidth={1.25} />
      </div>

      <div className="relative mt-6 flex items-end gap-2">
        <p className="font-display text-[6.5rem] font-light leading-[0.85] tracking-tighter tabular-nums text-shadow md:text-[8.5rem]">
          {Math.round(data.main.temp)}°
        </p>
        <span className="mb-3 text-xl font-semibold text-white/80">{tempUnit.slice(1)}</span>
      </div>

      <p className="relative mt-4 text-xl font-semibold capitalize">{condition?.description}</p>
      <p className="relative mt-1 text-white/85">
        <span>H {high}°</span>
        <span className="mx-2 text-white/50">/</span>
        <span>L {low}°</span>
        <span className="mx-2 text-white/50">·</span>
        <span>Feels like {Math.round(data.main.feels_like)}°</span>
      </p>

      {lastUpdated && (
        <p className="relative mt-6 text-xs text-white/70">
          Updated {lastUpdated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} your time
        </p>
      )}
    </section>
  )
}
