import React, { useEffect, useState } from 'react';
import { CheckCircle2, FileCheck2, ShieldCheck, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { VisaApplication, VisaDocumentItem } from '../types/travel';

const VISA_GUIDES: {
  country: string;
  category: VisaApplication['category'];
  timeline: string;
  feeNgn: string;
  notes: string;
}[] = [
  {
    country: 'Saudi Arabia',
    category: 'Umrah Visa',
    timeline: '48–72 Hours (Express) / 5 Days',
    feeNgn: '₦420,000 (Included in Umrah Packages)',
    notes: 'Requires valid Nigerian International Passport (6+ months), Yellow Fever Card, and Saudi Bio App biometrics.',
  },
  {
    country: 'Saudi Arabia',
    category: 'Saudi Tourist Visa',
    timeline: '3–5 Business Days',
    feeNgn: '₦480,000',
    notes: 'Multiple-entry 1-year e-visa allowing Umrah performance outside Hajj season.',
  },
  {
    country: 'UAE (Dubai)',
    category: 'UAE Dubai Visa',
    timeline: '3–5 Business Days',
    feeNgn: '₦395,000 (30 Days Single Entry)',
    notes: 'Includes hotel/flight confirmation support and return ticket itinerary.',
  },
  {
    country: 'United Kingdom',
    category: 'UK Visa',
    timeline: '15 Working Days',
    feeNgn: 'Advisory & Filing Support from ₦250,000',
    notes: 'Full DS-160/UKVI application review, bank statement audit, and TLScontact appointment scheduling.',
  },
  {
    country: 'Schengen (Europe)',
    category: 'Schengen Visa',
    timeline: '15–21 Working Days',
    feeNgn: 'Advisory & Filing Support from ₦250,000',
    notes: 'Travel insurance, verified hotel reservations, and embassy interview preparation.',
  },
];

const CHECKLIST_ITEMS = [
  'International Passport (Minimum 6 months validity from travel date)',
  'Recent White-Background Passport Photograph (2×2 inches)',
  'Valid Yellow Fever Vaccination Certificate (International Health Card)',
  'National Identification Number (NIN) Slip or Card',
];

function findGuideIndex(category: string, country: string): number {
  const byCategory = VISA_GUIDES.findIndex((g) => g.category === category);
  if (byCategory >= 0) return byCategory;
  const byCountry = VISA_GUIDES.findIndex((g) => g.country === country);
  return byCountry >= 0 ? byCountry : 0;
}

export function VisaServicesPage() {
  const { currentUser, searchState, submitVisaApplication, navigate, notify } = useApp();

  const [selectedGuideIdx, setSelectedGuideIdx] = useState(() =>
    findGuideIndex(searchState.visaCategory, searchState.visaCountry)
  );
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.email || '');
  const [applicantPhone, setApplicantPhone] = useState(currentUser?.phone || '');
  const [passportNumber, setPassportNumber] = useState('');
  const [processingSpeed, setProcessingSpeed] = useState<VisaApplication['processingSpeed']>(
    searchState.visaSpeed || 'Standard (5-7 Days)'
  );
  const [uploadedDocs, setUploadedDocs] = useState<VisaDocumentItem[]>([]);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setApplicantName((prev) => prev || currentUser.name);
      setApplicantEmail((prev) => prev || currentUser.email);
      setApplicantPhone((prev) => prev || currentUser.phone);
    }
  }, [currentUser]);

  const activeGuide = VISA_GUIDES[selectedGuideIdx];

  const handleFileUpload = (
    docType: VisaDocumentItem['type'],
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      setUploadedDocs((prev) => [
        ...prev.filter((d) => d.type !== docType),
        {
          type: docType,
          fileName: file.name,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        },
      ]);
      notify(`Attached ${file.name}`, 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passportNumber.trim().length < 5) {
      notify('Enter a valid International Passport number (at least 5 characters).', 'error');
      return;
    }
    setBusy(true);
    const created = await submitVisaApplication({
      userId: currentUser?.id || 'user-demo-1',
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      applicantPhone: applicantPhone.trim(),
      country: activeGuide.country,
      category: activeGuide.category,
      processingSpeed,
      passportNumber: passportNumber.trim().toUpperCase(),
      documents: uploadedDocs,
    });
    setBusy(false);
    if (created) {
      setSubmittedRef(created.id);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div>
          <p className="text-xs font-semibold text-[#0F2C67] tracking-wide">
            400+ Umrah Visas Successfully Issued · Sept – Nov 2026
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0A224E] mt-1">
            Visa Assistance &amp; Application Portal
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Select your destination visa category, verify your document checklist, and submit your
            online application directly to our Kano processing desk.
          </p>
        </div>

        {/* Country Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {VISA_GUIDES.map((guide, idx) => {
            const active = idx === selectedGuideIdx;
            return (
              <button
                key={guide.category}
                type="button"
                onClick={() => setSelectedGuideIdx(idx)}
                className={`text-left p-4 rounded-xl border transition-colors ${
                  active
                    ? 'bg-[#0A224E] text-white border-[#0A224E]'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#0A224E]/40'
                }`}
              >
                <p className={`text-[11px] font-medium ${active ? 'text-[#F5B800]' : 'text-slate-500'}`}>
                  {guide.country}
                </p>
                <h2 className="text-sm font-bold mt-1">{guide.category}</h2>
                <p className={`text-xs mt-2 ${active ? 'text-slate-200' : 'text-slate-600'}`}>
                  {guide.timeline}
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Selected Guide & Interactive Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-display text-xl font-bold text-[#0A224E]">
                  {activeGuide.category} Requirements
                </h2>
              </div>
              <div className="text-xs space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p>
                  <span className="font-semibold text-[#0A224E]">Processing Window:</span>{' '}
                  {activeGuide.timeline}
                </p>
                <p>
                  <span className="font-semibold text-[#0A224E]">Indicative Fee:</span>{' '}
                  <span className="font-mono">{activeGuide.feeNgn}</span>
                </p>
                <p className="text-slate-600 pt-1">{activeGuide.notes}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#0A224E] mb-2.5">
                  Interactive Pre-Submission Document Checklist
                </h3>
                <div className="space-y-2">
                  {CHECKLIST_ITEMS.map((item) => (
                    <label
                      key={item}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 text-xs text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checkedDocs[item])}
                        onChange={(e) =>
                          setCheckedDocs((prev) => ({ ...prev, [item]: e.target.checked }))
                        }
                        className="mt-0.5 accent-[#0A224E]"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Online Visa Application Wizard */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7">
            {submittedRef ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h2 className="font-display text-2xl font-bold text-[#0A224E]">
                  Visa Application Received
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your {activeGuide.category} application ({submittedRef}) is now in our Kano Visa
                  Desk queue. Track live embassy progress in your Pilgrim Dashboard.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 text-xs font-semibold bg-[#0A224E] text-white rounded-lg"
                  >
                    Track in Pilgrim Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="px-5 py-2.5 text-xs font-semibold border border-slate-300 text-slate-700 rounded-lg"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#0A224E]">
                      Start Online Visa Application
                    </h2>
                    <p className="text-xs text-slate-500">
                      Applying for {activeGuide.country} — {activeGuide.category}
                    </p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="v-name" className="block text-xs font-medium text-slate-700 mb-1">
                      Applicant Full Name (as on Passport)
                    </label>
                    <input
                      id="v-name"
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Alhaji Ibrahim Musa"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="v-pass" className="block text-xs font-medium text-slate-700 mb-1">
                      International Passport Number
                    </label>
                    <input
                      id="v-pass"
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                      placeholder="B50294812"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="v-email" className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="v-email"
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="v-phone" className="block text-xs font-medium text-slate-700 mb-1">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      id="v-phone"
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="08035926442"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="v-speed" className="block text-xs font-medium text-slate-700 mb-1">
                    Processing Speed
                  </label>
                  <select
                    id="v-speed"
                    value={processingSpeed}
                    onChange={(e) =>
                      setProcessingSpeed(e.target.value as VisaApplication['processingSpeed'])
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Standard (5-7 Days)">Standard (5–7 Days)</option>
                    <option value="Express (48-72 Hours)">Express (48–72 Hours)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Upload Supporting Documents (Optional here — can also upload later in Dashboard)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        'Passport Data Page',
                        'Passport Photograph',
                        'Yellow Fever Card',
                        'NIN Slip',
                      ] as const
                    ).map((docType) => {
                      const existing = uploadedDocs.find((d) => d.type === docType);
                      return (
                        <label
                          key={docType}
                          className="flex items-center justify-between gap-2 p-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs"
                        >
                          <span className="truncate font-medium text-slate-700">
                            {existing ? `✓ ${existing.fileName}` : docType}
                          </span>
                          <Upload className="w-4 h-4 text-[#0A224E] shrink-0" />
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(docType, e)}
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 text-sm font-semibold bg-[#0A224E] hover:bg-[#0F2C67] text-white rounded-lg transition-colors"
                >
                  {busy ? 'Submitting Application...' : `Submit ${activeGuide.category} Application`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
