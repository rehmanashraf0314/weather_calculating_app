import React from 'react';

const MetricsSummary = ({ label, valueA, valueB, difference, unitLabel }) => {
  const differenceValue = Number.parseFloat(difference || '0');
  const isPositive = differenceValue >= 0;

  return (
    <div className="rounded-2xl border border-sky-100 bg-slate-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {difference}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">City A</p>
          <p className="mt-2 text-lg font-bold text-slate-800">{valueA}</p>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">City B</p>
          <p className="mt-2 text-lg font-bold text-slate-800">{valueB}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{unitLabel}</p>
    </div>
  );
};

export default MetricsSummary;
