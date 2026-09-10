import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Info, Star, Flame, Check, AlertCircle } from 'lucide-react';
import { MenuCategory, MenuItem, RestaurantInfo, DietaryTag } from '../../types';
import { ALLERGEN_DICT, DIETARY_LABELS } from '../../data/defaultData';

interface MenuSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
  restaurantInfo: RestaurantInfo;
  cmsModeActive: boolean;
  onEditDish: (dish: MenuItem) => void;
  onAddDishToCategory: (categoryId: string) => void;
  onOpenCms: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  items,
  restaurantInfo,
  cmsModeActive,
  onEditDish,
  onAddDishToCategory,
  onOpenCms,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag | 'all'>('all');
  const [onlySpecials, setOnlySpecials] = useState(false);
  const [showAllergenLegend, setShowAllergenLegend] = useState(false);
  const [activeAllergenTooltip, setActiveAllergenTooltip] = useState<string | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (dietaryFilter !== 'all' && (!item.dietary || !item.dietary.includes(dietaryFilter))) {
        return false;
      }
      // Only specials
      if (onlySpecials && !item.isChefSpecial && !item.isDailySpecial) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchPortion = item.portionSize?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchPortion) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedCategory, dietaryFilter, onlySpecials, searchQuery]);

  // Group items by category for "all" view, or single category
  const categoriesToRender = useMemo(() => {
    if (selectedCategory === 'all') {
      return categories.slice().sort((a, b) => a.order - b.order);
    }
    return categories.filter((c) => c.id === selectedCategory);
  }, [categories, selectedCategory]);

  return (
    <section id="speisekarte" className="py-16 sm:py-24 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c2410c] block mb-2">
            Kulinarische Vielfalt
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#292524] tracking-tight">
            Unsere Speisekarte
          </h2>
          <p className="mt-3 text-base text-[#78716c] font-light">
            Alle Gerichte werden frisch mit viel Liebe & Sorgfalt aus hochwertigen Zutaten zubereitet.
          </p>

          {cmsModeActive && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
              <span>CMS-Modus aktiv: Klicken Sie bei jedem Gericht auf &bdquo;Bearbeiten&ldquo;</span>
              <button
                onClick={onOpenCms}
                className="underline hover:text-amber-950 font-bold"
              >
                CMS-Übersicht öffnen
              </button>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200/80 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Gericht oder Zutat suchen (z.B. Trüffel, Burrata)..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c] focus:bg-white transition-all text-stone-800 placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>

            {/* Dietary Tags Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  dietaryFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Alle Kostformen
              </button>

              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'vegetarian' ? 'all' : 'vegetarian')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  dietaryFilter === 'vegetarian'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                🌱 Vegetarisch
              </button>

              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'vegan' ? 'all' : 'vegan')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  dietaryFilter === 'vegan'
                    ? 'bg-green-700 text-white'
                    : 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100'
                }`}
              >
                🌿 Vegan
              </button>

              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'gluten_free' ? 'all' : 'gluten_free')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  dietaryFilter === 'gluten_free'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                🌾 Glutenfrei
              </button>

              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'spicy' ? 'all' : 'spicy')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  dietaryFilter === 'spicy'
                    ? 'bg-red-700 text-white'
                    : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                }`}
              >
                🌶️ Scharf
              </button>

              <button
                onClick={() => setOnlySpecials(!onlySpecials)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  onlySpecials
                    ? 'bg-[#c2410c] text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Star className="w-3 h-3" />
                Nur Empfehlungen
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#c2410c] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Komplette Karte ({items.length})
            </button>

            {categories.map((cat) => {
              const count = items.filter((i) => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-[#c2410c] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCategory === cat.id
                        ? 'bg-white/20 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories & Dishes List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 max-w-lg mx-auto">
            <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-800">Keine Gerichte gefunden</h3>
            <p className="text-stone-500 text-sm mt-1 mb-4">
              Für Ihre aktuellen Such- und Filterkriterien gibt es momentan keine Einträge in der Speisekarte.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                setOnlySpecials(false);
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {categoriesToRender.map((cat) => {
              const catItems = filteredItems.filter((i) => i.category === cat.id);
              if (catItems.length === 0 && selectedCategory === 'all') return null;

              return (
                <div key={cat.id} className="scroll-mt-28">
                  {/* Category Title & Description */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 border-stone-200 pb-3 mb-8 gap-2">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-stone-900">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    {cmsModeActive && (
                      <button
                        onClick={() => onAddDishToCategory(cat.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c2410c] hover:text-[#9a3412] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors border border-orange-200 self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Gericht zu &bdquo;{cat.name}&ldquo; hinzufügen</span>
                      </button>
                    )}
                  </div>

                  {/* Dishes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catItems.map((dish) => (
                      <div
                        key={dish.id}
                        className={`group relative bg-white rounded-2xl p-5 border transition-all duration-300 flex gap-4 ${
                          dish.isAvailable
                            ? 'border-stone-200/80 hover:border-stone-300 hover:shadow-md'
                            : 'border-stone-200 opacity-60 bg-stone-50/80'
                        }`}
                      >
                        {/* Thumbnail Image if present */}
                        {dish.image && (
                          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-stone-100 relative">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            {!dish.isAvailable && (
                              <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center p-1 text-center">
                                <span className="text-[10px] font-bold text-white uppercase leading-tight">
                                  Ausverkauft
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-baseline justify-between gap-3 mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base sm:text-lg font-bold text-stone-900 font-serif-display leading-tight">
                                  {dish.name}
                                </h4>
                                {dish.isDailySpecial && (
                                  <span className="inline-flex items-center gap-0.5 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    <Flame className="w-2.5 h-2.5" /> Tageshit
                                  </span>
                                )}
                                {dish.isChefSpecial && (
                                  <span className="inline-flex items-center gap-0.5 bg-[#c2410c] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                    <Star className="w-2.5 h-2.5 fill-white" /> Chef’s Pick
                                  </span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="text-base font-bold text-[#c2410c] whitespace-nowrap">
                                {dish.price.toFixed(2).replace('.', ',')} {restaurantInfo.currency}
                              </div>
                            </div>

                            {dish.portionSize && (
                              <span className="text-xs text-stone-400 font-medium block mb-1.5">
                                {dish.portionSize}
                              </span>
                            )}

                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                              {dish.description}
                            </p>
                          </div>

                          {/* Footer of Dish Card: Dietary & Allergens & CMS edit */}
                          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {dish.dietary?.map((tag) => {
                                const meta = DIETARY_LABELS[tag];
                                if (!meta) return null;
                                return (
                                  <span
                                    key={tag}
                                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${meta.color}`}
                                  >
                                    {meta.icon} {meta.label}
                                  </span>
                                );
                              })}

                              {dish.allergens && dish.allergens.length > 0 && (
                                <button
                                  onClick={() =>
                                    setActiveAllergenTooltip(
                                      activeAllergenTooltip === dish.id ? null : dish.id
                                    )
                                  }
                                  className="text-[10px] text-stone-400 hover:text-stone-700 font-mono underline cursor-pointer"
                                  title="Allergenkürzel anzeigen"
                                >
                                  [{dish.allergens.join(', ')}]
                                </button>
                              )}
                            </div>

                            {/* CMS Quick Edit Button */}
                            {cmsModeActive && (
                              <button
                                onClick={() => onEditDish(dish)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 px-2.5 py-1 rounded-md transition-colors"
                              >
                                <Edit2 className="w-3 h-3 text-[#c2410c]" />
                                <span>Bearbeiten</span>
                              </button>
                            )}
                          </div>

                          {/* Allergen explanation popover for this dish */}
                          {activeAllergenTooltip === dish.id && dish.allergens && (
                            <div className="mt-2 p-2.5 bg-stone-900 text-stone-200 text-xs rounded-xl shadow-lg animate-fade-in">
                              <div className="font-semibold text-amber-300 mb-1">
                                Enthaltene Allergene:
                              </div>
                              <ul className="space-y-0.5 text-[11px]">
                                {dish.allergens.map((code) => (
                                  <li key={code}>
                                    <span className="font-bold text-white">{code}:</span>{' '}
                                    {ALLERGEN_DICT[code] || 'Zutat'}
                                  </li>
                                ))}
                              </ul>
                              <button
                                onClick={() => setActiveAllergenTooltip(null)}
                                className="mt-1.5 text-[10px] text-stone-400 hover:text-white underline block text-right"
                              >
                                Schließen
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Allergen Legend Accordion / Toggle */}
        <div className="mt-16 pt-8 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-stone-400" />
              <span>
                Alle Preise verstehen sich in Euro inkl. gesetzlicher Mehrwertsteuer und Bedienung.
              </span>
            </div>

            <button
              onClick={() => setShowAllergenLegend(!showAllergenLegend)}
              className="text-[#c2410c] hover:text-[#9a3412] font-semibold flex items-center gap-1 underline"
            >
              <span>{showAllergenLegend ? 'Allergenliste ausblenden' : 'EU-Allergenliste anzeigen'}</span>
            </button>
          </div>

          {showAllergenLegend && (
            <div className="mt-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <h4 className="text-sm font-bold text-stone-800 mb-3">
                Kennzeichnung der Allergene gemäß EU-Verordnung 1169/2011:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs text-stone-600">
                {Object.entries(ALLERGEN_DICT).map(([code, name]) => (
                  <div key={code} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-[10px]">
                      {code}
                    </span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
