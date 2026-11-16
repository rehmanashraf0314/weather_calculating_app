import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, ArrowRightLeft } from 'lucide-react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import SearchBar from './components/SearchBar';
import ComparisonPanel from './components/ComparisonPanel';
import useWeather from './hooks/useWeather';

function App() {
  const [city, setCity] = useState('London');
  const [unit, setUnit] = useState('metric');
  const [activeView, setActiveView] = useState('single');
  const [cityA, setCityA] = useState('Paris');
  const [cityB, setCityB] = useState('Tokyo');

  const { currentWeather, forecast, comparisonResults, loading, error, fetchWeather, fetchComparison } = useWeather(unit);

  useEffect(() => {
    if (activeView === 'single' && city.trim()) {
      fetchWeather(city);
    }
  }, [city, unit, activeView, fetchWeather]);

  useEffect(() => {
    if (navigator.geolocation && process.env.REACT_APP_ENABLE_GEOLOCATION === 'true') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(null, latitude, longitude);
        },
        () => {
          console.log('Geolocation unavailable; using the default city.');
        }
      );
    }
  }, [fetchWeather]);

  const handleCompare = async () => {
    if (!cityA.trim() || !cityB.trim()) {
      return;
    }

    await fetchComparison([cityA, cityB]);
  };

  const comparisonData = comparisonResults.filter((result) => result.data).map((result) => result.data);
  const comparisonWarnings = comparisonResults.filter((result) => result.error);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/40 backdrop-blur-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-200">
                <CloudSun className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Weather Calculating App</p>
                <h1 className="mt-1 text-3xl font-black text-white md:text-4xl">Live weather insights</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setUnit((current) => (current === 'metric' ? 'imperial' : 'metric'))}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-md transition hover:bg-sky-50"
              >
                {unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
              </button>
            </div>
          </div>
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveView('single')}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              activeView === 'single'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                : 'bg-white/10 text-slate-200 ring-1 ring-white/10 hover:bg-white/20'
            }`}
          >
            Single city
          </button>
          <button
            type="button"
            onClick={() => setActiveView('compare')}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              activeView === 'compare'
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                : 'bg-white/10 text-slate-200 ring-1 ring-white/10 hover:bg-white/20'
            }`}
          >
            Compare cities
          </button>
        </div>

        {error && activeView === 'single' && (
          <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-500/90 p-4 text-white shadow-lg">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {loading && (
          <div className="mb-8 flex items-center justify-center gap-3 rounded-2xl bg-white/10 px-4 py-6 text-slate-100">
            <div className="loading-spinner"></div>
            <span className="text-lg font-medium">Loading weather data...</span>
          </div>
        )}

        {activeView === 'single' && (
          <section className="space-y-8">
            <div className="weather-container p-4 md:p-6">
              <SearchBar onSearch={setCity} placeholder="Search for a city" />
            </div>

            {currentWeather && !loading && (
              <div>
                <CurrentWeather data={currentWeather} unit={unit} />
              </div>
            )}

            {forecast && forecast.length > 0 && !loading && (
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">5-Day forecast</h2>
                <Forecast data={forecast} unit={unit} />
              </div>
            )}
          </section>
        )}

        {activeView === 'compare' && (
          <section className="space-y-6">
            <div className="weather-container p-5 md:p-6">
              <div className="mb-5 flex items-center gap-2 text-sky-700">
                <MapPin className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.12em]">Compare locations</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-600">
                  <span>City A</span>
                  <input
                    value={cityA}
                    onChange={(event) => setCityA(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    placeholder="Enter city A"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-600">
                  <span>City B</span>
                  <input
                    value={cityB}
                    onChange={(event) => setCityB(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="Enter city B"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCompare}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Compare weather
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCityA('Paris');
                    setCityB('Tokyo');
                  }}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                >
                  Use example cities
                </button>
              </div>

              {comparisonWarnings.length > 0 && (
                <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {comparisonWarnings.map((warning) => (
                    <p key={warning.city}>{warning.city}: {warning.error}</p>
                  ))}
                </div>
              )}
            </div>

            {comparisonData.length >= 2 && !loading && (
              <ComparisonPanel cityA={comparisonData[0]} cityB={comparisonData[1]} unit={unit} />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
