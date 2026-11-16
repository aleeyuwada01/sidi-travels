import React from 'react';
import { Award, Calendar, MapPin, Phone, ShieldCheck, Users } from 'lucide-react';
import { BRAND_CONTACT, BRAND_IMAGES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/BrandVisuals';

export function AboutPage() {
  const { db, navigate } = useApp();

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        {/* Story Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
              About {BRAND_CONTACT.companyName}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A224E] leading-tight">
              Your Trusted Travel Partner for Hajj, Umrah &amp; Global Aviation
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Headquartered at Shopping Complex Plaza, Opposite Ado Bayero Mall on Zoo Road in Kano
              State, Sidi Travel &amp; Tours Ltd. combines deep pilgrimage hospitality with modern
              online booking convenience. From economy group departures to 5-star Haram Courtyard VIP
              stays, every pilgrim receives personal care from Kano to Makkah and Madinah.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Award className="w-5 h-5 text-[#D4AF37] mb-2" />
                <p className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">400+</p>
                <p className="text-xs text-slate-600">Umrah Visas Issued (Sept–Nov 2026)</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Users className="w-5 h-5 text-[#D4AF37] mb-2" />
                <p className="font-mono text-2xl font-bold text-[#0A224E] tabular-nums">5 Batches</p>
                <p className="text-xs text-slate-600">Ramadan 2027 Direct Kano Schedules</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] mb-2" />
                <p className="font-mono text-2xl font-bold text-[#0A224E]">100%</p>
                <p className="text-xs text-slate-600">Guided Ziyarat &amp; Escort Support</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/3]">
            <SafeImage
              src={BRAND_IMAGES.madinahNabawi}
              alt="Masjid an-Nabawi in Madinah"
              className="w-full h-full object-cover"
              fallbackTitle={BRAND_CONTACT.companyName}
            />
          </div>
        </section>

        {/* Executive Leadership: Founder & CEO Spotlight */}
        <section
          aria-labelledby="ceo-leadership-heading"
          className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-[#F8FAFC] via-white to-[#FEF9E7]/45 p-6 sm:p-8 lg:p-10 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-gradient-to-br from-[#0A224E] to-[#061533] shadow-xl">
                <SafeImage
                  src={BRAND_IMAGES.ceoPortrait}
                  alt="Alh Ja’afar Nasir Sidi — Chief Executive Officer, Sidi Travel & Tours Ltd."
                  className="w-full h-full object-cover object-top"
                  fallbackTitle="Alh Ja’afar Nasir Sidi"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#061533]/95 via-[#061533]/25 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0A224E]/20 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                  <p className="text-xs font-semibold text-[#F5B800] tracking-wide">
                    Founder &amp; Chief Executive Officer
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Alh Ja’afar Nasir Sidi
                  </h2>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
                Executive Leadership · Kano to the Haramain
              </p>
              <h2
                id="ceo-leadership-heading"
                className="font-display text-2xl sm:text-3xl font-bold text-[#0A224E] leading-tight"
              >
                Meet Alh Ja’afar Nasir Sidi
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                As Chief Executive Officer of Sidi Travel &amp; Tours Ltd.,{' '}
                <strong className="font-semibold text-[#0A224E]">Alh Ja’afar Nasir Sidi</strong>{' '}
                leads our operations from Kano State with a singular commitment: delivering honest,
                dignified, and stress-free pilgrimage and international travel for every Nigerian
                family.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Under his hands-on leadership, our team personally oversees Saudi Airlines seat
                allocations, close-proximity hotels in Makkah and Madinah, transparent Naira
                installment plans, and timely visa issuance—backed by our recent milestone of 400+
                Umrah visas issued between September and November 2026.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200/90">
                  <p className="text-xs font-bold text-[#0A224E]">Pilgrim-First Accountability</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Direct Kano Head Office support and on-ground Haramain escort supervision.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200/90">
                  <p className="text-xs font-bold text-[#0A224E]">Transparent Pricing</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Clear Economy, Luxury, and Premium VIP tiers with flexible installment locking.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/umrah-packages')}
                  className="px-5 py-2.5 text-xs font-semibold bg-[#0A224E] hover:bg-[#0F2C67] text-white rounded-lg transition-colors"
                >
                  Explore Ramadan 2027 Packages
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="px-5 py-2.5 text-xs font-semibold border border-slate-300 bg-white hover:border-[#0A224E] text-[#0A224E] rounded-lg transition-colors"
                >
                  Contact Kano Head Office
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Escort & Leadership Structure */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
                Pilgrim Welfare &amp; Field Operations
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0A224E] mt-1">
                Dedicated Escort &amp; Guidance Team
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/umrah-packages')}
              className="px-4 py-2 text-xs font-semibold bg-[#0A224E] text-white rounded-lg"
            >
              Book with Our Team
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {db.escorts.map((esc) => (
              <div key={esc.id} className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-2.5">
                <h3 className="font-display text-lg font-bold text-[#0A224E]">{esc.name}</h3>
                <p className="text-xs font-medium text-slate-600">{esc.role}</p>
                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                  <p className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{esc.phone}</span>
                  </p>
                  <p>Languages: {esc.languages}</p>
                  <p>Batches: {esc.assignedBatches.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Official Notice Board */}
        <section className="bg-[#061533] text-white rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#F5B800] tracking-wide">
                Management Bulletins
              </p>
              <h2 className="font-display text-2xl font-bold mt-1">Official Notices &amp; Briefings</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {db.notices.map((notice) => (
              <div key={notice.id} className="p-5 rounded-xl bg-white/5 border border-white/15 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#F5B800]">
                  <span className="font-semibold">{notice.audience}</span>
                  <span className="font-mono">{notice.dateLabel}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">{notice.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{notice.message}</p>
                <div className="pt-2 border-t border-white/10 text-xs text-slate-300 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Time: {notice.timeLabel}</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{notice.venue}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
