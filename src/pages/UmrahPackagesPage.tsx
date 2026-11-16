import React, { useMemo, useState } from 'react';
import { Calendar, Check, Filter, MapPin, Plane, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PackageTier } from '../types/travel';
import { filterUmrahPackages, formatDisplayDate, formatMoney, getSeatsRemaining } from '../utils/travelLogic';
import { SafeImage } from '../components/BrandVisuals';

export function UmrahPackagesPage() {
  const { db, currency, searchState, setSelectedPackageId } = useApp();

  const [tier, setTier] = useState<'All' | PackageTier>(searchState.umrahTier || 'All');
  const [season, setSeason] = useState<string>(searchState.umrahSeason || 'All');
  const [batchLabel, setBatchLabel] = useState<string>(searchState.umrahBatchLabel || 'All');
  const [airport, setAirport] = useState<'All' | 'Jeddah' | 'Madinah'>('All');
  const [month, setMonth] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(15000000);

  const filtered = useMemo(
    () =>
      filterUmrahPackages(db.packages, {
        tier,
        season,
        batchLabel,
        departureAirport: airport,
        month,
        maxPriceNgn: maxPrice,
      }),
    [db.packages, tier, season, batchLabel, airport, month, maxPrice]
  );

  const resetFilters = () => {
    setTier('All');
    setSeason('All');
    setBatchLabel('All');
    setAirport('All');
    setMonth('All');
    setMaxPrice(15000000);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
            Ramadan 2027, Regular Umrah &amp; Hajj Caravans
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A224E] mt-1">
            Hajj &amp; Umrah Packages
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Every package includes Saudi Airlines return flights from Kano, visa processing,
            verified hotels in Makkah and Madinah, guided Ziyarat, and 24/7 escort support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#0A224E] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#D4AF37]" />
                <span>Filter Packages</span>
              </h2>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-slate-500 hover:text-[#0A224E] inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Package Tier</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['All', 'Economy', 'Luxury', 'Premium'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      tier === t
                        ? 'bg-[#0A224E] text-white border-[#0A224E]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="filter-season" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Season / Category
              </label>
              <select
                id="filter-season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="All">All Seasons (Ramadan, Regular &amp; Hajj)</option>
                <option value="Ramadan 2027">Ramadan 2027 Umrah</option>
                <option value="Regular Umrah">Regular Umrah</option>
                <option value="Hajj">Hajj 2027</option>
              </select>
            </div>

            <div>
              <label htmlFor="filter-airport" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Arrival Airport
              </label>
              <select
                id="filter-airport"
                value={airport}
                onChange={(e) => setAirport(e.target.value as typeof airport)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="All">All Routes (Kano → Jeddah / Madinah)</option>
                <option value="Jeddah">Kano → Jeddah</option>
                <option value="Madinah">Kano → Madinah</option>
              </select>
            </div>

            <div>
              <label htmlFor="filter-month" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Departure Window
              </label>
              <select
                id="filter-month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="All">All Months (Feb – May 2027)</option>
                <option value="2027-02">February 2027 (Ramadan Batches 1–5)</option>
                <option value="2027-04">April 2027 (Regular Umrah)</option>
                <option value="2027-05">May 2027 (Hajj Caravan)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="filter-price" className="font-semibold text-slate-700">
                  Max Budget
                </label>
                <span className="font-mono font-semibold text-[#0A224E] tabular-nums">
                  {formatMoney(maxPrice, currency)}
                </span>
              </div>
              <input
                id="filter-price"
                type="range"
                min={3500000}
                max={15000000}
                step={500000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0A224E]"
              />
            </div>
          </aside>

          {/* Package Catalog Grid */}
          <div className="lg:col-span-9 space-y-5">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                <p className="text-base font-semibold text-[#0A224E]">No packages match your filters</p>
                <p className="text-sm text-slate-500 mt-1">
                  Try widening your budget slider or clearing the arrival airport filter.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 text-xs font-semibold bg-[#0A224E] text-white rounded-lg"
                >
                  Show All Packages
                </button>
              </div>
            ) : (
              filtered.map((pkg) => {
                const totalRemaining = pkg.schedules.reduce(
                  (sum, s) => sum + getSeatsRemaining(s),
                  0
                );
                return (
                  <article
                    key={pkg.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12"
                  >
                    <div className="md:col-span-4 aspect-[4/3] md:aspect-auto md:min-h-[260px] bg-slate-100">
                      <SafeImage
                        src={pkg.coverImage}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                        fallbackTitle={pkg.title}
                      />
                    </div>
                    <div className="md:col-span-8 p-6 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                          <span>
                            {pkg.category} · {pkg.tier} Tier · {pkg.hotelRating}
                          </span>
                          <span className="font-mono text-amber-700 font-semibold tabular-nums">
                            {totalRemaining} seats left across {pkg.schedules.length} schedule(s)
                          </span>
                        </div>

                        <h2 className="font-display text-2xl font-bold text-[#0A224E]">
                          {pkg.title}
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">{pkg.description}</p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-700">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                            Makkah: {pkg.makkahHotel}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                            Madinah: {pkg.madinahHotel}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {pkg.inclusions.slice(0, 4).map((inc) => (
                            <div key={inc} className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span className="truncate">{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-xs text-slate-500 block">Package Price / Pilgrim</span>
                          <span className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">
                            {formatMoney(pkg.priceNgn, currency)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPackageId(pkg.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0A224E] hover:bg-[#0F2C67] rounded-lg transition-colors"
                          >
                            <Plane className="w-3.5 h-3.5 text-[#F5B800]" />
                            <span>View {pkg.schedules.length} Schedules &amp; Book</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
