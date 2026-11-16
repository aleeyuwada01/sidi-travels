import React, { useMemo, useState } from 'react';
import { Building2, Check, MapPin, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { HotelListing } from '../types/travel';
import { computeHotelNights, formatMoney } from '../utils/travelLogic';
import { SafeImage } from '../components/BrandVisuals';

export function HotelsPage() {
  const { db, currency, searchState, startCheckout } = useApp();

  const [city, setCity] = useState<'All' | HotelListing['city']>(
    searchState.hotelCity || 'All'
  );
  const [stars, setStars] = useState<'All' | '3' | '4' | '5'>(searchState.hotelStars || 'All');
  const [selectedRoomByHotel, setSelectedRoomByHotel] = useState<Record<string, string>>({});
  const defaultNights = useMemo(
    () => computeHotelNights(searchState.hotelCheckIn, searchState.hotelCheckOut, 7),
    [searchState.hotelCheckIn, searchState.hotelCheckOut]
  );
  const [nightsByHotel, setNightsByHotel] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    return db.hotels.filter((h) => {
      if (city !== 'All' && h.city !== city) return false;
      if (stars !== 'All' && String(h.stars) !== stars) return false;
      return true;
    });
  }, [db.hotels, city, stars]);

  const handleReserve = (hotel: HotelListing) => {
    const roomType = selectedRoomByHotel[hotel.id] || hotel.roomTypes[0] || 'Double';
    const nights = nightsByHotel[hotel.id] || defaultNights;
    const multiplier = roomType === 'Suite' ? 1.45 : roomType === 'Double' ? 1.15 : 1;
    const unitNightly = Math.round(hotel.ratePerNightNgn * multiplier);
    const checkIn = searchState.hotelCheckIn || '2027-02-08';
    const checkOutDate = new Date(`${checkIn}T00:00:00Z`);
    checkOutDate.setUTCDate(checkOutDate.getUTCDate() + nights);
    const computedOut = Number.isNaN(checkOutDate.getTime())
      ? searchState.hotelCheckOut || '2027-02-15'
      : checkOutDate.toISOString().slice(0, 10);

    startCheckout({
      bookingType: 'Hotel',
      itemId: hotel.id,
      itemTitle: `${hotel.name} (${nights} Nights)`,
      tierOrCabin: `${hotel.stars}★ · ${roomType} Room`,
      departureDate: checkIn,
      returnDate: computedOut,
      routeOrLocation: `${hotel.city} · ${hotel.proximity}`,
      unitPriceNgn: unitNightly * nights,
      passengersCount: 1,
      hotelSummary: `${hotel.name} — ${roomType} (${nights} nights)`,
    });
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
            Verified 3★, 4★ &amp; 5★ Partner Accommodations
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A224E] mt-1">
            Makkah, Madinah &amp; Global Hotels
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Stay steps away from Masjid al-Haram and Masjid an-Nabawi, or reserve verified executive
            hotels in Dubai, Abuja, and Lagos.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Makkah', 'Madinah', 'Dubai', 'Abuja', 'Lagos'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  city === c
                    ? 'bg-[#0A224E] text-white border-[#0A224E]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {c === 'All' ? 'All Cities' : c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="htl-star-filter" className="text-xs font-medium text-slate-600">
              Rating:
            </label>
            <select
              id="htl-star-filter"
              value={stars}
              onChange={(e) => setStars(e.target.value as typeof stars)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="All">All Ratings (3★–5★)</option>
              <option value="5">5★ Luxury</option>
              <option value="4">4★ Comfort</option>
              <option value="3">3★ Economy</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#0A224E]">
              No hotels found for this city and star filter
            </p>
            <button
              type="button"
              onClick={() => {
                setCity('All');
                setStars('All');
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold bg-[#0A224E] text-white rounded-lg"
            >
              View All Hotels
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hotel) => {
              const roomType = selectedRoomByHotel[hotel.id] || hotel.roomTypes[0];
              const nights = nightsByHotel[hotel.id] || defaultNights;
              const nightOptions = Array.from(new Set([3, 5, 7, 10, 14, defaultNights])).sort(
                (a, b) => a - b
              );
              return (
                <article
                  key={hotel.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                      <SafeImage
                        src={hotel.coverImage}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        fallbackTitle={hotel.name}
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0A224E]">{hotel.city}</span>
                        <span className="inline-flex items-center gap-0.5 text-[#D4AF37]" aria-label={`${hotel.stars} stars`}>
                          {Array.from({ length: hotel.stars }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </span>
                      </div>

                      <h2 className="font-display text-lg font-bold text-[#0A224E]">{hotel.name}</h2>
                      <p className="text-xs text-slate-600 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{hotel.proximity}</span>
                      </p>

                      <ul className="space-y-1 pt-1">
                        {hotel.amenities.slice(0, 3).map((a) => (
                          <li key={a} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Room Type</label>
                        <select
                          value={roomType}
                          onChange={(e) =>
                            setSelectedRoomByHotel((prev) => ({
                              ...prev,
                              [hotel.id]: e.target.value,
                            }))
                          }
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                        >
                          {hotel.roomTypes.map((rt) => (
                            <option key={rt} value={rt}>
                              {rt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Nights</label>
                        <select
                          value={nights}
                          onChange={(e) =>
                            setNightsByHotel((prev) => ({
                              ...prev,
                              [hotel.id]: Number(e.target.value),
                            }))
                          }
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white font-mono"
                        >
                          {nightOptions.map((n) => (
                            <option key={n} value={n}>
                              {n} Nights
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Nightly rate</span>
                        <span className="font-mono text-lg font-bold text-[#0A224E] tabular-nums">
                          {formatMoney(hotel.ratePerNightNgn, currency)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleReserve(hotel)}
                        className="px-4 py-2 text-xs font-semibold bg-[#0A224E] hover:bg-[#0F2C67] text-white rounded-lg transition-colors"
                      >
                        Reserve Room
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
