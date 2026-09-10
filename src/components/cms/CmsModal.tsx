import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  Search,
  Settings,
  Sparkles,
  Clock,
  MapPin,
  Flame,
  Star,
  Download,
  Upload,
  RotateCcw,
  CalendarCheck,
  Phone,
  Mail,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { MenuCategory, MenuItem, RestaurantInfo, TableReservation } from '../../types';

interface CmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  restaurantInfo: RestaurantInfo;
  reservations: TableReservation[];
  onOpenDishModal: (dish?: MenuItem, defaultCategory?: string) => void;
  onDeleteDish: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onToggleDailySpecial: (id: string) => void;
  onToggleChefSpecial: (id: string) => void;
  onAddCategory: (name: string, description?: string) => MenuCategory;
  onUpdateCategory: (id: string, updates: Partial<MenuCategory>) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateRestaurantInfo: (updates: Partial<RestaurantInfo>) => void;
  onResetToDefaults: () => void;
  onExportData: () => string;
  onImportData: (json: string) => boolean;
}

type CmsTab = 'dishes' | 'categories' | 'specials' | 'restaurant' | 'reservations' | 'backup';

export const CmsModal: React.FC<CmsModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  categories,
  restaurantInfo,
  reservations,
  onOpenDishModal,
  onDeleteDish,
  onToggleAvailability,
  onToggleDailySpecial,
  onToggleChefSpecial,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onUpdateRestaurantInfo,
  onResetToDefaults,
  onExportData,
  onImportData,
}) => {
  const [activeTab, setActiveTab] = useState<CmsTab>('dishes');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Categories tab local state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [editingCatDesc, setEditingCatDesc] = useState('');

  // Restaurant details form local state
  const [infoForm, setInfoForm] = useState<RestaurantInfo>(restaurantInfo);
  const [infoSavedSuccess, setInfoSavedSuccess] = useState(false);

  // Backup tab local state
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredDishes = menuItems.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRestaurantInfo(infoForm);
    setInfoSavedSuccess(true);
    setTimeout(() => setInfoSavedSuccess(false), 3000);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), newCatDesc.trim() || undefined);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleSaveCategoryEdit = (id: string) => {
    if (!editingCatName.trim()) return;
    onUpdateCategory(id, { name: editingCatName.trim(), description: editingCatDesc.trim() });
    setEditingCatId(null);
  };

  const handleDownloadExport = () => {
    const jsonStr = onExportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speisekarte-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = onImportData(importText);
    if (success) {
      setImportStatus('Erfolgreich importiert!');
      setImportText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Fehler: Ungültiges JSON-Format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 flex flex-col h-[92vh] animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-display text-white">
                Speisekarten-CMS & Verwaltung
              </h2>
              <p className="text-xs text-stone-400">
                Verwalten Sie Speisen, Preise, Kategorien und Restaurantdetails in Echtzeit.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-100 px-6 pt-3 border-b border-stone-200 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'dishes'
                ? 'bg-white text-[#c2410c] shadow-xs border-t border-x border-stone-200 -mb-px'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Speisekarte ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-white text-[#c2410c] shadow-xs border-t border-x border-stone-200 -mb-px'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Kategorien ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('specials')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'specials'
                ? 'bg-white text-[#c2410c] shadow-xs border-t border-x border-stone-200 -mb-px'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tagesangebote & Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('restaurant')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'restaurant'
                ? 'bg-white text-[#c2410c] shadow-xs border-t border-x border-stone-200 -mb-px'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Restaurantdaten & Öffnungszeiten</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-white text-[#c2410c] shadow-xs border-t border-x border-stone-200 -mb-px'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Reservierungen ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'backup'
                ? 'bg-white text-[#c2410c] shadow-xs border-t border-x border-stone-200 -mb-px'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Sicherung & Export</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {/* TAB 1: DISHES */}
          {activeTab === 'dishes' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex flex-1 gap-2 max-w-lg">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Speise suchen..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                  >
                    <option value="all">Alle Kategorien</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => onOpenDishModal(undefined, categoryFilter !== 'all' ? categoryFilter : undefined)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#c2410c] hover:bg-[#9a3412] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Neues Gericht anlegen</span>
                </button>
              </div>

              {/* Dish List Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Gericht</th>
                      <th className="py-3 px-4 hidden md:table-cell">Kategorie</th>
                      <th className="py-3 px-4">Preis</th>
                      <th className="py-3 px-4 text-center">Status / Aktionen</th>
                      <th className="py-3 px-4 text-right">Verwaltung</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredDishes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-stone-500">
                          Keine Gerichte gefunden. Erstellen Sie jetzt ein neues Gericht!
                        </td>
                      </tr>
                    ) : (
                      filteredDishes.map((dish) => {
                        const cat = categories.find((c) => c.id === dish.category);
                        return (
                          <tr key={dish.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {dish.image ? (
                                  <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-stone-900 leading-snug">
                                    {dish.name}
                                  </div>
                                  <div className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                                    {dish.description}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 hidden md:table-cell text-stone-600 text-xs">
                              <span className="bg-stone-100 px-2 py-1 rounded-md">
                                {cat ? cat.name : 'Allgemein'}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-bold text-[#c2410c] whitespace-nowrap">
                              {dish.price.toFixed(2).replace('.', ',')} {restaurantInfo.currency}
                            </td>

                            {/* Quick toggles */}
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {/* Availability Toggle */}
                                <button
                                  onClick={() => onToggleAvailability(dish.id)}
                                  className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                                    dish.isAvailable
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : 'bg-red-50 text-red-800 border-red-300'
                                  }`}
                                  title="Verfügbarkeit umschalten"
                                >
                                  {dish.isAvailable ? '✓ Lieferbar' : '✕ Ausverkauft'}
                                </button>

                                {/* Daily Special Toggle */}
                                <button
                                  onClick={() => onToggleDailySpecial(dish.id)}
                                  className={`p-1.5 rounded-md border transition-colors ${
                                    dish.isDailySpecial
                                      ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                                      : 'bg-stone-100 text-stone-400 border-stone-200 hover:text-stone-700'
                                  }`}
                                  title={
                                    dish.isDailySpecial
                                      ? 'Als Tagesgericht aktiv (Klick zum Entfernen)'
                                      : 'Als Tagesgericht markieren'
                                  }
                                >
                                  <Flame className="w-3.5 h-3.5 fill-current" />
                                </button>

                                {/* Chef Special Toggle */}
                                <button
                                  onClick={() => onToggleChefSpecial(dish.id)}
                                  className={`p-1.5 rounded-md border transition-colors ${
                                    dish.isChefSpecial
                                      ? 'bg-[#c2410c] text-white border-transparent shadow-xs'
                                      : 'bg-stone-100 text-stone-400 border-stone-200 hover:text-stone-700'
                                  }`}
                                  title={
                                    dish.isChefSpecial
                                      ? 'Chef-Empfehlung aktiv (Klick zum Entfernen)'
                                      : 'Als Chef-Empfehlung markieren'
                                  }
                                >
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                </button>
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => onOpenDishModal(dish)}
                                  className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-200 rounded-lg transition-colors"
                                  title="Bearbeiten"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Gericht "${dish.name}" wirklich löschen?`)) {
                                      onDeleteDish(dish.id);
                                    }
                                  }}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Löschen"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Neue Kategorie anlegen
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Erstellen Sie neue Abschnitte in Ihrer Speisekarte (z.B. &bdquo;Saisonale Wildgerichte&ldquo;, &bdquo;Mittagsmenü&ldquo; oder &bdquo;Cocktails&ldquo;).
                </p>
                <form onSubmit={handleCreateCategory} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Name der Kategorie (z.B. Hausgemachte Desserts)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                    />
                    <input
                      type="text"
                      placeholder="Kurze Beschreibung (optional)"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c2410c] hover:bg-[#9a3412] text-white rounded-xl text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Kategorie hinzufügen</span>
                  </button>
                </form>
              </div>

              {/* List of categories */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Vorhandene Kategorien
                </h4>
                {categories.map((cat, idx) => {
                  const count = menuItems.filter((i) => i.category === cat.id).length;
                  const isEditing = editingCatId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      {isEditing ? (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            value={editingCatDesc}
                            onChange={(e) => setEditingCatDesc(e.target.value)}
                            placeholder="Beschreibung"
                            className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">{cat.name}</span>
                            <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                              {count} {count === 1 ? 'Gericht' : 'Gerichte'}
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-xs text-stone-500 mt-0.5">{cat.description}</p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveCategoryEdit(cat.id)}
                              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                            >
                              Speichern
                            </button>
                            <button
                              onClick={() => setEditingCatId(null)}
                              className="px-2 py-1 text-stone-500 text-xs hover:underline"
                            >
                              Abbrechen
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingCatId(cat.id);
                                setEditingCatName(cat.name);
                                setEditingCatDesc(cat.description || '');
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                              title="Umbenennen"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Kategorie "${cat.name}" wirklich löschen? Enthaltene Gerichte werden automatisch verschoben.`
                                  )
                                ) {
                                  onDeleteCategory(cat.id);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              title="Löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SPECIALS & BANNER */}
          {activeTab === 'specials' && (
            <div className="space-y-6 max-w-3xl">
              {/* Announcement Banner CMS */}
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Hervorgehobenes Ankündigungs-Banner (Header)</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-900">
                    <input
                      type="checkbox"
                      checked={infoForm.showAnnouncement}
                      onChange={(e) => {
                        const updated = { ...infoForm, showAnnouncement: e.target.checked };
                        setInfoForm(updated);
                        onUpdateRestaurantInfo({ showAnnouncement: e.target.checked });
                      }}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>Banner auf der Startseite anzeigen</span>
                  </label>
                </div>

                <p className="text-xs text-amber-800">
                  Zeigen Sie Gästen sofort wichtige Aktionen (z.B. &bdquo;Heute frischer Fischmarkt&ldquo;, &bdquo;Trüffelwoche&ldquo; oder &bdquo;Geschlossene Gesellschaft ab 20:00 Uhr&ldquo;).
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={infoForm.announcement || ''}
                    onChange={(e) => setInfoForm({ ...infoForm, announcement: e.target.value })}
                    placeholder="z.B. Frische Trüffel-Woche: Entdecken Sie unsere hausgemachten Tagliolini!"
                    className="flex-1 px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900"
                  />
                  <button
                    onClick={() => {
                      onUpdateRestaurantInfo({ announcement: infoForm.announcement });
                      alert('Banner-Text gespeichert!');
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Aktualisieren
                  </button>
                </div>
              </div>

              {/* Current Active Specials Overview */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3">
                  Aktuelle Tagesangebote & Chef-Empfehlungen
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {menuItems.map((dish) => (
                    <div
                      key={dish.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        dish.isDailySpecial || dish.isChefSpecial
                          ? 'bg-amber-50/50 border-amber-300'
                          : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-stone-900 truncate">
                          {dish.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {dish.price.toFixed(2).replace('.', ',')} {restaurantInfo.currency}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onToggleDailySpecial(dish.id)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                            dish.isDailySpecial
                              ? 'bg-amber-500 text-stone-950 border-amber-600'
                              : 'bg-stone-100 text-stone-500 border-stone-200'
                          }`}
                        >
                          Tageshit
                        </button>
                        <button
                          onClick={() => onToggleChefSpecial(dish.id)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                            dish.isChefSpecial
                              ? 'bg-[#c2410c] text-white border-transparent'
                              : 'bg-stone-100 text-stone-500 border-stone-200'
                          }`}
                        >
                          Chef-Wahl
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESTAURANT INFO & OPENING HOURS */}
          {activeTab === 'restaurant' && (
            <form onSubmit={handleSaveInfo} className="space-y-6 max-w-3xl">
              {infoSavedSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Restaurantdaten erfolgreich gespeichert!</span>
                </div>
              )}

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="text-sm font-bold text-stone-900">Allgemeine Restaurantangaben</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Name des Restaurants *
                    </label>
                    <input
                      type="text"
                      required
                      value={infoForm.name}
                      onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Küche / Ausrichtung
                    </label>
                    <input
                      type="text"
                      value={infoForm.cuisine}
                      onChange={(e) => setInfoForm({ ...infoForm, cuisine: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Slogan / Untertitel
                    </label>
                    <input
                      type="text"
                      value={infoForm.tagline}
                      onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Telefonnummer
                    </label>
                    <input
                      type="text"
                      value={infoForm.phone}
                      onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={infoForm.email}
                      onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Straße & Hausnummer
                    </label>
                    <input
                      type="text"
                      value={infoForm.address.street}
                      onChange={(e) =>
                        setInfoForm({
                          ...infoForm,
                          address: { ...infoForm.address, street: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      PLZ & Ort
                    </label>
                    <input
                      type="text"
                      value={infoForm.address.zipCity}
                      onChange={(e) =>
                        setInfoForm({
                          ...infoForm,
                          address: { ...infoForm.address, zipCity: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Opening hours schedule */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <h4 className="text-sm font-bold text-stone-900">
                  Öffnungszeiten für jeden Wochentag
                </h4>

                <div className="space-y-2">
                  {infoForm.openingHours.map((item, idx) => (
                    <div
                      key={item.day}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-white rounded-xl border border-stone-200 text-xs"
                    >
                      <span className="w-28 font-bold text-stone-900">{item.day}:</span>

                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="text"
                          disabled={item.isClosed}
                          value={item.hours}
                          onChange={(e) => {
                            const newHours = [...infoForm.openingHours];
                            newHours[idx] = { ...newHours[idx], hours: e.target.value };
                            setInfoForm({ ...infoForm, openingHours: newHours });
                          }}
                          className={`flex-1 px-2.5 py-1.5 border rounded-lg ${
                            item.isClosed
                              ? 'bg-stone-100 text-stone-400 border-stone-200'
                              : 'bg-white text-stone-900 border-stone-300'
                          }`}
                        />

                        <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-stone-600 font-medium">
                          <input
                            type="checkbox"
                            checked={!!item.isClosed}
                            onChange={(e) => {
                              const newHours = [...infoForm.openingHours];
                              newHours[idx] = {
                                ...newHours[idx],
                                isClosed: e.target.checked,
                                hours: e.target.checked ? 'Ruhetag' : '12:00 - 22:00',
                              };
                              setInfoForm({ ...infoForm, openingHours: newHours });
                            }}
                            className="w-3.5 h-3.5 rounded text-amber-600"
                          />
                          <span>Ruhetag</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#c2410c] hover:bg-[#9a3412] text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-colors"
                >
                  Restaurantdaten & Zeiten speichern
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Online-Tischreservierungen
                  </h3>
                  <p className="text-xs text-stone-500">
                    Über das Buchungsformular auf der Website eingegangene Reservierungen.
                  </p>
                </div>
              </div>

              {reservations.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-sm">
                  Noch keine Reservierungen eingegangen. Wenn Gäste über die Website buchen, erscheinen sie hier.
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-stone-900 text-base">{res.name}</span>
                          <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-semibold">
                            {res.guests} {res.guests === 1 ? 'Gast' : 'Gäste'}
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            Bestätigt
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                          <div className="flex items-center gap-1 font-semibold text-stone-800">
                            <CalendarCheck className="w-3.5 h-3.5 text-[#c2410c]" />
                            <span>{res.date} um {res.time} Uhr</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            <a href={`tel:${res.phone}`} className="hover:underline">
                              {res.phone}
                            </a>
                          </div>
                          {res.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-stone-400" />
                              <a href={`mailto:${res.email}`} className="hover:underline">
                                {res.email}
                              </a>
                            </div>
                          )}
                        </div>

                        {res.specialRequests && (
                          <p className="mt-2 text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100">
                            <strong>Wünsche:</strong> {res.specialRequests}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-2xl">
              {/* Export */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Speisekarte & Daten sichern (JSON Export)
                </h4>
                <p className="text-xs text-stone-500 mb-4">
                  Laden Sie eine Sicherungskopie aller Ihrer Speisen, Preise, Kategorien und Einstellungen als Datei herunter.
                </p>
                <button
                  onClick={handleDownloadExport}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Speisekarte als JSON herunterladen</span>
                </button>
              </div>

              {/* Import */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-sm font-bold text-stone-900">
                  Speisekarte wiederherstellen (JSON Import)
                </h4>
                <p className="text-xs text-stone-500">
                  Fügen Sie hier eine zuvor gesicherte JSON-Speisekarte ein, um alle Daten wiederherzustellen.
                </p>

                <textarea
                  rows={4}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='{"version": "1.0", "menuItems": [...] }'
                  className="w-full p-3 font-mono text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#c2410c] focus:outline-none"
                />

                {importStatus && (
                  <div
                    className={`p-2.5 rounded-lg text-xs font-semibold ${
                      importStatus.startsWith('Erfolgreich')
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-red-100 text-red-900'
                    }`}
                  >
                    {importStatus}
                  </div>
                )}

                <button
                  onClick={handleImport}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import ausführen</span>
                </button>
              </div>

              {/* Reset to Factory Default */}
              <div className="p-5 bg-red-50 rounded-2xl border border-red-200 space-y-3">
                <h4 className="text-sm font-bold text-red-950 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Zurücksetzen auf Standard-Speisekarte</span>
                </h4>
                <p className="text-xs text-red-800">
                  Setzt die gesamte Speisekarte wieder auf das vorbereitete mediterrane Muster-Menü mit 14 Beispielgerichten zurück.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Möchten Sie wirklich alle aktuellen Gerichte durch das Standard-Menü ersetzen?')) {
                      onResetToDefaults();
                      alert('Speisekarte wurde erfolgreich auf Standard zurückgesetzt!');
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Auf Standard-Menü zurücksetzen</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>Änderungen werden automatisch im Browser gespeichert.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold"
          >
            Zurück zur Website
          </button>
        </div>
      </div>
    </div>
  );
};
