import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Moon, Sun } from "lucide-react"
import type { LucideProps } from "lucide-react"

interface WeatherIconProps extends LucideProps {
  main: string
  night?: boolean
}

export default function WeatherIcon({ main, night = false, ...props }: WeatherIconProps) {
  const m = main.toLowerCase()
  const common = { "aria-hidden": true, ...props }
  if (m.includes("thunder")) return <CloudLightning {...common} />
  if (m.includes("drizzle")) return <CloudDrizzle {...common} />
  if (m.includes("rain")) return <CloudRain {...common} />
  if (m.includes("snow")) return <CloudSnow {...common} />
  if (m === "clouds") return night ? <CloudMoon {...common} /> : <Cloud {...common} />
  if (m === "clear") return night ? <Moon {...common} /> : <Sun {...common} />
  if (["mist", "fog", "haze", "smoke", "dust", "sand", "ash"].includes(m)) return <CloudFog {...common} />
  return night ? <CloudMoon {...common} /> : <CloudSun {...common} />
}
