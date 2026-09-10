import React, { useState, useEffect } from 'react';
import { X, Check, Image, AlertTriangle, Sparkles, Star, Flame, Eye } from 'lucide-react';
import { MenuCategory, MenuItem, DietaryTag } from '../../types';
import { ALLERGEN_DICT, DIETARY_LABELS, IMAGE_PRESETS } from '../../data/defaultData';

interface DishEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishToEdit?: MenuItem | null;
  defaultCategoryId?: string;
  categories: MenuCategory[];
  currency: string;
  onSave: (dishData: Omit<MenuItem, 'id'>, id?: string) => void;
  onAddCategory: (name: string) => MenuCategory;
}

export const DishEditModal: React.FC<DishEditModalProps> = ({
  isOpen,
  onClose,
  dishToEdit,
  defaultCategoryId,
  categories,
  currency,
  onSave,
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('12.50');
  const [category, setCategory] = useState('');
  const [portionSize, setPortionSize] = useState('');
  const [image, setImage] = useState('');
  const [dietary, setDietary] = useState<DietaryTag[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [isDailySpecial, setIsDailySpecial] = useState(false);

  // Inline category creation
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    if (dishToEdit) {
      setName(dishToEdit.name);
      setDescription(dishToEdit.description || '');
      setPrice(dishToEdit.price.toString());
      setCategory(dishToEdit.category);
      setPortionSize(dishToEdit.portionSize || '');
      setImage(dishToEdit.image || '');
      setDietary(dishToEdit.dietary || []);
      setAllergens(dishToEdit.allergens || []);
      setIsAvailable(dishToEdit.isAvailable !== false);
      setIsChefSpecial(!!dishToEdit.isChefSpecial);
      setIsDailySpecial(!!dishToEdit.isDailySpecial);
    } else {
      setName('');
      setDescription('');
      setPrice('12.50');
      setCategory(defaultCategoryId || (categories[0]?.id ?? ''));
      setPortionSize('');
      setImage(IMAGE_PRESETS[0]?.url || '');
      setDietary([]);
      setAllergens([]);
      setIsAvailable(true);
      setIsChefSpecial(false);
      setIsDailySpecial(false);
    }
  }, [dishToEdit, defaultCategoryId, categories, isOpen]);

  if (!isOpen) return null;

  const handleDietaryToggle = (tag: DietaryTag) => {
    setDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAllergenToggle = (code: string) => {
    setAllergens((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const created = onAddCategory(newCatName.trim());
    setCategory(created.id);
    setNewCatName('');
    setShowNewCatInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(price.replace(',', '.')) || 0;
    const dishData: Omit<MenuItem, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: category || categories[0]?.id || 'default',
      portionSize: portionSize.trim() || undefined,
      image: image.trim() || undefined,
      dietary,
      allergens,
      isAvailable,
      isChefSpecial,
      isDailySpecial,
    };

    onSave(dishData, dishToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-xl font-serif-display font-bold text-stone-900">
              {dishToEdit ? 'Gericht bearbeiten' : 'Neues Gericht anlegen'}
            </h3>
            <p className="text-xs text-stone-500">
              Änderungen werden sofort in der Speisekarte und auf der Website sichtbar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {/* Dish Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-800 mb-1">
                Name des Gerichts *
              </label>
              <input
                type="text"
                required
                placeholder="z.B. Tagliatelle al Tartufo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#c2410c] focus:outline-none text-stone-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Preis ({currency}) *
              </label>
              <input
                type="text"
                required
                placeholder="14.50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#c2410c] focus:outline-none text-stone-900 font-semibold"
              />
            </div>
          </div>

          {/* Category Selection + Inline Category Creator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-stone-800">
                Speisekarten-Kategorie *
              </label>
              <button
                type="button"
                onClick={() => setShowNewCatInput(!showNewCatInput)}
                className="text-xs text-[#c2410c] hover:underline font-medium"
              >
                {showNewCatInput ? 'Abbrechen' : '+ Neue Kategorie'}
              </button>
            </div>

            {showNewCatInput ? (
              <div className="flex gap-2 mb-2 p-2 bg-stone-100 rounded-xl border border-stone-300">
                <input
                  type="text"
                  placeholder="Kategoriename (z.B. Frische Salate)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="px-3 py-1.5 bg-[#c2410c] text-white rounded-lg text-xs font-semibold"
                >
                  Erstellen
                </button>
              </div>
            ) : null}

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#c2410c] focus:outline-none text-stone-900"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Portion Size */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Portionsgröße / Mengenangabe <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="z.B. Ø 33cm, ca. 250g, 0,75 l, für 2 Personen"
              value={portionSize}
              onChange={(e) => setPortionSize(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#c2410c] focus:outline-none text-stone-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Beschreibung & Zutaten
            </label>
            <textarea
              rows={3}
              placeholder="Beschreiben Sie Geschmack, frische Zutaten und Zubereitungsart..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#c2410c] focus:outline-none text-stone-900"
            />
          </div>

          {/* Special Flags & Availability */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <span className="font-semibold text-stone-800 block text-xs uppercase tracking-wider">
              Status & Hervorhebungen
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Availability */}
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                  isAvailable
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs font-semibold">
                  {isAvailable ? '✓ Verfügbar' : '✕ Ausverkauft'}
                </span>
              </label>

              {/* Daily Special */}
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                  isDailySpecial
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDailySpecial}
                  onChange={(e) => setIsDailySpecial(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="text-xs font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Tagesgericht
                </span>
              </label>

              {/* Chef Special */}
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                  isChefSpecial
                    ? 'bg-orange-50 border-orange-300 text-orange-900'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChefSpecial}
                  onChange={(e) => setIsChefSpecial(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span className="text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-orange-600" />
                  Chef-Empfehlung
                </span>
              </label>
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block font-semibold text-stone-800 mb-2">
              Kostformen / Ernährungshinweise
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DIETARY_LABELS) as DietaryTag[]).map((tag) => {
                const isSelected = dietary.includes(tag);
                const meta = DIETARY_LABELS[tag];
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleDietaryToggle(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? `${meta.color} ring-2 ring-stone-900/10`
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Selection: Custom URL or 1-Click Presets */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Foto zum Gericht
            </label>
            <div className="flex gap-3 mb-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
              />
              {image && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-300 shrink-0 bg-stone-100">
                  <img src={image} alt="Vorschau" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Quick Presets Carousel */}
            <div>
              <span className="text-[11px] text-stone-500 block mb-1.5">
                Oder wählen Sie ein passendes Foto per Klick:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    onClick={() => setImage(preset.url)}
                    className={`group relative rounded-lg overflow-hidden h-14 border transition-all ${
                      image === preset.url ? 'ring-2 ring-[#c2410c] border-[#c2410c]' : 'border-stone-200 opacity-80 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/20 flex items-end p-1">
                      <span className="text-[9px] text-white font-medium truncate drop-shadow-sm">
                        {preset.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Allergens Selection (A bis R) */}
          <div className="pt-2">
            <label className="block font-semibold text-stone-800 mb-1">
              Allergene kennzeichnen (EU Verordnung)
            </label>
            <p className="text-[11px] text-stone-500 mb-2">
              Wählen Sie die enthaltenen Allergene aus. Auf der Speisekarte wird automatisch der entsprechende Buchstabe angezeigt.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200 max-h-40 overflow-y-auto text-xs">
              {Object.entries(ALLERGEN_DICT).map(([code, title]) => {
                const isChecked = allergens.includes(code);
                return (
                  <label
                    key={code}
                    className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                      isChecked ? 'bg-amber-100/70 font-semibold text-stone-900' : 'hover:bg-stone-200/60 text-stone-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAllergenToggle(code)}
                      className="w-3.5 h-3.5 text-[#c2410c] rounded"
                    />
                    <span className="font-mono font-bold text-stone-900">{code}</span>
                    <span className="truncate text-[11px]">{title}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-xl font-medium transition-colors text-xs sm:text-sm"
          >
            Abbrechen
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold rounded-xl shadow-md transition-colors text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{dishToEdit ? 'Änderungen speichern' : 'Gericht zur Karte hinzufügen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
