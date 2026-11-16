import React from 'react';
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from 'lucide-react';
import WeatherCard from './WeatherCard';

const CurrentWeather = ({ data, unit }) => {
  if (!data) return null;

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const getWeatherIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <div className="weather-container p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-600">Current weather</p>
            <h2 className="mt-2 text-4xl font-black text-slate-800">
              {data.name}, {data.sys.country}
            </h2>
            <p className="mt-2 text-lg capitalize text-slate-600">{data.weather[0].description}</p>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-6xl font-black text-sky-600 md:text-7xl">
              {Math.round(data.main.temp)}
            </span>
            <div>
              <p className="text-3xl text-slate-500">{tempUnit}</p>
              <p className="mt-2 text-sm text-slate-500">
                Feels like {Math.round(data.main.feels_like)}{tempUnit}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={getWeatherIcon(data.weather[0].icon)}
            alt={data.weather[0].description}
            className="h-40 w-40 object-contain md:h-48 md:w-48"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <WeatherCard icon={<Droplets className="h-6 w-6" />} label="Humidity" value={`${data.main.humidity}%`} />
        <WeatherCard icon={<Wind className="h-6 w-6" />} label="Wind Speed" value={`${data.wind.speed} ${speedUnit}`} />
        <WeatherCard icon={<Eye className="h-6 w-6" />} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
        <WeatherCard icon={<Gauge className="h-6 w-6" />} label="Pressure" value={`${data.main.pressure} mb`} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <WeatherCard icon={<Sunrise className="h-6 w-6" />} label="Sunrise" value={formatTime(data.sys.sunrise)} />
        <WeatherCard icon={<Sunset className="h-6 w-6" />} label="Sunset" value={formatTime(data.sys.sunset)} />
      </div>
    </div>
  );
};

export default CurrentWeather;
