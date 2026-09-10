import React from 'react';
import { Utensils, Settings, Heart } from 'lucide-react';
import { RestaurantInfo } from '../../types';

interface FooterProps {
  restaurantInfo: RestaurantInfo;
  onOpenCms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ restaurantInfo, onOpenCms }) => {
  return (
    <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-serif-display text-xl font-bold mb-3">
              <div className="w-8 h-8 rounded-full bg-[#c2410c] text-white flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <span>{restaurantInfo.name}</span>
            </div>
            <p className="text-stone-400 text-sm max-w-sm mb-4">
              {restaurantInfo.tagline}. Frische Küche, handverlesene Zutaten und mediterrane Herzlichkeit.
            </p>
            <p className="text-stone-500 text-xs">
              {restaurantInfo.address.street} • {restaurantInfo.address.zipCity}
            </p>
          </div>

          <div>
            <span className="text-white font-semibold block mb-3 uppercase tracking-wider text-[11px]">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#speisekarte" className="hover:text-amber-400 transition-colors">
                  Speisekarte
                </a>
              </li>
              <li>
                <a href="#tagesangebote" className="hover:text-amber-400 transition-colors">
                  Tagesempfehlungen
                </a>
              </li>
              <li>
                <a href="#reservierung" className="hover:text-amber-400 transition-colors">
                  Tisch reservieren
                </a>
              </li>
              <li>
                <a href="#oeffnungszeiten" className="hover:text-amber-400 transition-colors">
                  Öffnungszeiten & Kontakt
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-white font-semibold block mb-3 uppercase tracking-wider text-[11px]">
              Inhaber & Verwaltung
            </span>
            <p className="text-stone-400 text-xs mb-3">
              Als Restaurant-Inhaber können Sie die Speisekarte, Preise und Tagesgerichte jederzeit hier aktualisieren.
            </p>
            <button
              id="cms-footer-button"
              onClick={onOpenCms}
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-400 px-3.5 py-2 rounded-lg border border-stone-700 font-semibold transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>CMS Speisekarte bearbeiten</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500">
          <div>
            © {new Date().getFullYear()} {restaurantInfo.name}. Alle Rechte vorbehalten.
          </div>
          <div className="flex items-center gap-1">
            <span>Gastronomie-Website mit interaktivem CMS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
