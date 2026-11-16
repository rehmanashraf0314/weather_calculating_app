import React from 'react';

const Forecast = ({ data, unit }) => {
  if (!data || data.length === 0) return null;

  const tempUnit = unit === 'metric' ? '°C' : '°F';

  const getWeatherIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {data.map((day, index) => (
        <div
          key={`${day.dt}-${index}`}
          className="weather-container p-5 text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <p className="mb-3 text-sm font-semibold text-slate-600">{formatDate(day.dt_txt)}</p>
          <img
            src={getWeatherIcon(day.weather[0].icon)}
            alt={day.weather[0].description}
            className="mx-auto mb-3 h-16 w-16"
          />
          <p className="mb-3 capitalize text-sm text-slate-700">{day.weather[0].main}</p>

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="text-2xl font-bold text-sky-600">
              {Math.round(day.main.temp_max)}{tempUnit}
            </span>
            <span className="text-lg text-slate-500">{Math.round(day.main.temp_min)}{tempUnit}</span>
          </div>

          <div className="space-y-1 text-xs text-slate-500">
            <p>Humidity: {day.main.humidity}%</p>
            <p>Wind: {day.wind.speed} m/s</p>
            <p>Rain: {(day.pop * 100).toFixed(0)}%</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Forecast;
