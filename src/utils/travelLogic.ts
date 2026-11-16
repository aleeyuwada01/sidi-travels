import type {
  BookingStatus,
  Currency,
  FlightOffer,
  FlightScheduleBatch,
  PackageTier,
  UmrahPackage,
} from '../types/travel';

export const NGN_PER_USD = 1600;

export function formatMoney(amountNgn: number, currency: Currency): string {
  const safeAmount = Number.isFinite(amountNgn) ? Math.max(0, amountNgn) : 0;
  if (currency === 'USD') {
    const usd = Math.round(safeAmount / NGN_PER_USD);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(usd);
  }
  return `₦${new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(Math.round(safeAmount))}`;
}

export function calculateTaxesAndFees(baseAmountNgn: number): number {
  if (!Number.isFinite(baseAmountNgn) || baseAmountNgn <= 0) return 0;
  // Included airport/service processing fee representation (1.5% capped or fixed flat fee for flights)
  return Math.round(baseAmountNgn * 0.015);
}

export interface InstallmentBreakdown {
  totalAmountNgn: number;
  depositNgn: number;
  remainingBalanceNgn: number;
  percentPaid: number;
  resultingStatus: BookingStatus;
  isValid: boolean;
  error?: string;
}

export function computeInstallmentBreakdown(
  totalAmountNgn: number,
  paymentPlan: 'Full' | 'Installment',
  customDepositNgn: number,
  minimumDepositNgn = 500000
): InstallmentBreakdown {
  if (totalAmountNgn <= 0) {
    return {
      totalAmountNgn: 0,
      depositNgn: 0,
      remainingBalanceNgn: 0,
      percentPaid: 0,
      resultingStatus: 'Cancelled',
      isValid: false,
      error: 'Total amount must be greater than zero.',
    };
  }

  if (paymentPlan === 'Full') {
    return {
      totalAmountNgn,
      depositNgn: totalAmountNgn,
      remainingBalanceNgn: 0,
      percentPaid: 100,
      resultingStatus: 'Confirmed',
      isValid: true,
    };
  }

  const effectiveMin = Math.min(minimumDepositNgn, totalAmountNgn);
  if (!Number.isFinite(customDepositNgn) || customDepositNgn < effectiveMin) {
    return {
      totalAmountNgn,
      depositNgn: customDepositNgn || 0,
      remainingBalanceNgn: totalAmountNgn,
      percentPaid: 0,
      resultingStatus: 'Part-Paid',
      isValid: false,
      error: `Minimum initial deposit is ₦${effectiveMin.toLocaleString('en-NG')}.`,
    };
  }

  if (customDepositNgn > totalAmountNgn) {
    return {
      totalAmountNgn,
      depositNgn: totalAmountNgn,
      remainingBalanceNgn: 0,
      percentPaid: 100,
      resultingStatus: 'Confirmed',
      isValid: false,
      error: 'Deposit cannot exceed total booking cost.',
    };
  }

  const remaining = totalAmountNgn - customDepositNgn;
  const percent = Math.round((customDepositNgn / totalAmountNgn) * 100);
  return {
    totalAmountNgn,
    depositNgn: customDepositNgn,
    remainingBalanceNgn: remaining,
    percentPaid: percent,
    resultingStatus: remaining === 0 ? 'Confirmed' : 'Part-Paid',
    isValid: true,
  };
}

export function generateBookingReference(seed?: number): string {
  const randomNum =
    seed !== undefined
      ? ((Math.abs(Math.floor(seed)) % 9000) + 1000)
      : Math.floor(1000 + Math.random() * 9000);
  return `SIDI-2027-${randomNum}`;
}

export function clampDepositMin(totalAmountNgn: number, minimumNgn: number): number {
  if (!Number.isFinite(totalAmountNgn) || totalAmountNgn <= 0) return 0;
  return Math.min(Math.max(0, minimumNgn), totalAmountNgn);
}

export function deriveAirlineCode(airlineName: string): string {
  const normalized = airlineName.trim().toLowerCase();
  if (normalized.includes('saudi')) return 'SV';
  if (normalized.includes('ethiopian')) return 'ET';
  if (normalized.includes('qatar')) return 'QR';
  if (normalized.includes('egypt')) return 'MS';
  if (normalized.includes('air peace')) return 'P4';
  if (normalized.includes('emirates')) return 'EK';
  if (normalized.includes('turkish')) return 'TK';
  if (normalized.includes('british')) return 'BA';
  const letters = airlineName.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return (letters.slice(0, 2) || 'ST').padEnd(2, 'X');
}

export function computeHotelNights(checkInIso: string, checkOutIso: string, fallbackNights = 7): number {
  const start = new Date(`${checkInIso}T00:00:00Z`).getTime();
  const end = new Date(`${checkOutIso}T00:00:00Z`).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return fallbackNights;
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.min(60, Math.max(1, diff));
}

