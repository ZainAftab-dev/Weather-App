"use server"

const API_KEY = process.env.OPENWEATHER_API_KEY || ""

interface WeatherResponse {
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

interface ForecastResponse {
  list: Array<{
    dt: number
    main: {
      temp: number
      humidity: number
    }
    weather: Array<{
      main: string
      description: string
    }>
  }>
}

export async function fetchWeatherData(
  city: string,
  unit: "metric" | "imperial" = "metric",
): Promise<{ weather: WeatherResponse; forecast: ForecastResponse } | null> {
  if (!API_KEY) {
    throw new Error("API key not configured")
  }

  try {
    const encodedCity = encodeURIComponent(city)

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=${unit}&appid=${API_KEY}`,
    )

    if (!weatherRes.ok) {
      throw new Error(weatherRes.status === 404 ? "City not found" : `API error: ${weatherRes.status}`)
    }

    const weather: WeatherResponse = await weatherRes.json()

    if (!weather.name || !weather.sys || !weather.main) {
      throw new Error("Invalid weather data received")
    }

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=${unit}&appid=${API_KEY}`,
    )

    if (!forecastRes.ok) {
      throw new Error(`Forecast API error: ${forecastRes.status}`)
    }

    const forecast: ForecastResponse = await forecastRes.json()

    if (!forecast.list || !Array.isArray(forecast.list)) {
      throw new Error("Invalid forecast data received")
    }

    return { weather, forecast }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch weather"
    throw new Error(errorMessage)
  }
}

export async function fetchWeatherByCoords(
  latitude: number,
  longitude: number,
  unit: "metric" | "imperial" = "metric",
): Promise<WeatherResponse | null> {
  if (!API_KEY) {
    throw new Error("API key not configured")
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${API_KEY}`,
    )

    if (!res.ok) {
      throw new Error("Failed to fetch weather for your location")
    }

    const data: WeatherResponse = await res.json()
    return data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch weather"
    throw new Error(errorMessage)
  }
}
