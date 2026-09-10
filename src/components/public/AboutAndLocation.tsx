import React from 'react';
import { Clock, MapPin, Phone, Mail, Navigation, Heart, Award, Sparkles } from 'lucide-react';
import { RestaurantInfo } from '../../types';

interface AboutAndLocationProps {
  restaurantInfo: RestaurantInfo;
}

export const AboutAndLocation: React.FC<AboutAndLocationProps> = ({ restaurantInfo }) => {
  const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const todayName = dayNames[new Date().getDay()];

  return (
    <section id="ueber-uns" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3">
              <img
                src={restaurantInfo.aboutImage}
                alt="Unser Restaurant"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1">
                  Tradition & Handwerk
                </p>
                <p className="font-serif-display text-xl sm:text-2xl font-bold">
                  Kochen mit Leidenschaft & erlesenen Zutaten
                </p>
              </div>
            </div>

            {/* Accent badge floating */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-[#faf8f5] p-4 rounded-2xl shadow-lg border border-stone-200">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg">
                15+
              </div>
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">Jahre Erfahrung</span>
                <span className="text-stone-500">im Familienbetrieb</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c2410c] block mb-2">
              Über uns & Philosophie
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-stone-900 mb-6 leading-tight">
              {restaurantInfo.storyTitle}
            </h2>
            <p className="text-stone-600 text-base leading-relaxed mb-6 font-light">
              {restaurantInfo.storyText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#c2410c] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Frische Zubereitung</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Keine Fertigprodukte, Teige täglich frisch geknetet.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Direktimporte</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Feinste Olivenöle & Weine von vertrauten Erzeugern.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Opening Hours Section */}
        <div id="oeffnungszeiten" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#faf8f5] rounded-3xl p-8 sm:p-12 border border-stone-200">
            {/* Opening Hours Schedule */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c2410c] mb-2">
                <Clock className="w-4 h-4" />
                <span>Zeiten</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900 mb-6">
                Öffnungszeiten
              </h3>

              <div className="space-y-2.5">
                {restaurantInfo.openingHours.map((item) => {
                  const isToday = item.day === todayName;
                  return (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl text-xs sm:text-sm transition-colors ${
                        isToday
                          ? 'bg-amber-100/70 border border-amber-300 font-semibold text-stone-900'
                          : 'bg-white border border-stone-200/70 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-24">{item.day}</span>
                        {isToday && (
                          <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                            Heute
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        {item.isClosed ? (
                          <span className="text-stone-400 italic">Ruhetag</span>
                        ) : (
                          <span>{item.hours}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address, Contact, & Directions */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c2410c] mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Standort & Kontakt</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900 mb-6">
                  Besuchen Sie uns
                </h3>

                <div className="space-y-4 text-sm text-stone-700 mb-8">
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-stone-200">
                    <MapPin className="w-5 h-5 text-[#c2410c] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block">{restaurantInfo.name}</span>
                      <span>{restaurantInfo.address.street}</span>
                      <br />
                      <span>{restaurantInfo.address.zipCity}</span>
                      {restaurantInfo.address.note && (
                        <p className="text-xs text-stone-500 mt-1">{restaurantInfo.address.note}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-200">
                    <Phone className="w-5 h-5 text-[#c2410c] shrink-0" />
                    <div>
                      <span className="text-xs text-stone-400 block font-medium">Telefon & Reservierung</span>
                      <a
                        href={`tel:${restaurantInfo.phone.replace(/[^0-9+]/g, '')}`}
                        className="font-bold text-stone-900 hover:text-[#c2410c] transition-colors"
                      >
                        {restaurantInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-200">
                    <Mail className="w-5 h-5 text-[#c2410c] shrink-0" />
                    <div>
                      <span className="text-xs text-stone-400 block font-medium">E-Mail für Anfragen</span>
                      <a
                        href={`mailto:${restaurantInfo.email}`}
                        className="font-bold text-stone-900 hover:text-[#c2410c] transition-colors"
                      >
                        {restaurantInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${restaurantInfo.name} ${restaurantInfo.address.street} ${restaurantInfo.address.zipCity}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#292524] hover:bg-[#1c1917] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Route in Google Maps planen</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
