import { useState, useCallback } from 'react';
import {
  fetchForecastByCoordinates,
  fetchWeatherByCoordinates,
  fetchWeatherBundle,
  fetchMultipleCities,
  formatWeatherApiError,
} from '../services/weatherApi';

const buildDailyForecast = (forecastList = []) => {
  const dailyForecasts = [];
  const seenDates = new Set();

  forecastList.forEach((item) => {
    const dateKey = new Date(item.dt_txt).toDateString();
    if (!seenDates.has(dateKey) && dailyForecasts.length < 5) {
      seenDates.add(dateKey);
      dailyForecasts.push(item);
    }
  });

  return dailyForecasts;
};

const useWeather = (unit = 'metric') => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(
    async (city = null, lat = null, lon = null) => {
      setLoading(true);
      setError(null);

      try {
        if (city) {
          const { current, forecast: forecastData } = await fetchWeatherBundle(city, unit);
          setCurrentWeather(current);
          setForecast(buildDailyForecast(forecastData));
          return;
        }

        if (lat !== null && lon !== null) {
          const [current, forecastData] = await Promise.all([
            fetchWeatherByCoordinates(lat, lon, unit),
            fetchForecastByCoordinates(lat, lon, unit),
          ]);

          setCurrentWeather(current);
          setForecast(buildDailyForecast(forecastData.list));
          return;
        }

        throw new Error('Please provide a city name or coordinates.');
      } catch (err) {
        setCurrentWeather(null);
        setForecast(null);
        setError(formatWeatherApiError(err, 'Unable to load weather data.'));
      } finally {
        setLoading(false);
      }
    },
    [unit]
  );

  const fetchComparison = useCallback(
    async (cities = []) => {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchMultipleCities(cities, unit);
        setComparisonResults(results);

        const failedResult = results.find((result) => result.error);
        if (failedResult) {
          setError(failedResult.error);
        }
      } catch (err) {
        setComparisonResults([]);
        setError(formatWeatherApiError(err, 'Unable to compare the selected cities.'));
      } finally {
        setLoading(false);
      }
    },
    [unit]
  );

  return { currentWeather, forecast, comparisonResults, loading, error, fetchWeather, fetchComparison };
};

export default useWeather;
