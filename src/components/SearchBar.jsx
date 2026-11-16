import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = 'Search for a city...', defaultValue = '' }) => {
  const [input, setInput] = useState(defaultValue);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    onSearch(input.trim());
    setInput('');
  };

  const quickCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-sky-100 p-2 text-sky-700 transition hover:bg-sky-200"
          aria-label="Search weather"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickCities.map((quickCity) => (
          <button
            key={quickCity}
            type="button"
            onClick={() => onSearch(quickCity)}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            {quickCity}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
