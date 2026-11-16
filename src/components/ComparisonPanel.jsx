import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import MetricsSummary from './MetricsSummary';

const toCelsius = (value, unit) => (unit === 'metric' ? Number(value) : ((Number(value) - 32) * 5) / 9);
const toFahrenheit = (value, unit) => (unit === 'metric' ? (Number(value) * 9) / 5 + 32 : Number(value));

const formatSignedValue = (value, suffix) => {
  const numericValue = Number(value);
  return `${numericValue >= 0 ? '+' : ''}${numericValue.toFixed(1)}${suffix}`;
};

const ComparisonPanel = ({ cityA, cityB, unit }) => {
  if (!cityA || !cityB) {
    return null;
  }

  const tempA = toCelsius(cityA.main.temp, unit);
  const tempB = toCelsius(cityB.main.temp, unit);
  const feelsA = toCelsius(cityA.main.feels_like, unit);
  const feelsB = toCelsius(cityB.main.feels_like, unit);
  const tempDiff = tempB - tempA;
  const tempDiffF = toFahrenheit(tempB, 'metric') - toFahrenheit(tempA, 'metric');
  const feelDiff = feelsB - feelsA;
  const humidityDiff = cityB.main.humidity - cityA.main.humidity;
  const windDiff = cityB.wind.speed - cityA.wind.speed;

  const weatherSummary =
    tempDiff >= 0
      ? `${cityB.name} is warmer than ${cityA.name} by ${Math.abs(tempDiff).toFixed(1)}°C.`
      : `${cityA.name} is warmer than ${cityB.name} by ${Math.abs(tempDiff).toFixed(1)}°C.`;

  return (
    <div className="weather-container p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-600">Comparison mode</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">City Weather Comparison</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700">
          <ArrowRightLeft className="h-4 w-4" />
          {weatherSummary}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[cityA, cityB].map((city) => (
          <div key={city.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Location</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-800">{city.name}</h3>
                <p className="text-sm text-slate-500">{city.sys.country}</p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                alt={city.weather[0].description}
                className="h-16 w-16"
              />
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-5xl font-black text-sky-600">
                {Math.round(city.main.temp)}
              </span>
              <span className="pb-2 text-xl text-slate-500">
                {unit === 'metric' ? '°C' : '°F'}
              </span>
            </div>

            <p className="mt-2 capitalize text-slate-600">{city.weather[0].description}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Humidity</p>
                <p className="mt-2 font-bold text-slate-800">{city.main.humidity}%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Wind</p>
                <p className="mt-2 font-bold text-slate-800">{city.wind.speed} m/s</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Feels like</p>
                <p className="mt-2 font-bold text-slate-800">{Math.round(city.main.feels_like)}°</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Pressure</p>
                <p className="mt-2 font-bold text-slate-800">{city.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <MetricsSummary
          label="Temperature"
          valueA={`${tempA.toFixed(1)}°C`}
          valueB={`${tempB.toFixed(1)}°C`}
          difference={formatSignedValue(tempDiff, '°C')}
          unitLabel={`Difference in °C: ${Math.abs(tempDiff).toFixed(1)}°C`}
        />

        <MetricsSummary
          label="Temperature (°F)"
          valueA={`${toFahrenheit(tempA, 'metric').toFixed(1)}°F`}
          valueB={`${toFahrenheit(tempB, 'metric').toFixed(1)}°F`}
          difference={formatSignedValue(tempDiffF, '°F')}
          unitLabel={`Difference in °F: ${Math.abs(tempDiffF).toFixed(1)}°F`}
        />

        <MetricsSummary
          label="Humidity"
          valueA={`${cityA.main.humidity}%`}
          valueB={`${cityB.main.humidity}%`}
          difference={formatSignedValue(humidityDiff, '%')}
          unitLabel={`Humidity variance: ${Math.abs(humidityDiff)}%`}
        />

        <MetricsSummary
          label="Wind speed"
          valueA={`${cityA.wind.speed} m/s`}
          valueB={`${cityB.wind.speed} m/s`}
          difference={formatSignedValue(windDiff, ' m/s')}
          unitLabel={`Wind variance: ${Math.abs(windDiff).toFixed(1)} m/s`}
        />

        <div className="lg:col-span-2">
          <MetricsSummary
            label="Feels like"
            valueA={`${feelsA.toFixed(1)}°C`}
            valueB={`${feelsB.toFixed(1)}°C`}
            difference={formatSignedValue(feelDiff, '°C')}
            unitLabel={`Perceived temperature difference: ${Math.abs(feelDiff).toFixed(1)}°C`}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonPanel;
