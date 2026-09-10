import React from 'react';
import { Settings, Plus, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { MenuItem, MenuCategory } from '../../types';

interface AdminBarProps {
  cmsModeActive: boolean;
  onToggleCmsMode: () => void;
  onOpenCmsModal: () => void;
  onOpenAddDishModal: () => void;
  itemsCount: number;
  categoriesCount: number;
  specialsCount: number;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  cmsModeActive,
  onToggleCmsMode,
  onOpenCmsModal,
  onOpenAddDishModal,
  itemsCount,
  categoriesCount,
  specialsCount,
}) => {
  return (
    <aside
      aria-label="CMS Schnellzugriffsleiste"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-stone-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex flex-wrap items-center justify-between gap-3 animate-fade-in"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
          <Settings className="w-4 h-4 animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Restaurant CMS
            </span>
            <span className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700 hidden sm:inline">
              {itemsCount} Gerichte in {categoriesCount} Kategorien
            </span>
          </div>
          <p className="text-[11px] text-stone-400 hidden sm:block">
            {cmsModeActive
              ? 'Bearbeitungsmodus aktiv: Klicken Sie direkt auf Gerichte zum Bearbeiten.'
              : 'Gastansicht: Alle Änderungen wurden automatisch gespeichert.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle Direct Edit Mode vs Clean Preview */}
        <button
          onClick={onToggleCmsMode}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
            cmsModeActive
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
          title={cmsModeActive ? 'Direkte Bearbeitungs-Buttons ausblenden' : 'Bearbeitungs-Buttons auf der Karte einblenden'}
        >
          {cmsModeActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden xs:inline">{cmsModeActive ? 'Gast-Vorschau' : 'Bearbeiten-Modus'}</span>
        </button>

        {/* Quick Add Dish Button */}
        <button
          onClick={onOpenAddDishModal}
          className="flex items-center gap-1.5 bg-[#c2410c] hover:bg-[#ea580c] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Neues Gericht</span>
        </button>

        {/* Full CMS Modal Open */}
        <button
          onClick={onOpenCmsModal}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>CMS Zentrale</span>
        </button>
      </div>
    </aside>
  );
};
