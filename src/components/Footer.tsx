import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_CONTACT } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { SidiLogoEmblem } from './BrandVisuals';

export function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-[#061533] text-slate-300 border-t border-[#D4AF37]/25 no-print">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SidiLogoEmblem className="w-10 h-10 shrink-0" />
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                {BRAND_CONTACT.companyName}
              </h3>
              <p className="text-xs text-[#F5B800]">{BRAND_CONTACT.taglinePrimary}</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {BRAND_CONTACT.taglineSecondary}. Dedicated pilgrim care, direct flights from Kano,
            verified hotels in Makkah &amp; Madinah, and fast-track global visa processing.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Travel Services</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button type="button" onClick={() => navigate('/umrah-packages')} className="hover:text-[#F5B800] transition-colors">
                Ramadan 2027 Umrah Packages
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/flights')} className="hover:text-[#F5B800] transition-colors">
                International Flight Search
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/hotels')} className="hover:text-[#F5B800] transition-colors">
                Makkah &amp; Madinah Hotels
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/visa-services')} className="hover:text-[#F5B800] transition-colors">
                Visa Assistance Portal
              </button>
            </li>
            <li>
              <button type="button" onClick={() => navigate('/gallery')} className="hover:text-[#F5B800] transition-colors">
                Photo &amp; Video Gallery
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Kano Head Office */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white mb-4">Kano Head Office</h4>
          <p className="flex items-start gap-2.5 text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>{BRAND_CONTACT.address}</span>
          </p>
          <p className="flex items-center gap-2.5 text-sm">
            <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <a href={`mailto:${BRAND_CONTACT.email}`} className="hover:text-[#F5B800] transition-colors">
              {BRAND_CONTACT.email}
            </a>
          </p>
          <div className="pt-1 text-xs text-slate-400 space-y-1">
            <p>Instagram: <span className="text-slate-200">{BRAND_CONTACT.instagram}</span></p>
            <p>TikTok: <span className="text-slate-200">{BRAND_CONTACT.tiktok}</span></p>
          </div>
        </div>

        {/* Column 4: Official Phone Lines */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white mb-4">24/7 Booking Desk</h4>
          <div className="grid grid-cols-1 gap-2 text-sm font-mono tabular-nums">
            {BRAND_CONTACT.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-slate-200 hover:text-[#F5B800] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{phone}</span>
              </a>
            ))}
          </div>
          <div className="pt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="px-4 py-2 text-xs font-semibold bg-[#D4AF37] text-[#061533] hover:bg-[#F5B800] rounded-lg transition-colors"
            >
              Contact Kano Desk
            </button>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="px-4 py-2 text-xs font-medium border border-white/20 text-white hover:border-[#D4AF37] rounded-lg transition-colors"
            >
              About Us
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {BRAND_CONTACT.companyName} All rights reserved.</p>
          <p>400+ Umrah Visas Issued · Kano, Nigeria to Makkah &amp; Madinah</p>
        </div>
      </div>
    </footer>
  );
}
