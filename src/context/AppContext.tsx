import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createSeedDatabase } from '../data/seedData';
import type {
  AppDatabase,
  BookingRecord,
  ContactInquiry,
  Currency,
  EscortMember,
  FlightOffer,
  GalleryItem,
  OfficialNotice,
  PaymentChannel,
  UmrahPackage,
  UserAccount,
  VisaApplication,
  VisaDocumentItem,
  VisaStage,
} from '../types/travel';

export type AppRoute =
  | '/'
  | '/umrah-packages'
  | '/flights'
  | '/hotels'
  | '/visa-services'
  | '/gallery'
  | '/about'
  | '/contact'
  | '/checkout'
  | '/dashboard'
  | '/admin';

export interface CheckoutDraft {
  bookingType: BookingRecord['bookingType'];
  itemId: string;
  itemTitle: string;
  tierOrCabin: string;
  scheduleId?: string;
  scheduleLabel?: string;
  departureDate: string;
  returnDate?: string;
  routeOrLocation: string;
  unitPriceNgn: number;
  passengersCount: number;
  hotelSummary?: string;
  existingBookingId?: string;
  existingRemainingNgn?: number;
}

export interface SearchFilterState {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
  tripType: 'Round-Trip' | 'One-Way' | 'Multi-City';
  cabinClass: 'All' | 'Economy' | 'Business' | 'First';
  travelers: number;
  umrahTier: 'All' | 'Economy' | 'Luxury' | 'Premium';
  umrahSeason: string;
  umrahBatchLabel: string;
  hotelCity: 'All' | 'Makkah' | 'Madinah' | 'Dubai' | 'Abuja' | 'Lagos';
  hotelStars: 'All' | '3' | '4' | '5';
  hotelCheckIn: string;
  hotelCheckOut: string;
  visaCountry: string;
  visaCategory: VisaApplication['category'];
  visaSpeed: VisaApplication['processingSpeed'];
}

interface ToastMessage {
  id: number;
  text: string;
  tone: 'success' | 'error' | 'info';
}

interface AppContextValue {
  db: AppDatabase;
  loading: boolean;
  route: AppRoute;
  navigate: (to: AppRoute) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currentUser: UserAccount | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (email: string) => Promise<UserAccount | null>;
  register: (payload: { name: string; email: string; phone: string; city: string }) => Promise<UserAccount | null>;
  logout: () => void;
  checkoutDraft: CheckoutDraft | null;
  setCheckoutDraft: (draft: CheckoutDraft | null) => void;
  startCheckout: (draft: CheckoutDraft) => void;
  searchState: SearchFilterState;
  setSearchState: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  selectedPackageId: string | null;
  setSelectedPackageId: (id: string | null) => void;
  receiptBooking: BookingRecord | null;
  setReceiptBooking: (b: BookingRecord | null) => void;
  toast: ToastMessage | null;
  notify: (text: string, tone?: ToastMessage['tone']) => void;
  refreshData: () => Promise<void>;
  // Mutations
  createPackage: (pkg: Omit<UmrahPackage, 'id'>) => Promise<UmrahPackage | null>;
  updatePackage: (id: string, patch: Partial<UmrahPackage>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  createFlight: (flight: Omit<FlightOffer, 'id'>) => Promise<void>;
  deleteFlight: (id: string) => Promise<void>;
  submitBooking: (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    passengers: BookingRecord['passengers'];
    paymentPlan: 'Full' | 'Installment';
    initialPaymentNgn: number;
    channel: PaymentChannel;
  }) => Promise<BookingRecord | null>;
  payInstallment: (
    bookingId: string,
    amountNgn: number,
    channel: PaymentChannel,
    note?: string
  ) => Promise<BookingRecord | null>;
  updateBookingStatus: (bookingId: string, status: BookingRecord['status']) => Promise<void>;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, patch: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  submitVisaApplication: (
    payload: Omit<VisaApplication, 'id' | 'stage' | 'updatedAt'>
  ) => Promise<VisaApplication | null>;
  updateVisaApplication: (
    id: string,
    patch: {
      stage?: VisaStage;
      notes?: string;
      issuedVisaUrl?: string;
      document?: VisaDocumentItem;
    }
  ) => Promise<void>;
  addEscort: (escort: Omit<EscortMember, 'id'>) => Promise<void>;
  addNotice: (notice: Omit<OfficialNotice, 'id' | 'createdAt'>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  submitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>) => Promise<boolean>;
  registerPilgrimByAdmin: (payload: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    gender: 'Male' | 'Female';
    passportNumber: string;
    packageId: string;
    scheduleId?: string;
    pilgrimsCount: number;
    paymentPlan: 'Full' | 'Installment';
    initialPaymentNgn: number;
    channel: PaymentChannel;
    createVisaRecord: boolean;
    notes?: string;
  }) => Promise<{ booking: BookingRecord; user: UserAccount; visa: VisaApplication | null } | null>;
}

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/umrah-packages',
  '/flights',
  '/hotels',
  '/visa-services',
  '/gallery',
  '/about',
  '/contact',
  '/checkout',
  '/dashboard',
  '/admin',
];

