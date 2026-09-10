import React, { useState } from 'react';
import { Utensils, Phone, Clock, Settings, Menu, X, CalendarCheck } from 'lucide-react';
import { RestaurantInfo } from '../../types';

interface NavbarProps {
  restaurantInfo: RestaurantInfo;
  onOpenCms: () => void;
  onOpenDishModal: () => void;
  cmsModeActive: boolean;
  onToggleCmsMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  restaurantInfo,
  onOpenCms,
  cmsModeActive,
  onToggleCmsMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if currently open based on local day/time
  const getTodayStatus = () => {
    const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const now = new Date();
    const todayName = dayNames[now.getDay()];
    const todaySchedule = restaurantInfo.openingHours.find((h) => h.day === todayName);

    if (!todaySchedule || todaySchedule.isClosed) {
      return { text: 'Heute Ruhetag', isOpen: false };
    }
    return { text: `Heute geöffnet: ${todaySchedule.hours.split('&')[0].trim()}...`, isOpen: true };
  };

  const status = getTodayStatus();

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e7e5e4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-[#c2410c] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-serif-display font-bold tracking-tight text-[#292524] block leading-tight">
                {restaurantInfo.name}
              </span>
              <span className="text-xs tracking-wider uppercase text-[#78716c] font-medium block">
                {restaurantInfo.cuisine}
              </span>
            </div>
          </a>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center space-x-7">
            <a
              href="#speisekarte"
              className="text-sm font-semibold text-[#44403c] hover:text-[#c2410c] transition-colors"
            >
              Speisekarte
            </a>
            <a
              href="#tagesangebote"
              className="text-sm font-semibold text-[#44403c] hover:text-[#c2410c] transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Tagesangebote
            </a>
            <a
              href="#ueber-uns"
              className="text-sm font-semibold text-[#44403c] hover:text-[#c2410c] transition-colors"
            >
              Über uns
            </a>
            <a
              href="#oeffnungszeiten"
              className="text-sm font-semibold text-[#44403c] hover:text-[#c2410c] transition-colors"
            >
              Öffnungszeiten & Anfahrt
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Phone quick link */}
            <a
              href={`tel:${restaurantInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 text-xs font-semibold text-[#57534e] hover:text-[#1c1917] bg-[#f5f5f4] px-3.5 py-2 rounded-full border border-[#e7e5e4] transition-colors"
              title="Direkt anrufen"
            >
              <Phone className="w-3.5 h-3.5 text-[#c2410c]" />
              <span>{restaurantInfo.phone}</span>
            </a>

            {/* Reservation Button */}
            <a
              href="#reservierung"
              className="inline-flex items-center gap-2 bg-[#292524] hover:bg-[#1c1917] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>Tisch reservieren</span>
            </a>

            {/* CMS Trigger Button */}
            <button
              id="cms-open-button-desktop"
              onClick={onOpenCms}
              className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-full transition-all border shadow-sm ${
                cmsModeActive
                  ? 'bg-amber-500 text-stone-950 border-amber-600 ring-2 ring-amber-300'
                  : 'bg-[#c2410c] text-white hover:bg-[#9a3412] border-transparent'
              }`}
              title="Speisekarte bearbeiten (CMS)"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>CMS Speisekarte</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenCms}
              className="flex items-center gap-1.5 bg-[#c2410c] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow"
              aria-label="CMS öffnen"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>CMS</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#57534e] hover:bg-[#f5f5f4]"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e7e5e4] bg-[#faf8f5] px-4 pt-3 pb-5 space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#78716c] pb-2 border-b border-[#e7e5e4]">
            <Clock className="w-3.5 h-3.5 text-[#c2410c]" />
            <span>{status.text}</span>
          </div>

          <a
            href="#speisekarte"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#292524] py-1.5 hover:text-[#c2410c]"
          >
            Speisekarte
          </a>
          <a
            href="#tagesangebote"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#292524] py-1.5 hover:text-[#c2410c]"
          >
            Tagesangebote & Empfehlungen
          </a>
          <a
            href="#ueber-uns"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#292524] py-1.5 hover:text-[#c2410c]"
          >
            Über uns
          </a>
          <a
            href="#oeffnungszeiten"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#292524] py-1.5 hover:text-[#c2410c]"
          >
            Öffnungszeiten & Kontakt
          </a>
          <a
            href="#reservierung"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#c2410c] py-1.5"
          >
            Tisch reservieren
          </a>

          <div className="pt-2 border-t border-[#e7e5e4] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCms();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#c2410c] text-white py-2.5 rounded-lg text-sm font-semibold"
            >
              <Settings className="w-4 h-4" />
              <span>Speisekarte im CMS verwalten</span>
            </button>
            <a
              href={`tel:${restaurantInfo.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 bg-[#f5f5f4] text-[#292524] py-2.5 rounded-lg text-sm font-semibold border border-[#e7e5e4]"
            >
              <Phone className="w-4 h-4 text-[#c2410c]" />
              <span>{restaurantInfo.phone} anrufen</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
