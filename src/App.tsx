import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PackageDetailModal } from './components/PackageDetailModal';
import { ReceiptModal } from './components/ReceiptModal';
import { HomePage } from './pages/HomePage';
import { UmrahPackagesPage } from './pages/UmrahPackagesPage';
import { FlightsPage } from './pages/FlightsPage';
import { HotelsPage } from './pages/HotelsPage';
import { VisaServicesPage } from './pages/VisaServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppShell() {
  const { route, navigate, toast } = useApp();

  const renderPage = () => {
    switch (route) {
      case '/':
        return <HomePage />;
      case '/umrah-packages':
        return <UmrahPackagesPage />;
      case '/flights':
        return <FlightsPage />;
      case '/hotels':
        return <HotelsPage />;
      case '/visa-services':
        return <VisaServicesPage />;
      case '/gallery':
        return <GalleryPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/checkout':
        return <CheckoutPage />;
      case '/dashboard':
        return <UserDashboardPage />;
      case '/admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1 pb-14 md:pb-0">{renderPage()}</main>
      <Footer />

      {/* Mobile Compact Sticky Quick-Action Bar (<= 48px, well below 15% mobile height) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0A224E] text-white border-t border-[#D4AF37]/40 px-3 h-12 flex items-center justify-between gap-2 no-print">
        <span className="text-xs font-medium truncate text-slate-200">
          Ramadan 2027 from <strong className="text-[#F5B800] font-mono">₦4.7M</strong>
        </span>
        <button
          type="button"
          onClick={() => navigate('/umrah-packages')}
          className="px-3.5 py-1.5 text-xs font-semibold bg-[#D4AF37] text-[#061533] rounded-md whitespace-nowrap shrink-0"
        >
          Book Now
        </button>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-16 md:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold border no-print ${
            toast.tone === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : toast.tone === 'success'
                ? 'bg-[#0A224E] text-white border-[#D4AF37]'
                : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          {toast.text}
        </div>
      )}

      <AuthModal />
      <PackageDetailModal />
      <ReceiptModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
