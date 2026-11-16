import axios from 'axios';

const getEnvValue = (name) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || '';
  }

  return '';
};

export const API_KEY = getEnvValue('REACT_APP_WEATHER_API_KEY') || getEnvValue('VITE_WEATHER_API_KEY') || '';
export const BASE_URL =
  getEnvValue('REACT_APP_WEATHER_API_URL') ||
  getEnvValue('VITE_WEATHER_API_URL') ||
  'https://api.openweathermap.org/data/2.5';

export const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

export const formatWeatherApiError = (error, fallbackMessage = 'Unable to fetch weather data right now.') => {
  if (!error) {
    return fallbackMessage;
  }

  if (error.response?.status === 404) {
    return 'City not found. Please check the spelling and try again.';
  }

  if (error.response?.status === 401) {
    return 'Invalid API key. Please check your OpenWeatherMap configuration.';
  }

  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.response?.status >= 500) {
    return 'The weather service is temporarily unavailable. Please try again later.';
  }

  return error.response?.data?.message || error.message || fallbackMessage;
};

const requestWeather = async (endpoint, params = {}) => {
  if (!API_KEY) {
    throw new Error(
      'API key not configured. Please add REACT_APP_WEATHER_API_KEY or VITE_WEATHER_API_KEY to your environment.'
    );
  }

  const response = await weatherApi.get(endpoint, {
    params: {
      ...params,
      appid: API_KEY,
    },
  });

  return response.data;
};

export const fetchCurrentWeather = async (city, unit = 'metric') => {
  const cityName = city?.trim();

  if (!cityName) {
    throw new Error('Please enter a valid city name.');
  }

  return requestWeather('/weather', { q: cityName, units: unit });
};

export const fetchForecast = async (city, unit = 'metric') => {
  const cityName = city?.trim();

  if (!cityName) {
    throw new Error('Please enter a valid city name.');
  }

  return requestWeather('/forecast', { q: cityName, units: unit });
};

export const fetchWeatherByCoordinates = async (lat, lon, unit = 'metric') => {
  if (lat === null || lon === null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) {
    throw new Error('Location coordinates are invalid.');
  }

  return requestWeather('/weather', { lat, lon, units: unit });
};

export const fetchForecastByCoordinates = async (lat, lon, unit = 'metric') => {
  if (lat === null || lon === null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) {
    throw new Error('Location coordinates are invalid.');
  }

  return requestWeather('/forecast', { lat, lon, units: unit });
};

export const fetchWeatherBundle = async (city, unit = 'metric') => {
  const [current, forecast] = await Promise.all([
    fetchCurrentWeather(city, unit),
    fetchForecast(city, unit),
  ]);

  return {
    current,
    forecast: forecast?.list || [],
  };
};

export const fetchMultipleCities = async (cities, unit = 'metric') => {
  const validCities = [...new Set(cities.filter(Boolean).map((city) => city.trim()))];

  if (!validCities.length) {
    return [];
  }

  const results = await Promise.all(
    validCities.map(async (city) => {
      try {
        const data = await fetchCurrentWeather(city, unit);
        return { city, data, error: null };
      } catch (error) {
        return {
          city,
          data: null,
          error: formatWeatherApiError(error, `Unable to load ${city}.`),
        };
      }
    })
  );

  return results;
};
