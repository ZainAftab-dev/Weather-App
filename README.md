<div align="center">

# 🌤️ Weather Forecast App

Current conditions, a 24-hour forecast and a 5-day outlook for any city in the world, built with Next.js, React and the OpenWeatherMap API.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-EB6E4B)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Features

- **City search:** look up the weather for any city by name (opens on New York)
- **My Location:** one click uses the browser's geolocation to show the weather where you are
- **Current weather card:** temperature, "feels like", description and icon, humidity, wind speed, pressure, visibility, sunrise and sunset, and a "last updated" time
- **Hourly forecast:** the next 24 hours in 3-hour steps
- **5-day forecast:** one card per day with the expected conditions
- **°C / °F toggle:** reloads the data in metric or imperial units
- **Error handling:** clear messages for unknown cities or network problems, with a Retry button
- **Responsive design** with a light gradient theme and dark-mode styles

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Lucide icons |
| Data | [OpenWeatherMap API](https://openweathermap.org/api) (Current Weather + 5 day / 3 hour Forecast) |

## Getting started

**Requirements:** Node.js 18.18 or newer and a free OpenWeatherMap API key ([sign up here](https://home.openweathermap.org/users/sign_up)).

```bash
git clone https://github.com/ZainAftab-dev/Weather-App.git
cd Weather-App
npm install
```

Set your API key in `app/page.tsx`:

```ts
const API_KEY = "your_openweathermap_api_key"
```

Then start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build: `npm run build` then `npm start`.

> New OpenWeatherMap keys can take up to two hours to activate. If you see "Invalid API key", wait and try again.

## API endpoints used

| Endpoint | Used for |
|---|---|
| `GET /data/2.5/weather?q={city}` | Current weather by city name |
| `GET /data/2.5/weather?lat={lat}&lon={lon}` | Current weather for "My Location" |
| `GET /data/2.5/forecast?q={city}` | Hourly (first 8 × 3 h) and 5-day forecasts |

## Project structure

```
app/
├── layout.tsx               # root layout and metadata
├── page.tsx                 # state, API calls, geolocation, unit toggle
├── loading.tsx              # loading state
├── actions.ts               # server-action versions of the API calls (reads OPENWEATHER_API_KEY)
└── globals.css
components/
├── search-bar.tsx           # city search
├── current-weather.tsx      # current conditions card
├── hourly-forecast.tsx      # next 24 hours
├── forecast-card.tsx        # one day of the 5-day forecast
└── loading-spinner.tsx
```

## Troubleshooting

| Problem | Fix |
|---|---|
| "City not found" | Check the spelling, or add the country code, e.g. `Lahore,PK` |
| My Location does nothing | Allow location access in the browser; geolocation needs `https` or `localhost` |
| "Invalid API key" | Check the key in `app/page.tsx`; new keys need time to activate |

## Deployment

Import the repository into [Vercel](https://vercel.com/new) and deploy with the default settings.

## Author

**Zain Aftab** · [GitHub](https://github.com/ZainAftab-dev) · [LinkedIn](https://www.linkedin.com/in/zain-aftab-563727295/)

## License

[MIT](LICENSE)
