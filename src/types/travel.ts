export type Currency = 'NGN' | 'USD';

export type PackageTier = 'Economy' | 'Luxury' | 'Premium';

export type PackageCategory = 'Ramadan Umrah' | 'Regular Umrah' | 'Hajj' | 'Holiday Package';

export interface FlightScheduleBatch {
  id: string;
  label: string; // e.g., "Package 1"
  departureDate: string; // ISO YYYY-MM-DD
  returnDate: string; // ISO YYYY-MM-DD
  departureRoute: string; // e.g., "Kano → Jeddah"
  returnRoute: string; // e.g., "Jeddah → Kano"
  airline: string;
  seatsTotal: number;
  seatsBooked: number;
  escortId?: string;
}

export interface UmrahPackage {
  id: string;
  title: string;
  season: string;
  category: PackageCategory;
  tier: PackageTier;
  subtitle: string;
  priceNgn: number;
  hotelRating: string;
  makkahHotel: string;
  madinahHotel: string;
  distanceToHaram: string;
  description: string;
  inclusions: string[];
  featured: boolean;
  coverImage: string;
  schedules: FlightScheduleBatch[];
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCity?: string;
  cabinClass: 'Economy' | 'Business' | 'First';
  baggage: string;
  priceNgn: number;
  seatsAvailable: number;
}

export interface HotelListing {
  id: string;
  name: string;
  city: 'Makkah' | 'Madinah' | 'Dubai' | 'Abuja' | 'Lagos';
  stars: 3 | 4 | 5;
  proximity: string;
  roomTypes: ('Quad' | 'Triple' | 'Double' | 'Suite')[];
  ratePerNightNgn: number;
  amenities: string[];
  coverImage: string;
  featured: boolean;
}

export type VisaStage =
  | 'Pending Review'
  | 'Processing at Embassy'
  | 'Visa Approved & Issued'
  | 'Re-upload Requested';

export interface VisaDocumentItem {
  type: 'Passport Data Page' | 'Passport Photograph' | 'Yellow Fever Card' | 'NIN Slip';
  fileName: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface VisaApplication {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  country: string;
  category: 'Umrah Visa' | 'Saudi Tourist Visa' | 'UAE Dubai Visa' | 'UK Visa' | 'Schengen Visa';
  processingSpeed: 'Standard (5-7 Days)' | 'Express (48-72 Hours)';
  passportNumber: string;
  stage: VisaStage;
  notes?: string;
  issuedVisaUrl?: string;
  documents: VisaDocumentItem[];
  updatedAt: string;
}

export type PaymentChannel = 'Card' | 'Bank Transfer' | 'USSD' | 'Offline POS / Cash';

export interface PaymentTransaction {
  id: string;
  reference: string;
  amountNgn: number;
  channel: PaymentChannel;
  status: 'Verified' | 'Pending Verification';
  paidAt: string;
  note?: string;
}

export type BookingStatus = 'Confirmed' | 'Part-Paid' | 'Pending Transfer' | 'Cancelled';

export interface BookingRecord {
  id: string;
  reference: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingType: 'Umrah Package' | 'Flight' | 'Hotel' | 'Visa';
  itemId: string;
  itemTitle: string;
  tierOrCabin: string;
  scheduleLabel?: string;
  departureDate: string;
  returnDate?: string;
  routeOrLocation: string;
  passengersCount: number;
  passengers: { fullName: string; passportNumber: string; gender: 'Male' | 'Female' }[];
  totalAmountNgn: number;
  amountPaidNgn: number;
  paymentPlan: 'Full' | 'Installment';
  status: BookingStatus;
  escortName?: string;
  escortPhone?: string;
  hotelSummary?: string;
  transactions: PaymentTransaction[];
  createdAt: string;
}

export type GalleryCategory =
  | 'Makkah & Madinah'
  | 'Pilgrim Departures'
  | 'Hotels & Ziyarat'
  | 'Videos & Reels';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  mediaType: 'photo' | 'video';
  url: string;
  caption: string;
  location: string;
  date: string;
  featuredOnHome: boolean;
}

export interface EscortMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  languages: string;
  assignedBatches: string[];
}

export interface OfficialNotice {
  id: string;
  title: string;
  audience: 'All Pilgrims' | 'All Escorts' | 'Package 1-5 Departures';
  dateLabel: string;
  timeLabel: string;
  venue: string;
  message: string;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  city: string;
}

export interface AppDatabase {
  users: UserAccount[];
  packages: UmrahPackage[];
  flights: FlightOffer[];
  hotels: HotelListing[];
  bookings: BookingRecord[];
  visas: VisaApplication[];
  gallery: GalleryItem[];
  escorts: EscortMember[];
  notices: OfficialNotice[];
  inquiries: ContactInquiry[];
}
