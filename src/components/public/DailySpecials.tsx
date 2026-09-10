import React from 'react';
import { Sparkles, Star, Edit, Flame, AlertCircle } from 'lucide-react';
import { MenuItem, RestaurantInfo } from '../../types';
import { DIETARY_LABELS } from '../../data/defaultData';

interface DailySpecialsProps {
  items: MenuItem[];
  restaurantInfo: RestaurantInfo;
  cmsModeActive: boolean;
  onEditDish: (dish: MenuItem) => void;
  onOpenCms: () => void;
}

export const DailySpecials: React.FC<DailySpecialsProps> = ({
  items,
  restaurantInfo,
  cmsModeActive,
  onEditDish,
  onOpenCms,
}) => {
  // Filter items that are either daily specials or chef specials and available
  const specials = items.filter((item) => item.isDailySpecial || item.isChefSpecial);

  return (
    <section id="tagesangebote" className="py-16 sm:py-20 bg-[#f5f2eb] border-b border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Saisonal & Frisch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#292524]">
              Tagesempfehlungen & Chef’s Choice
            </h2>
            <p className="text-[#78716c] text-sm sm:text-base mt-2 max-w-xl">
              Täglich wechselnde Empfehlungen unseres Küchenchefs – mit marktfrischen Zutaten nach traditionellen Rezepten zubereitet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {cmsModeActive && (
              <button
                onClick={onOpenCms}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-amber-500 text-stone-950 rounded-lg hover:bg-amber-400 transition-colors shadow-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Tagesangebote im CMS verwalten</span>
              </button>
            )}
          </div>
        </div>

        {specials.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-300 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-semibold text-stone-800 mb-1">Heute keine Sonderaktionen aktiv</h3>
            <p className="text-stone-500 text-sm mb-4">
              Markieren Sie Gerichte in Ihrem CMS als &bdquo;Tagesgericht&ldquo; oder &bdquo;Empfehlung des Hauses&ldquo;, um sie hier hervorzuheben.
            </p>
            <button
              onClick={onOpenCms}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c2410c] text-white text-xs font-medium rounded-lg hover:bg-[#9a3412]"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>CMS öffnen & Speise hervorheben</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {specials.slice(0, 6).map((dish) => (
              <div
                key={dish.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                      <Sparkles className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {dish.isDailySpecial && (
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-stone-950 font-bold text-[11px] px-2.5 py-1 rounded-full shadow">
                        <Flame className="w-3 h-3 fill-stone-950" />
                        Tagesgericht
                      </span>
                    )}
                    {dish.isChefSpecial && (
                      <span className="inline-flex items-center gap-1 bg-[#c2410c] text-white font-semibold text-[11px] px-2.5 py-1 rounded-full shadow">
                        <Star className="w-3 h-3 fill-white" />
                        Chef-Empfehlung
                      </span>
                    )}
                  </div>

                  {/* Availability badge */}
                  {!dish.isAvailable && (
                    <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Heute Ausverkauft
                      </span>
                    </div>
                  )}

                  {/* CMS direct edit button overlay */}
                  {cmsModeActive && (
                    <button
                      onClick={() => onEditDish(dish)}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-md text-xs font-semibold transition-transform hover:scale-110 flex items-center gap-1"
                      title="Gericht bearbeiten"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#c2410c]" />
                      <span className="text-[11px]">Edit</span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <h3 className="text-xl font-serif-display font-bold text-stone-900 leading-snug">
                        {dish.name}
                      </h3>
                      <span className="text-lg font-bold text-[#c2410c] whitespace-nowrap">
                        {dish.price.toFixed(2).replace('.', ',')} {restaurantInfo.currency}
                      </span>
                    </div>

                    {dish.portionSize && (
                      <p className="text-xs text-stone-400 font-medium mb-2">
                        {dish.portionSize}
                      </p>
                    )}

                    <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {dish.dietary?.map((tag) => {
                        const meta = DIETARY_LABELS[tag];
                        if (!meta) return null;
                        return (
                          <span
                            key={tag}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${meta.color}`}
                          >
                            {meta.icon} {meta.label}
                          </span>
                        );
                      })}
                    </div>

                    {dish.allergens && dish.allergens.length > 0 && (
                      <span className="text-[11px] text-stone-400 font-mono" title="Allergene">
                        Allergene: {dish.allergens.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
