import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Building2,
  Calendar,
  Check,
  Compass,
  FileCheck2,
  HeartHandshake,
  Image as ImageIcon,
  MapPin,
  Plane,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { BRAND_IMAGES, RAMADAN_2027_SCHEDULES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { formatDisplayDate, formatMoney } from '../utils/travelLogic';
import { AirlineCrest, SafeImage } from '../components/BrandVisuals';

type SearchTab = 'flights' | 'umrah' | 'hotels' | 'visa';

export function HomePage() {
  const {
    db,
    currency,
    navigate,
    searchState,
    setSearchState,
    setSelectedPackageId,
    startCheckout,
    notify,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SearchTab>('flights');

  const featuredUmrah = db.packages.filter((p) => p.featured).slice(0, 3);
  const popularFlights = db.flights.slice(0, 3);
  const homeGallery = db.gallery.filter((g) => g.featuredOnHome).slice(0, 4);

  return (
    <div className="bg-white">
      {/* Executive Full-Bleed Aeroplane Hero + Floating 4-Tab Search Engine */}
      <section className="relative bg-[#061533] text-white overflow-hidden">
        {/* Background Aeroplane Photography + Gradient Scrim */}
        <div className="absolute inset-0">
          <SafeImage
            src={BRAND_IMAGES.heroAeroplane}
            alt="Commercial passenger jetliner soaring through golden hour clouds"
            className="w-full h-full object-cover object-center"
            fallbackTitle="Sidi Travel & Tours Aviation"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#061533]/95 via-[#0A224E]/80 to-[#061533]/40"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#061533] via-transparent to-[#061533]/30"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-16 lg:pb-16">
          <div className="max-w-2xl space-y-4 sm:space-y-5 mb-8 sm:mb-10">
            <p className="text-xs font-semibold tracking-wide text-[#F5B800]">
              Sidi Travel &amp; Tours Ltd. · Kano, Nigeria
            </p>
            <h1
              className="font-display font-bold tracking-tight text-white leading-[1.1]"
              style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.6rem)', textWrap: 'balance' }}
            >
              Your Trusted Travel Partner for Hajj, Umrah &amp; Global Flights
            </h1>
            <p className="text-base text-slate-200 leading-relaxed max-w-xl">
              Your Journey, Our Priority. Reserve Ramadan 2027 Umrah packages from Kano to Jeddah
              and Madinah, direct Saudi Airlines flights, Haram-view hotels, and express visa
              processing with flexible Naira installments.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/umrah-packages')}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[#D4AF37] text-[#061533] hover:bg-[#F5B800] rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Explore Ramadan 2027 Umrah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/visa-services')}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/25 text-white rounded-lg transition-colors whitespace-nowrap backdrop-blur-xs"
              >
                <span>Visa Assistance</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-xs text-slate-300">
              <span>400+ Umrah Visas Issued</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Saudi Airlines Direct from Kano</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Flexible Installment Plans</span>
            </div>
          </div>

          {/* Floating 4-Tab Wakanow-Style Booking Widget */}
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden">
            <div
              className="grid grid-cols-2 sm:flex sm:flex-wrap border-b border-slate-200 bg-slate-50 p-2 sm:px-3 sm:pt-2.5 sm:pb-0 gap-1.5 sm:gap-1"
              role="tablist"
              aria-label="Travel booking tabs"
            >
              {[
                { id: 'flights' as const, label: 'Flights', icon: Plane },
                { id: 'umrah' as const, label: 'Hajj & Umrah', icon: Compass },
                { id: 'hotels' as const, label: 'Hotels', icon: Building2 },
                { id: 'visa' as const, label: 'Visa Assistance', icon: FileCheck2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-b-none sm:rounded-t-lg transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-white text-[#0A224E] border border-[#D4AF37] sm:border-b-0 sm:border-t-2 sm:border-x sm:border-t-[#D4AF37] sm:border-slate-200 sm:-mb-px shadow-xs sm:shadow-none'
                        : 'text-slate-600 hover:text-[#0A224E]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-5 sm:p-6">
              {activeTab === 'flights' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate('/flights');
                  }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-700">
                    {(['Round-Trip', 'One-Way', 'Multi-City'] as const).map((type) => (
                      <label key={type} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="tripType"
                          checked={searchState.tripType === type}
                          onChange={() => setSearchState((s) => ({ ...s, tripType: type }))}
                          className="accent-[#0A224E]"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <div>
                      <label htmlFor="flt-origin" className="block text-xs font-medium text-slate-600 mb-1">
                        From
                      </label>
                      <select
                        id="flt-origin"
                        value={searchState.originCode}
                        onChange={(e) => setSearchState((s) => ({ ...s, originCode: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="KAN">KAN - Kano</option>
                        <option value="LOS">LOS - Lagos</option>
                        <option value="ABV">ABV - Abuja</option>
                        <option value="ALL">All Nigerian Airports</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="flt-dest" className="block text-xs font-medium text-slate-600 mb-1">
                        To
                      </label>
                      <select
                        id="flt-dest"
                        value={searchState.destinationCode}
                        onChange={(e) => setSearchState((s) => ({ ...s, destinationCode: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="ALL">All Destinations</option>
                        <option value="JED">JED - Jeddah</option>
                        <option value="MED">MED - Madinah</option>
                        <option value="DXB">DXB - Dubai</option>
                        <option value="LHR">LHR - London</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="flt-dep" className="block text-xs font-medium text-slate-600 mb-1">
                        Departure
                      </label>
                      <input
                        id="flt-dep"
                        type="date"
                        value={searchState.departureDate}
                        onChange={(e) => setSearchState((s) => ({ ...s, departureDate: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label htmlFor="flt-ret" className="block text-xs font-medium text-slate-600 mb-1">
                        Return
                      </label>
                      <input
                        id="flt-ret"
                        type="date"
                        disabled={searchState.tripType === 'One-Way'}
                        value={searchState.returnDate}
                        onChange={(e) => setSearchState((s) => ({ ...s, returnDate: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg font-mono disabled:bg-slate-100"
                      />
                    </div>
                    <div>
                      <label htmlFor="flt-cabin" className="block text-xs font-medium text-slate-600 mb-1">
                        Travelers &amp; Cabin
                      </label>
                      <select
                        id="flt-cabin"
                        value={searchState.cabinClass}
                        onChange={(e) =>
                          setSearchState((s) => ({
                            ...s,
                            cabinClass: e.target.value as typeof searchState.cabinClass,
                          }))
                        }
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="All">1 Traveler · Any Cabin</option>
                        <option value="Economy">Economy Class</option>
                        <option value="Business">Business Class</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#0A224E] hover:bg-[#0F2C67] rounded-lg transition-colors whitespace-nowrap"
                      >
                        Search Flights
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === 'umrah' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate('/umrah-packages');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                >
                  <div>
                    <label htmlFor="umr-season" className="block text-xs font-medium text-slate-600 mb-1">
                      Season
                    </label>
                    <select
                      id="umr-season"
                      value={searchState.umrahSeason}
                      onChange={(e) => setSearchState((s) => ({ ...s, umrahSeason: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="All">All Seasons</option>
                      <option value="Ramadan 2027">Ramadan 2027</option>
                      <option value="Regular Umrah">Regular Umrah</option>
                      <option value="Hajj">Hajj 2027</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="umr-tier" className="block text-xs font-medium text-slate-600 mb-1">
                      Package Tier
                    </label>
                    <select
                      id="umr-tier"
                      value={searchState.umrahTier}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          umrahTier: e.target.value as typeof searchState.umrahTier,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="All">All Tiers (Economy / Luxury / Premium)</option>
                      <option value="Economy">Economy — ₦4,700,000</option>
                      <option value="Luxury">Luxury — ₦6,000,000</option>
                      <option value="Premium">Premium — ₦11,000,000</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="umr-batch" className="block text-xs font-medium text-slate-600 mb-1">
                      Departure Batch
                    </label>
                    <select
                      id="umr-batch"
                      value={searchState.umrahBatchLabel}
                      onChange={(e) => setSearchState((s) => ({ ...s, umrahBatchLabel: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="All">All 5 Batches (Feb – Mar 2027)</option>
                      {RAMADAN_2027_SCHEDULES.map((b) => (
                        <option key={b.id} value={b.label}>
                          {b.label}: {formatDisplayDate(b.departureDate)} ({b.departureRoute})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#0A224E] hover:bg-[#0F2C67] rounded-lg transition-colors whitespace-nowrap"
                    >
                      View Umrah Packages
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'hotels' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (
                      searchState.hotelCheckIn &&
                      searchState.hotelCheckOut &&
                      searchState.hotelCheckOut <= searchState.hotelCheckIn
                    ) {
                      notify('Check-out date must be after check-in date.', 'error');
                      return;
                    }
                    navigate('/hotels');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
                >
                  <div>
                    <label htmlFor="htl-city" className="block text-xs font-medium text-slate-600 mb-1">
                      Destination City
                    </label>
                    <select
                      id="htl-city"
                      value={searchState.hotelCity}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          hotelCity: e.target.value as typeof searchState.hotelCity,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="All">All Partner Cities</option>
                      <option value="Makkah">Makkah</option>
                      <option value="Madinah">Madinah</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Lagos">Lagos</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="htl-in" className="block text-xs font-medium text-slate-600 mb-1">
                      Check-in
                    </label>
                    <input
                      id="htl-in"
                      type="date"
                      value={searchState.hotelCheckIn}
                      onChange={(e) =>
                        setSearchState((s) => ({ ...s, hotelCheckIn: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="htl-out" className="block text-xs font-medium text-slate-600 mb-1">
                      Check-out
                    </label>
                    <input
                      id="htl-out"
                      type="date"
                      value={searchState.hotelCheckOut}
                      onChange={(e) =>
                        setSearchState((s) => ({ ...s, hotelCheckOut: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="htl-stars" className="block text-xs font-medium text-slate-600 mb-1">
                      Star Rating
                    </label>
                    <select
                      id="htl-stars"
                      value={searchState.hotelStars}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          hotelStars: e.target.value as typeof searchState.hotelStars,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="All">All Ratings (3★ / 4★ / 5★)</option>
                      <option value="3">3★ Quality Hotels</option>
                      <option value="4">4★ Luxury Hotels</option>
                      <option value="5">5★ Haram Courtyard</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#0A224E] hover:bg-[#0F2C67] rounded-lg transition-colors whitespace-nowrap"
                    >
                      Search Hotels
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'visa' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate('/visa-services');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                >
                  <div>
                    <label htmlFor="vsa-country" className="block text-xs font-medium text-slate-600 mb-1">
                      Destination Country
                    </label>
                    <select
                      id="vsa-country"
                      value={searchState.visaCountry}
                      onChange={(e) => {
                        const country = e.target.value;
                        const defaultCat =
                          country === 'UAE (Dubai)'
                            ? 'UAE Dubai Visa'
                            : country === 'United Kingdom'
                              ? 'UK Visa'
                              : country === 'Schengen (Europe)'
                                ? 'Schengen Visa'
                                : 'Umrah Visa';
                        setSearchState((s) => ({
                          ...s,
                          visaCountry: country,
                          visaCategory: defaultCat,
                        }));
                      }}
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="UAE (Dubai)">UAE (Dubai)</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Schengen (Europe)">Schengen (Europe)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vsa-cat" className="block text-xs font-medium text-slate-600 mb-1">
                      Visa Category
                    </label>
                    <select
                      id="vsa-cat"
                      value={searchState.visaCategory}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          visaCategory: e.target.value as typeof searchState.visaCategory,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Umrah Visa">Umrah Visa</option>
                      <option value="Saudi Tourist Visa">Saudi Tourist / Stopover Visa</option>
                      <option value="UAE Dubai Visa">UAE Dubai Visa</option>
                      <option value="UK Visa">UK Standard Visitor</option>
                      <option value="Schengen Visa">Schengen Visitor Visa</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="vsa-speed" className="block text-xs font-medium text-slate-600 mb-1">
                      Processing Speed
                    </label>
                    <select
                      id="vsa-speed"
                      value={searchState.visaSpeed}
                      onChange={(e) =>
                        setSearchState((s) => ({
                          ...s,
                          visaSpeed: e.target.value as typeof searchState.visaSpeed,
                        }))
                      }
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Standard (5-7 Days)">Standard (5–7 Days)</option>
                      <option value="Express (48-72 Hours)">Express (48–72 Hours)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#0A224E] hover:bg-[#0F2C67] rounded-lg transition-colors whitespace-nowrap"
                    >
                      Start Visa Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Ramadan 2027 Umrah Packages */}
      <section className="py-16 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
                Ramadan 2027 Collection · Makkah &amp; Madinah
              </p>
              <h2 className="font-display text-3xl font-bold text-[#0A224E] mt-1">
                Featured Umrah Packages
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/umrah-packages')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A224E] hover:text-[#D4AF37] transition-colors whitespace-nowrap"
            >
              <span>View all packages &amp; 5 schedules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featuredUmrah.map((pkg) => (
              <article
                key={pkg.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <SafeImage
                    src={pkg.coverImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                    fallbackTitle={pkg.title}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs text-slate-500 mb-1.5">
                    <span>{pkg.season}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="font-semibold text-[#0A224E]">{pkg.tier} Tier</span>
                    <span aria-hidden="true"> · </span>
                    <span>{pkg.hotelRating}</span>
                  </div>
                  <div className="min-h-[3.75rem]">
                    <h3 className="font-display text-lg lg:text-[1.1875rem] font-bold text-[#0A224E] leading-snug line-clamp-1">
                      {pkg.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-1">{pkg.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-xs text-slate-500 block">Per Pilgrim</span>
                      <span className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">
                        {formatMoney(pkg.priceNgn, currency)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 text-right">{pkg.distanceToHaram}</span>
                  </div>

                  <ul className="mt-4 space-y-1.5 flex-1">
                    {pkg.inclusions.slice(0, 4).map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0A224E] hover:bg-[#0F2C67] rounded-lg transition-colors"
                    >
                      Select Schedule &amp; Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 5 Flight Schedule Strip */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="text-sm font-bold text-[#0A224E] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Ramadan 2027 Flight Schedule (Kano Departures)</span>
              </h3>
              <span className="text-xs text-slate-500">
                Limited Seats · Book Early or Lock with Installment
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {RAMADAN_2027_SCHEDULES.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <p className="font-bold text-[#0A224E] mb-1">{s.label}</p>
                  <p className="text-slate-700 font-mono">{formatDisplayDate(s.departureDate)}</p>
                  <p className="text-slate-500 mb-1.5">{s.departureRoute}</p>
                  <p className="text-slate-700 font-mono">Ret: {formatDisplayDate(s.returnDate)}</p>
                  <p className="text-slate-500">{s.returnRoute}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: 400+ Umrah Visas Milestone & Haramain Trust Pillars */}
      <section className="py-16 bg-[#061533] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold text-[#F5B800] tracking-wide">
              Verified Operational Track Record
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-white">
              Alhamdulillah! 400+ Umrah Visas Successfully Issued
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              From{' '}
              <span className="text-white font-semibold">1st September to 1st November 2026</span>,
              our Kano desk processed and issued over 400 Umrah visas with complete Saudi Airlines
              ticketing, Makkah &amp; Madinah hotel stays, ground transport, and guided Ziyarat.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[
                { title: 'Trusted Service', desc: 'Your satisfaction is our priority', icon: ShieldCheck },
                { title: 'Experienced Team', desc: 'Dedicated bilingual escorts', icon: Users },
                { title: 'Best Price Guarantee', desc: 'Flexible Naira installments', icon: Award },
                { title: 'Comfortable Journey', desc: 'Direct flights & prime hotels', icon: HeartHandshake },
              ].map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <Icon className="w-5 h-5 text-[#F5B800] mb-2" />
                    <h3 className="text-xs font-bold text-white">{pillar.title}</h3>
                    <p className="text-[11px] text-slate-300 mt-1">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/30 relative aspect-[4/3] bg-[#0A224E]">
              <SafeImage
                src={BRAND_IMAGES.makkahHaram}
                alt="Masjid al-Haram and Holy Kaaba in Makkah"
                className="w-full h-full object-cover"
                fallbackTitle="Masjid al-Haram, Makkah"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
                <p className="text-xs font-mono text-[#F5B800]">Sept – Nov 2026 Milestone</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  Kano → Jeddah &amp; Madinah · Direct Haramain Operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Popular Flight Deals & Haramain Media Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          {/* Popular Flight Deals */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
              <div>
                <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
                  Live Kano &amp; International Fares
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A224E] mt-1">
                  Popular Flight Deals
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/flights')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A224E] hover:text-[#D4AF37]"
              >
                <span>Search all flights</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularFlights.map((flt) => (
                <div
                  key={flt.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between gap-4 hover:border-[#0A224E]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AirlineCrest code={flt.airlineCode} airline={flt.airline} />
                    <div>
                      <p className="text-sm font-bold text-[#0A224E]">
                        {flt.originCity} ({flt.originCode}) → {flt.destinationCity} ({flt.destinationCode})
                      </p>
                      <p className="text-xs text-slate-500">
                        {flt.airline} · {flt.flightNumber} · {flt.stops === 0 ? 'Direct' : `${flt.stops} Stop`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Round-trip fare</span>
                      <span className="font-mono text-lg font-bold text-[#0A224E] tabular-nums">
                        {formatMoney(flt.priceNgn, currency)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        startCheckout({
                          bookingType: 'Flight',
                          itemId: flt.id,
                          itemTitle: `${flt.airline} ${flt.flightNumber} · ${flt.originCity} → ${flt.destinationCity}`,
                          tierOrCabin: flt.cabinClass,
                          departureDate: searchState.departureDate || '2027-02-08',
                          returnDate: searchState.returnDate || '2027-03-06',
                          routeOrLocation: `${flt.originCode} → ${flt.destinationCode}`,
                          unitPriceNgn: flt.priceNgn,
                          passengersCount: 1,
                        })
                      }
                      className="px-4 py-2 text-xs font-semibold bg-[#0A224E] hover:bg-[#0F2C67] text-white rounded-lg transition-colors"
                    >
                      Book Flight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Gallery Preview (Makkah, Madinah, Aviation & Suites) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
              <div>
                <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
                  Makkah, Madinah, Aviation &amp; Suites
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A224E] mt-1">
                  Photo &amp; Video Gallery
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/gallery')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A224E] hover:text-[#D4AF37]"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Open full gallery</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {homeGallery.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate('/gallery')}
                  className="text-left group rounded-2xl border border-slate-200 overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <SafeImage
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackTitle={item.title}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-500">
                      {item.category} · <MapPin className="w-3 h-3 inline text-[#D4AF37]" /> {item.location}
                    </p>
                    <h3 className="text-sm font-bold text-[#0A224E] mt-1 line-clamp-1">{item.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Leadership & About Us Snippet */}
      <section className="py-14 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-[#F8FAFC] to-[#FEF9E7]/45 p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="md:col-span-4 lg:col-span-3">
                <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[260px] md:max-w-none aspect-[4/5] rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-br from-[#0A224E] to-[#061533] shadow-lg">
                  <SafeImage
                    src={BRAND_IMAGES.ceoPortrait}
                    alt="Alh Ja’afar Nasir Sidi — Chief Executive Officer"
                    className="w-full h-full object-cover object-top"
                    fallbackTitle="Alh Ja’afar Nasir Sidi"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#061533]/95 via-[#061533]/25 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-[11px] font-semibold text-[#F5B800]">
                      Chief Executive Officer
                    </p>
                    <p className="font-display text-sm sm:text-base font-bold text-white leading-snug">
                      Alh Ja’afar Nasir Sidi
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-9 space-y-3.5 text-center md:text-left">
                <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
                  About Sidi Travel &amp; Tours Ltd. · Executive Leadership
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A224E] leading-tight">
                  Dedicated Leadership from Kano to Makkah &amp; Madinah
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                  Led by <strong className="font-semibold text-[#0A224E]">Alh Ja’afar Nasir Sidi</strong>,
                  Sidi Travel &amp; Tours Ltd. combines transparent Naira installment plans, verified
                  Haram-proximity hotels, and direct Saudi Airlines flights from Kano with personal
                  on-ground escort care for every pilgrim and traveler.
                </p>
                <div className="pt-1 flex flex-wrap justify-center md:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/about')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#0A224E] hover:bg-[#0F2C67] text-white rounded-lg transition-colors"
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F5B800]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold border border-slate-300 bg-white hover:border-[#0A224E] text-[#0A224E] rounded-lg transition-colors"
                  >
                    <span>Visit Kano Office</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