export function filterUmrahPackages(
  packages: UmrahPackage[],
  filters: {
    tier?: PackageTier | 'All';
    departureAirport?: 'All' | 'Jeddah' | 'Madinah';
    month?: string;
    maxPriceNgn?: number;
    season?: string;
    batchLabel?: string;
  }
): UmrahPackage[] {
  return packages.filter((pkg) => {
    if (filters.tier && filters.tier !== 'All' && pkg.tier !== filters.tier) {
      return false;
    }
    if (filters.season && filters.season !== 'All') {
      const target = filters.season.toLowerCase();
      const matchesSeason =
        pkg.season.toLowerCase().includes(target) ||
        pkg.category.toLowerCase().includes(target);
      if (!matchesSeason) return false;
    }
    if (filters.batchLabel && filters.batchLabel !== 'All') {
      const hasBatch = pkg.schedules.some(
        (s) => s.label.toLowerCase() === filters.batchLabel!.toLowerCase()
      );
      if (!hasBatch) return false;
    }
    if (filters.maxPriceNgn && pkg.priceNgn > filters.maxPriceNgn) {
      return false;
    }
    if (filters.departureAirport && filters.departureAirport !== 'All') {
      const hasRoute = pkg.schedules.some((s) =>
        s.departureRoute.toLowerCase().includes(filters.departureAirport!.toLowerCase())
      );
      if (!hasRoute) return false;
    }
    if (filters.month && filters.month !== 'All') {
      const hasMonth = pkg.schedules.some((s) => s.departureDate.startsWith(filters.month!));
      if (!hasMonth) return false;
    }
    return true;
  });
}

export function filterFlightOffers(
  flights: FlightOffer[],
  filters: {
    originCode?: string;
    destinationCode?: string;
    maxStops?: number | null;
    airline?: string;
    maxPriceNgn?: number;
    cabinClass?: string;
  }
): FlightOffer[] {
  return flights.filter((f) => {
    if (filters.originCode && filters.originCode !== 'ALL' && f.originCode !== filters.originCode) {
      return false;
    }
    if (
      filters.destinationCode &&
      filters.destinationCode !== 'ALL' &&
      f.destinationCode !== filters.destinationCode
    ) {
      return false;
    }
    if (filters.maxStops !== null && filters.maxStops !== undefined && f.stops > filters.maxStops) {
      return false;
    }
    if (filters.airline && filters.airline !== 'All' && f.airline !== filters.airline) {
      return false;
    }
    if (filters.maxPriceNgn && f.priceNgn > filters.maxPriceNgn) {
      return false;
    }
    if (filters.cabinClass && filters.cabinClass !== 'All' && f.cabinClass !== filters.cabinClass) {
      return false;
    }
    return true;
  });
}

export function getSeatsRemaining(batch: FlightScheduleBatch): number {
  return Math.max(0, batch.seatsTotal - batch.seatsBooked);
}

export function getDaysUntilDeparture(departureDateIso: string, fromDate = new Date()): number {
  const target = new Date(`${departureDateIso}T00:00:00Z`).getTime();
  const base = Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate());
  if (Number.isNaN(target)) return 0;
  return Math.max(0, Math.ceil((target - base) / (1000 * 60 * 60 * 24)));
}

export function formatDisplayDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export interface AdminPilgrimRegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  packagePriceNgn: number;
  pilgrimsCount: number;
  paymentPlan: 'Full' | 'Installment';
  initialPaymentNgn: number;
}

export interface AdminPilgrimRegistrationResult {
  isValid: boolean;
  error?: string;
  totalAmountNgn: number;
  amountPaidNgn: number;
  status: BookingStatus;
}

export function validateAdminPilgrimRegistration(
  input: AdminPilgrimRegistrationInput
): AdminPilgrimRegistrationResult {
  const count = Math.max(1, Math.floor(Number(input.pilgrimsCount) || 1));
  const totalAmountNgn = Math.max(0, Number(input.packagePriceNgn) || 0) * count;
  const rawPaid =
    input.paymentPlan === 'Full'
      ? totalAmountNgn
      : Math.max(0, Number(input.initialPaymentNgn) || 0);
  const amountPaidNgn = Math.min(totalAmountNgn, rawPaid);

  const status: BookingStatus =
    totalAmountNgn <= 0
      ? 'Cancelled'
      : amountPaidNgn >= totalAmountNgn
        ? 'Confirmed'
        : amountPaidNgn > 0
          ? 'Part-Paid'
          : 'Pending Transfer';

  if (!input.fullName.trim() || !input.email.trim() || !input.phone.trim()) {
    return {
      isValid: false,
      error: 'Pilgrim full name, email, and phone number are required.',
      totalAmountNgn,
      amountPaidNgn,
      status,
    };
  }

  if (!input.passportNumber.trim() || input.passportNumber.trim().length < 5) {
    return {
      isValid: false,
      error: 'Enter a valid International Passport number (at least 5 characters).',
      totalAmountNgn,
      amountPaidNgn,
      status,
    };
  }

  if (totalAmountNgn <= 0) {
    return {
      isValid: false,
      error: 'Selected package must have a valid price.',
      totalAmountNgn: 0,
      amountPaidNgn: 0,
      status: 'Cancelled',
    };
  }

  return {
    isValid: true,
    totalAmountNgn,
    amountPaidNgn,
    status,
  };
}
