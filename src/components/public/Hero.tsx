import React from 'react';
import { ArrowDown, Calendar, Sparkles, MapPin, Edit3 } from 'lucide-react';
import { RestaurantInfo } from '../../types';

interface HeroProps {
  restaurantInfo: RestaurantInfo;
  onOpenCms: () => void;
  onOpenAddDish: () => void;
}

export const Hero: React.FC<HeroProps> = ({ restaurantInfo, onOpenCms, onOpenAddDish }) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white min-h-[560px] lg:min-h-[640px] flex items-center">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={restaurantInfo.heroImage}
          alt={restaurantInfo.name}
          className="w-full h-full object-cover object-center opacity-40 scale-105 transform transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        {/* Announcement Banner if configured in CMS */}
        {restaurantInfo.showAnnouncement && restaurantInfo.announcement && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md animate-fade-in shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{restaurantInfo.announcement}</span>
          </div>
        )}

        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            <MapPin className="w-4 h-4" />
            <span>{restaurantInfo.address.zipCity}</span>
            <span className="text-stone-500">•</span>
            <span>{restaurantInfo.cuisine}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-bold text-white tracking-tight leading-[1.1] mb-5">
            {restaurantInfo.name}
          </h1>

          <p className="text-lg sm:text-xl text-stone-200 font-light leading-relaxed mb-8 max-w-2xl">
            {restaurantInfo.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#speisekarte"
              className="inline-flex items-center gap-2 bg-[#c2410c] hover:bg-[#ea580c] text-white text-sm font-semibold px-6 py-3.5 rounded-full transition-all shadow-lg hover:shadow-orange-950/40 hover:-translate-y-0.5"
            >
              <span>Zur Speisekarte</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="#reservierung"
              className="inline-flex items-center gap-2 bg-stone-800/90 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3.5 rounded-full border border-stone-700 hover:border-stone-500 transition-all backdrop-blur-sm"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Tisch online reservieren</span>
            </a>

            <button
              onClick={onOpenCms}
              className="inline-flex items-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs sm:text-sm font-medium px-4 py-3 rounded-full border border-amber-500/40 transition-colors"
              title="Speisekarte im CMS anpassen"
            >
              <Edit3 className="w-4 h-4" />
              <span>Speisekarte selbst bearbeiten</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-stone-300 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Täglich frische Zutaten</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Hausgemachte Spezialitäten</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Feinste Weinauswahl</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Gemütliche Sommerterrasse</span>
          </div>
        </div>
      </div>
    </section>
  );
};
