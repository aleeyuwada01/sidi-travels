import React, { useState } from 'react';
import { Building2, Compass, Plane } from 'lucide-react';

export function SidiLogoEmblem({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="29" fill="#0A224E" stroke="#D4AF37" strokeWidth="3" />
      <circle cx="32" cy="32" r="21" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="3 3" />
      <ellipse cx="32" cy="32" rx="10" ry="21" stroke="#F5B800" strokeWidth="1.4" />
      <line x1="11" y1="32" x2="53" y2="32" stroke="#F5B800" strokeWidth="1.4" />
      <path
        d="M16 44C24 24 38 14 52 12"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M45 9L54 11L49 18L47 14L45 9Z"
        fill="#F5B800"
      />
    </svg>
  );
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0A224E] to-[#0F2C67] text-white p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Compass className="w-8 h-8 text-[#D4AF37] mb-2" />
        <p className="text-sm font-medium text-white/90">{fallbackTitle || alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}

export function HaramainHeroArtwork() {
  return (
    <svg
      viewBox="0 0 800 520"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
      aria-label="Architectural illustration of Makkah Clock Tower, the Kaaba, Masjid an-Nabawi Green Dome, and international flight path"
    >
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="800" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#061533" />
          <stop offset="55%" stopColor="#0A224E" />
          <stop offset="100%" stopColor="#0F2C67" />
        </linearGradient>
        <linearGradient id="goldGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5B800" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="sunHalo" cx="0.72" cy="0.32" r="0.45">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0A224E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="520" fill="url(#heroSky)" />
      <rect width="800" height="520" fill="url(#sunHalo)" />

      {/* Subtle geometric stars */}
      <circle cx="110" cy="80" r="1.5" fill="#F5B800" fillOpacity="0.7" />
      <circle cx="240" cy="54" r="2" fill="#FFFFFF" fillOpacity="0.4" />
      <circle cx="430" cy="70" r="1.5" fill="#F5B800" fillOpacity="0.6" />
      <circle cx="690" cy="95" r="2" fill="#FFFFFF" fillOpacity="0.5" />

      {/* Golden Crescent */}
      <path
        d="M625 64C596 64 573 87 573 116C573 145 596 168 625 168C637 168 648 164 657 157C649 160 640 161 631 159C607 153 593 128 599 104C604 84 622 70 642 68C637 65 631 64 625 64Z"
        fill="url(#goldGlow)"
      />

      {/* Flight trajectory arc */}
      <path
        d="M65 190C195 105 385 88 530 142"
        stroke="#D4AF37"
        strokeWidth="2"
        strokeDasharray="6 6"
        strokeOpacity="0.75"
      />
      {/* Jetliner silhouette */}
      <g transform="translate(515, 126) rotate(15)">
        <path d="M0 10L34 4L42 8L34 14L0 10Z" fill="#FFFFFF" />
        <path d="M14 8L24 -4L29 -3L22 7Z" fill="#F5B800" />
        <path d="M13 12L21 22L26 21L20 11Z" fill="#F5B800" />
      </g>

      {/* Makkah Royal Clock Tower */}
      <rect x="468" y="160" width="64" height="250" fill="#13336D" stroke="#D4AF37" strokeOpacity="0.35" />
      <rect x="484" y="112" width="32" height="48" fill="#183D80" />
      <polygon points="500,66 490,112 510,112" fill="#D4AF37" />
      <circle cx="500" cy="196" r="18" fill="#061533" stroke="#F5B800" strokeWidth="2.5" />
      <line x1="500" y1="196" x2="500" y2="184" stroke="#F5B800" strokeWidth="2" />
      <line x1="500" y1="196" x2="509" y2="196" stroke="#FFFFFF" strokeWidth="1.5" />

      {/* Masjid an-Nabawi Green Dome & Minarets (Left) */}
      <rect x="115" y="250" width="16" height="160" fill="#13336D" />
      <polygon points="123,222 115,250 131,250" fill="#D4AF37" />
      <path d="M150 355C150 315 182 285 215 285C248 285 280 315 280 355V410H150V355Z" fill="#0F6B43" />
      <path d="M168 355C168 328 190 306 215 306C240 306 262 328 262 355" stroke="#D4AF37" strokeOpacity="0.5" strokeWidth="1.5" />
      <rect x="128" y="355" width="190" height="55" fill="#123066" />

      {/* Masjid al-Haram Arches & Kaaba (Right-Center) */}
      <rect x="330" y="345" width="390" height="65" fill="#0D2757" />
      <rect x="430" y="275" width="110" height="115" fill="#090D16" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Gold Kiswah Band */}
      <rect x="430" y="302" width="110" height="14" fill="#D4AF37" />
      <rect x="466" y="330" width="18" height="32" fill="#D4AF37" fillOpacity="0.85" />

      {/* Haramain Courtyard Ground */}
      <rect x="0" y="410" width="800" height="110" fill="#061533" />
      <line x1="0" y1="410" x2="800" y2="410" stroke="#D4AF37" strokeWidth="2" strokeOpacity="0.7" />
    </svg>
  );
}

export function HotelLandmarkBadge({ city }: { city: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
      <Building2 className="w-3.5 h-3.5 text-[#0A224E]" />
      <span>{city}</span>
    </div>
  );
}

export function AirlineCrest({ code, airline }: { code: string; airline: string }) {
  const palette: Record<string, string> = {
    SV: 'bg-emerald-900 text-amber-300',
    ET: 'bg-emerald-800 text-yellow-300',
    QR: 'bg-rose-950 text-amber-200',
    MS: 'bg-[#0A224E] text-[#F5B800]',
    P4: 'bg-blue-900 text-white',
  };
  const cls = palette[code] || 'bg-[#0A224E] text-white';

  return (
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-mono text-sm font-semibold shrink-0 ${cls}`} title={airline}>
      <Plane className="w-3.5 h-3.5 mr-0.5 opacity-75" />
      <span>{code}</span>
    </div>
  );
}
