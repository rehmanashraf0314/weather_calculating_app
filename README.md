# Weather Calculating App

A responsive React weather application that pulls real-time weather data from the OpenWeatherMap API and lets users compare two cities side by side with exact metric differences.

## Overview

Weather Calculating App is a modern weather dashboard built with React.js, JavaScript, Tailwind CSS, Axios, and the OpenWeatherMap API. It supports:

- single-city weather lookup
- multi-city comparison mode
- weather difference calculations between locations
- responsive UI for desktop and mobile devices

## Features

- Search any city for current weather conditions
- View 5-day forecast data for a selected city
- Compare City A and City B side by side
- Calculate exact differences in:
  - temperature in °C and °F
  - humidity (%)
  - wind speed (m/s)
  - feels-like temperature
- Toggle between Celsius and Fahrenheit
- Handle invalid city names, missing API keys, and network issues gracefully
- Keep the UI clean and modular with reusable React components

## Tech Stack

- React.js
- JavaScript
- Tailwind CSS
- Axios
- OpenWeatherMap API
- Lucide React

## Project Structure

```bash
weather-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ComparisonPanel.jsx
│   │   ├── CurrentWeather.jsx
│   │   ├── Forecast.jsx
│   │   ├── MetricsSummary.jsx
│   │   ├── SearchBar.jsx
│   │   └── WeatherCard.jsx
│   ├── hooks/
│   │   └── useWeather.js
│   ├── services/
│   │   └── weatherApi.js
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── .gitignore
├── LICENSE
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── build/
```

## Prerequisites

- Node.js 18+
- npm
- OpenWeatherMap API key

## Environment Setup

Create a `.env` file in the project root and add your OpenWeatherMap API key.

```bash
# CRA / React app
REACT_APP_WEATHER_API_KEY=your_api_key_here
REACT_APP_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
REACT_APP_ENABLE_GEOLOCATION=false

# Optional Vite-compatible variable
VITE_WEATHER_API_KEY=your_api_key_here
VITE_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

> The app supports both `REACT_APP_WEATHER_API_KEY` and `VITE_WEATHER_API_KEY`. Only one is required.

## Installation

1. Clone the repository

```bash
git clone <your-repository-url>
cd weather-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Create the `.env` file and add your API key

4. Start the app in development mode

```bash
npm start
```

The app will run at:

```bash
http://localhost:3000
```

## Production Build

```bash
npm run build
```

## How It Works

### Single-City Search

Use the search bar to look up a city and view:

- current temperature
- weather description
- humidity
- wind speed
- visibility
- pressure
- sunrise and sunset times

### Weather Comparison Mode

Switch to the comparison view to enter two cities and view a side-by-side comparison panel. The app calculates:

- temperature difference in °C and °F
- humidity difference
- wind speed difference
- feels-like temperature difference
- which city is warmer or cooler

### API Layer

All weather requests are centralized in a dedicated Axios service file at [src/services/weatherApi.js](src/services/weatherApi.js). The app uses `Promise.all()` to fetch weather data for multiple cities concurrently and includes clear error handling.

## Error Handling

The application includes validation and user-friendly messages for:

- invalid city names
- missing API keys
- bad API credentials
- network failures
- unavailable weather service responses

## Contributing

Contributions are welcome. Keep the code modular and maintain responsive styling across the dashboard.

## License

This project is licensed under the MIT License.
