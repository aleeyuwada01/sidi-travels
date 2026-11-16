import React, { useEffect, useState } from 'react';
import { Building2, Calendar, Check, MapPin, Plane, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDisplayDate, formatMoney, getSeatsRemaining } from '../utils/travelLogic';
import { SafeImage } from './BrandVisuals';

export function PackageDetailModal() {
  const { db, selectedPackageId, setSelectedPackageId, currency, startCheckout } = useApp();
  const pkg = db.packages.find((p) => p.id === selectedPackageId) || null;

  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [travelers, setTravelers] = useState(1);

  useEffect(() => {
    if (pkg && pkg.schedules.length > 0) {
      setSelectedScheduleId(pkg.schedules[0].id);
      setTravelers(1);
    }
  }, [pkg]);

  if (!pkg) return null;

  const activeSchedule =
    pkg.schedules.find((s) => s.id === selectedScheduleId) || pkg.schedules[0];
  const seatsLeft = activeSchedule ? getSeatsRemaining(activeSchedule) : 10;

  const handleBook = (planHint: 'Full' | 'Installment') => {
    if (!activeSchedule) return;
    startCheckout({
      bookingType: 'Umrah Package',
      itemId: pkg.id,
      itemTitle: pkg.title,
      tierOrCabin: `${pkg.tier} (${pkg.hotelRating})`,
      scheduleId: activeSchedule.id,
      scheduleLabel: `${activeSchedule.label} (${formatDisplayDate(activeSchedule.departureDate)} – ${formatDisplayDate(activeSchedule.returnDate)})`,
      departureDate: activeSchedule.departureDate,
      returnDate: activeSchedule.returnDate,
      routeOrLocation: `${activeSchedule.departureRoute} · ${activeSchedule.returnRoute}`,
      unitPriceNgn: pkg.priceNgn,
      passengersCount: travelers,
      hotelSummary: `${pkg.makkahHotel} & ${pkg.madinahHotel}`,
      existingRemainingNgn: planHint === 'Installment' ? 1 : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pkg-detail-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#0A224E] text-white shrink-0">
          <div>
            <p className="text-xs text-[#F5B800] font-medium">
              {pkg.season} · {pkg.tier} Tier
            </p>
            <h2 id="pkg-detail-title" className="font-display text-xl font-bold">
              {pkg.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPackageId(null)}
            aria-label="Close package details"
            className="p-2 text-slate-300 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-60 md:h-auto">
              <SafeImage
                src={pkg.coverImage}
                alt={pkg.title}
                className="w-full h-full object-cover"
                fallbackTitle={pkg.title}
              />
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-500">Per Pilgrim Rate</span>
                  <p className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">
                    {formatMoney(pkg.priceNgn, currency)}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {pkg.hotelRating} · {pkg.distanceToHaram}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{pkg.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-1.5 font-semibold text-[#0A224E] mb-1">
                    <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Makkah Hotel</span>
                  </div>
                  <p className="text-slate-700">{pkg.makkahHotel}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-1.5 font-semibold text-[#0A224E] mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Madinah Hotel</span>
                  </div>
                  <p className="text-slate-700">{pkg.madinahHotel}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-800 mb-2">Package Inclusions</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {pkg.inclusions.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 5 Flight Schedule Selector */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold text-[#0A224E] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>Select Departure Flight Schedule</span>
              </h3>
              <span className="text-xs font-mono text-amber-700 font-medium tabular-nums">
                Limited Seats · {seatsLeft} seats left on selected batch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pkg.schedules.map((sched) => {
                const selected = sched.id === activeSchedule?.id;
                const remaining = getSeatsRemaining(sched);
                return (
                  <button
                    key={sched.id}
                    type="button"
                    onClick={() => setSelectedScheduleId(sched.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      selected
                        ? 'border-[#0A224E] bg-[#0A224E]/5 ring-1 ring-[#0A224E]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#0A224E]">{sched.label}</span>
                      <span className="text-[11px] font-mono text-slate-600 tabular-nums">
                        {remaining} left
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-700">
                      <p className="flex items-center gap-1.5">
                        <Plane className="w-3 h-3 text-[#D4AF37]" />
                        <span className="font-medium">Dep:</span> {formatDisplayDate(sched.departureDate)} ({sched.departureRoute})
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Plane className="w-3 h-3 text-slate-400 rotate-180" />
                        <span className="font-medium">Ret:</span> {formatDisplayDate(sched.returnDate)} ({sched.returnRoute})
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Users className="w-4 h-4 text-[#0A224E]" />
              <span>Pilgrims</span>
              <select
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-xs"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-right sm:text-left">
              <span className="block text-[11px] text-slate-500">Total Package Fare</span>
              <span className="font-mono text-base font-bold text-[#0A224E] tabular-nums">
                {formatMoney(pkg.priceNgn * travelers, currency)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleBook('Installment')}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-[#0A224E] bg-[#F5B800]/20 hover:bg-[#F5B800]/35 border border-[#D4AF37] rounded-lg transition-colors whitespace-nowrap"
            >
              Pay in Installments
            </button>
            <button
              type="button"
              onClick={() => handleBook('Full')}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-semibold text-white bg-[#0A224E] hover:bg-[#0F2C67] rounded-lg transition-colors whitespace-nowrap"
            >
              Book Full Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