function parseRoute(pathname: string): AppRoute {
  if (pathname.startsWith('/umrah-packages')) return '/umrah-packages';
  if (VALID_ROUTES.includes(pathname as AppRoute)) return pathname as AppRoute;
  return '/';
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AppDatabase>(() => createSeedDatabase());
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(window.location.pathname));
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('sidi_user');
      return saved ? (JSON.parse(saved) as UserAccount) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(() => window.location.pathname === '/login');
  const [checkoutDraft, setCheckoutDraft] = useState<CheckoutDraft | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<BookingRecord | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [searchState, setSearchState] = useState<SearchFilterState>({
    originCode: 'KAN',
    destinationCode: 'ALL',
    departureDate: '2027-02-08',
    returnDate: '2027-03-06',
    tripType: 'Round-Trip',
    cabinClass: 'All',
    travelers: 1,
    umrahTier: 'All',
    umrahSeason: 'All',
    umrahBatchLabel: 'All',
    hotelCity: 'All',
    hotelStars: 'All',
    hotelCheckIn: '2027-02-08',
    hotelCheckOut: '2027-02-18',
    visaCountry: 'Saudi Arabia',
    visaCategory: 'Umrah Visa',
    visaSpeed: 'Standard (5-7 Days)',
  });

  const notify = useCallback((text: string, tone: ToastMessage['tone'] = 'info') => {
    const id = Date.now();
    setToast({ id, text, tone });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  const navigate = useCallback((to: AppRoute) => {
    setRoute(to);
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = (await res.json()) as AppDatabase;
        setDb(data);
      }
    } catch (err) {
      console.error('Failed to load bootstrap state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const login = useCallback(
    async (email: string) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          notify(data.error || 'Login failed', 'error');
          return null;
        }
        setCurrentUser(data.user);
        localStorage.setItem('sidi_user', JSON.stringify(data.user));
        setAuthModalOpen(false);
        notify(`Welcome back, ${data.user.name}`, 'success');
        return data.user as UserAccount;
      } catch {
        notify('Unable to reach server during sign in.', 'error');
        return null;
      }
    },
    [notify]
  );

  const register = useCallback(
    async (payload: { name: string; email: string; phone: string; city: string }) => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          notify(data.error || 'Registration failed', 'error');
          return null;
        }
        setCurrentUser(data.user);
        localStorage.setItem('sidi_user', JSON.stringify(data.user));
        setAuthModalOpen(false);
        await refreshData();
        notify(`Account created for ${data.user.name}`, 'success');
        return data.user as UserAccount;
      } catch {
        notify('Unable to register right now.', 'error');
        return null;
      }
    },
    [notify, refreshData]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('sidi_user');
    notify('Signed out successfully.', 'info');
    if (route === '/dashboard' || route === '/admin') {
      navigate('/');
    }
  }, [navigate, notify, route]);

  const startCheckout = useCallback(
    (draft: CheckoutDraft) => {
      setCheckoutDraft(draft);
      setSelectedPackageId(null);
      navigate('/checkout');
    },
    [navigate]
  );

  const createPackage = useCallback(
    async (pkg: Omit<UmrahPackage, 'id'>) => {
      try {
        const res = await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pkg),
        });
        const data = await res.json();
        if (!res.ok) {
          notify(data.error || 'Failed to publish package.', 'error');
          return null;
        }
        await refreshData();
        notify(`Published "${data.title}" to live catalog.`, 'success');
        return data as UmrahPackage;
      } catch {
        notify('Unable to reach server while publishing package.', 'error');
        return null;
      }
    },
    [notify, refreshData]
  );

  const updatePackage = useCallback(
    async (id: string, patch: Partial<UmrahPackage>) => {
      try {
        const res = await fetch(`/api/packages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        if (!res.ok) {
          notify('Failed to update package.', 'error');
          return;
        }
        await refreshData();
        notify('Package updated.', 'success');
      } catch {
        notify('Unable to reach server while updating package.', 'error');
      }
    },
    [notify, refreshData]
  );

  const deletePackage = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          notify('Failed to remove package.', 'error');
          return;
        }
        await refreshData();
        notify('Package removed.', 'info');
      } catch {
        notify('Unable to reach server while deleting package.', 'error');
      }
    },
    [notify, refreshData]
  );

  const createFlight = useCallback(
    async (flight: Omit<FlightOffer, 'id'>) => {
      try {
        const res = await fetch('/api/flights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(flight),
        });
        const data = await res.json();
        if (!res.ok) {
          notify(data.error || 'Failed to publish flight fare.', 'error');
          return;
        }
        await refreshData();
        notify('Flight fare published.', 'success');
      } catch {
        notify('Unable to reach server while adding flight fare.', 'error');
      }
    },
    [notify, refreshData]
  );

  const deleteFlight = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/flights/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          notify('Failed to remove flight route.', 'error');
          return;
        }
        await refreshData();
        notify('Flight route removed.', 'info');
      } catch {
        notify('Unable to reach server while deleting flight.', 'error');
      }
    },
    [notify, refreshData]
  );

  const submitBooking = useCallback(
    async (payload: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      passengers: BookingRecord['passengers'];
      paymentPlan: 'Full' | 'Installment';
      initialPaymentNgn: number;
      channel: PaymentChannel;
    }) => {
      if (!checkoutDraft) return null;
      const totalAmountNgn = checkoutDraft.unitPriceNgn * checkoutDraft.passengersCount;
      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser?.id || 'user-demo-1',
            customerName: payload.customerName,
            customerEmail: payload.customerEmail,
            customerPhone: payload.customerPhone,
            bookingType: checkoutDraft.bookingType,
            itemId: checkoutDraft.itemId,
            itemTitle: checkoutDraft.itemTitle,
            tierOrCabin: checkoutDraft.tierOrCabin,
            scheduleId: checkoutDraft.scheduleId,
            scheduleLabel: checkoutDraft.scheduleLabel,
            departureDate: checkoutDraft.departureDate,
            returnDate: checkoutDraft.returnDate,
            routeOrLocation: checkoutDraft.routeOrLocation,
            passengersCount: checkoutDraft.passengersCount,
            passengers: payload.passengers,
            totalAmountNgn,
            initialPaymentNgn: payload.initialPaymentNgn,
            paymentPlan: payload.paymentPlan,
            channel: payload.channel,
            hotelSummary: checkoutDraft.hotelSummary,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          notify(err.error || 'Booking submission failed.', 'error');
          return null;
        }
        const created = (await res.json()) as BookingRecord;
        await refreshData();
        notify(`Booking ${created.reference} confirmed!`, 'success');
        return created;
      } catch {
        notify('Unable to reach server while submitting booking.', 'error');
        return null;
      }
    },
    [checkoutDraft, currentUser, notify, refreshData]
  );

  const payInstallment = useCallback(
    async (bookingId: string, amountNgn: number, channel: PaymentChannel, note?: string) => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountNgn, channel, note }),
        });
        if (!res.ok) {
          const err = await res.json();
          notify(err.error || 'Payment failed.', 'error');
          return null;
        }
        const updated = (await res.json()) as BookingRecord;
        await refreshData();
        notify(`Installment payment applied to ${updated.reference}.`, 'success');
        return updated;
      } catch {
        notify('Unable to reach server while processing payment.', 'error');
        return null;
      }
    },
    [notify, refreshData]
  );

  const updateBookingStatus = useCallback(
    async (bookingId: string, status: BookingRecord['status']) => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) {
          notify('Failed to update booking status.', 'error');
          return;
        }
        await refreshData();
        notify(`Booking status updated to ${status}.`, 'success');
      } catch {
        notify('Unable to reach server while updating status.', 'error');
      }
    },
    [notify, refreshData]
  );

  const addGalleryItem = useCallback(
    async (item: Omit<GalleryItem, 'id'>) => {
      try {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!res.ok) {
          const err = await res.json();
          notify(err.error || 'Failed to add media item.', 'error');
          return;
        }
        await refreshData();
        notify('Media added to public Gallery.', 'success');
      } catch {
        notify('Unable to reach server while uploading media.', 'error');
      }
    },
    [notify, refreshData]
  );

  const updateGalleryItem = useCallback(
    async (id: string, patch: Partial<GalleryItem>) => {
      try {
        const res = await fetch(`/api/gallery/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        if (!res.ok) {
          notify('Failed to update gallery item.', 'error');
          return;
        }
        await refreshData();
        notify('Gallery item updated.', 'success');
      } catch {
        notify('Unable to reach server while updating gallery.', 'error');
      }
    },
    [notify, refreshData]
  );

  const deleteGalleryItem = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          notify('Failed to delete gallery item.', 'error');
          return;
        }
        await refreshData();
        notify('Gallery item deleted.', 'info');
      } catch {
        notify('Unable to reach server while deleting media.', 'error');
      }
    },
    [notify, refreshData]
  );

  const submitVisaApplication = useCallback(
    async (payload: Omit<VisaApplication, 'id' | 'stage' | 'updatedAt'>) => {
      try {
        const res = await fetch('/api/visas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          notify(err.error || 'Could not submit visa application.', 'error');
          return null;
        }
        const created = (await res.json()) as VisaApplication;
        await refreshData();
        notify('Visa application submitted to Sidi Processing Desk.', 'success');
        return created;
      } catch {
        notify('Unable to reach server while submitting visa.', 'error');
        return null;
      }
    },
    [notify, refreshData]
  );

  const updateVisaApplication = useCallback(
    async (
      id: string,
      patch: {
        stage?: VisaStage;
        notes?: string;
        issuedVisaUrl?: string;
        document?: VisaDocumentItem;
      }
    ) => {
      try {
        const res = await fetch(`/api/visas/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        if (!res.ok) {
          notify('Failed to update visa record.', 'error');
          return;
        }
        await refreshData();
        notify('Visa record updated.', 'success');
      } catch {
        notify('Unable to reach server while updating visa.', 'error');
      }
    },
    [notify, refreshData]
  );

  const addEscort = useCallback(
    async (escort: Omit<EscortMember, 'id'>) => {
      try {
        const res = await fetch('/api/escorts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(escort),
        });
        if (!res.ok) {
          const err = await res.json();
          notify(err.error || 'Failed to add escort.', 'error');
          return;
        }
        await refreshData();
        notify('Escort added to operations roster.', 'success');
      } catch {
        notify('Unable to reach server while adding escort.', 'error');
      }
    },
    [notify, refreshData]
  );

  const addNotice = useCallback(
    async (notice: Omit<OfficialNotice, 'id' | 'createdAt'>) => {
      try {
        const res = await fetch('/api/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notice),
        });
        if (!res.ok) {
          const err = await res.json();
          notify(err.error || 'Failed to publish notice.', 'error');
          return;
        }
        await refreshData();
        notify('Official notice published.', 'success');
      } catch {
        notify('Unable to reach server while publishing notice.', 'error');
      }
    },
    [notify, refreshData]
  );

  const deleteNotice = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          notify('Failed to delete notice.', 'error');
          return;
        }
        await refreshData();
        notify('Notice removed.', 'info');
      } catch {
        notify('Unable to reach server while removing notice.', 'error');
      }
    },
    [notify, refreshData]
  );

  const submitInquiry = useCallback(
    async (inquiry: Omit<ContactInquiry, 'id' | 'createdAt'>) => {
      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiry),
        });
        if (!res.ok) {
          const err = await res.json();
          notify(err.error || 'Could not send inquiry. Please check all fields.', 'error');
          return false;
        }
        await refreshData();
        notify('Inquiry sent! Our Kano desk will contact you shortly.', 'success');
        return true;
      } catch {
        notify('Unable to reach server while sending inquiry.', 'error');
        return false;
      }
    },
    [notify, refreshData]
  );

  const registerPilgrimByAdmin = useCallback(
    async (payload: {
      fullName: string;
      email: string;
      phone: string;
      city: string;
      gender: 'Male' | 'Female';
      passportNumber: string;
      packageId: string;
      scheduleId?: string;
      pilgrimsCount: number;
      paymentPlan: 'Full' | 'Installment';
      initialPaymentNgn: number;
      channel: PaymentChannel;
      createVisaRecord: boolean;
      notes?: string;
    }) => {
      try {
        const res = await fetch('/api/admin/register-pilgrim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          notify(data.error || 'Could not register pilgrim.', 'error');
          return null;
        }
        await refreshData();
        notify(`Pilgrim registered! Booking ${data.booking.reference} issued.`, 'success');
        return data as { booking: BookingRecord; user: UserAccount; visa: VisaApplication | null };
      } catch {
        notify('Unable to reach server while registering pilgrim.', 'error');
        return null;
      }
    },
    [notify, refreshData]
  );

  return (
    <AppContext.Provider
      value={{
        db,
        loading,
        route,
        navigate,
        currency,
        setCurrency,
        currentUser,
        authModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
        checkoutDraft,
        setCheckoutDraft,
        startCheckout,
        searchState,
        setSearchState,
        selectedPackageId,
        setSelectedPackageId,
        receiptBooking,
        setReceiptBooking,
        toast,
        notify,
        refreshData,
        createPackage,
        updatePackage,
        deletePackage,
        createFlight,
        deleteFlight,
        submitBooking,
        payInstallment,
        updateBookingStatus,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        submitVisaApplication,
        updateVisaApplication,
        addEscort,
        addNotice,
        deleteNotice,
        submitInquiry,
        registerPilgrimByAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
