# Weather Forecast App

A modern, real-time weather application built with Next.js and React. Get instant weather updates, hourly forecasts, and 5-day predictions for any city worldwide.

**Developer**: Zain Aftab

## Features

- **Real-time Weather Data**: Current temperature, humidity, wind speed, and atmospheric pressure
- **City Search**: Search for weather in any city worldwide with instant results
- **Geolocation Support**: Automatically detect and display weather for your current location
- **Hourly Forecast**: View weather predictions for the next 24 hours
- **5-Day Forecast**: Plan ahead with a comprehensive 5-day weather forecast
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit with one click
- **Sunrise & Sunset Times**: Know exactly when the sun rises and sets
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Beautiful dark mode for comfortable viewing
- **Last Updated Timestamp**: See when the weather data was last refreshed
- **Error Handling**: Clear error messages and retry functionality

## Technologies Used

- **Frontend Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **API**: OpenWeatherMap API
- **Language**: TypeScript
- **Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenWeatherMap API key (included in this project)

### Installation

1. Clone or download this project
2. Install dependencies using the shadcn CLI:
   ```bash
   npx shadcn-cli@latest init
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

The app uses the following API key (already configured):
- `API_KEY`: `fb8de5c7d63da57183ef875cd7a1103e` (OpenWeatherMap)

## How to Use

### Search for a City
1. Enter a city name in the search bar at the top
2. Press Enter or click the search button
3. Weather data loads instantly

### Use Your Current Location
1. Click the "My Location" button in the top-right
2. Allow location access when prompted
3. Weather for your current location displays automatically

### Toggle Temperature Units
1. Click the temperature unit button (°C or °F) in the top-right
2. All temperatures instantly convert to your preferred unit

### View Forecasts
- **Hourly**: See detailed weather for the next 24 hours
- **5-Day**: Get a daily forecast for the next 5 days

## Project Structure

```
├── app/
│   ├── page.tsx           # Main weather app page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── loading.tsx        # Loading state
├── components/
│   ├── current-weather.tsx    # Current weather display
│   ├── search-bar.tsx         # City search input
│   ├── forecast-card.tsx      # Individual forecast card
│   ├── hourly-forecast.tsx    # Hourly forecast display
│   ├── loading-spinner.tsx    # Loading spinner
│   └── ui/                    # shadcn/ui components
└── README.md              # This file
```

## Features in Detail

### Current Weather Card
Displays real-time weather including:
- Current temperature and "feels like" temperature
- Weather description with icon
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Visibility distance
- Sunrise and sunset times
- Last updated timestamp

### Hourly Forecast
Shows the next 24 hours with:
- Time-based weather predictions
- Temperature and conditions
- Hourly weather icons
- Horizontally scrollable for easy browsing

### 5-Day Forecast
5 individual cards showing:
- Daily date
- Maximum and minimum temperatures
- Weather conditions and icons
- Humidity levels

## API Details

This app uses the **OpenWeatherMap API** with the following endpoints:

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **Forecast Data**: `https://api.openweathermap.org/data/2.5/forecast`

Both endpoints support queries by:
- City name: `?q=London`
- Coordinates: `?lat=51.5074&lon=-0.1278`
- Units: `metric` (Celsius) or `imperial` (Fahrenheit)

## Error Handling

The app includes comprehensive error handling for:
- City not found errors
- Network failures
- Geolocation permission denied
- Location unavailable
- API request timeouts
- Invalid responses

All errors display user-friendly messages with a "Retry" button.

## Performance Features

- Efficient state management with React hooks
- Data validation before rendering
- Proper error boundaries
- Responsive images and icons
- Optimized CSS with Tailwind utility classes
- Fast API calls with proper error handling

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features for future versions:
- Weather alerts and warnings
- Multiple location tracking
- Weather history and trends
- Air quality index (AQI)
- UV index information
- Extended 10-day forecast
- Precipitation probability
- Wind direction visualization
- Weather maps integration

## Troubleshooting

### "City not found" error
- Check spelling of the city name
- Try using the city with country code (e.g., "London, UK")

### Geolocation not working
- Ensure location permission is granted in browser settings
- Some browsers require HTTPS for geolocation
- Check if your device has location services enabled

### Weather data not updating
- Click the Retry button in the error message
- Try refreshing the page
- Check your internet connection

## License

This project is free to use and modify.

## Feedback & Support

For issues or suggestions, please reach out to the developer.

---

**Built with ❤️ by Zain Aftab**
