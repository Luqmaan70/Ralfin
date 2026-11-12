import React, { useState, useMemo } from 'react';
import { SWGWire, SelectedWireItem } from '../types';
import { COMMON_WINDING_SWG_LIST } from '../data/swgData';
import { Plus, Minus, Check, RotateCcw, Filter, Layers } from 'lucide-react';
import { useLanguage } from '../i18n';

interface SWGSelectionGridProps {
  swgTable: SWGWire[];
  selectedWires: SelectedWireItem[];
  onToggleWire: (wire: SWGWire) => void;
  onIncrementWire: (wire: SWGWire) => void;
  onDecrementWire: (wire: SWGWire) => void;
  onClearAll: () => void;
}

export const SWGSelectionGrid: React.FC<SWGSelectionGridProps> = ({
  swgTable,
  selectedWires,
  onToggleWire,
  onIncrementWire,
  onDecrementWire,
  onClearAll,
}) => {
  const { t } = useLanguage();
  const [filterMode, setFilterMode] = useState<'common' | 'all' | 'selected'>('common');

  // Map of selected SWG to count for O(1) lookup
  const selectedMap = useMemo(() => {
    const map = new Map<string, number>();
    selectedWires.forEach((item) => {
      map.set(item.wire.swg, item.count);
    });
    return map;
  }, [selectedWires]);

  const totalWiresCount = useMemo(() => {
    return selectedWires.reduce((sum, item) => sum + item.count, 0);
  }, [selectedWires]);

  // Filtered wires
  const filteredWires = useMemo(() => {
    if (filterMode === 'selected') {
      return swgTable.filter((wire) => (selectedMap.get(wire.swg) || 0) > 0);
    }
    if (filterMode === 'common') {
      return swgTable.filter((wire) => COMMON_WINDING_SWG_LIST.includes(wire.swg));
    }
    return swgTable; // 'all'
  }, [swgTable, filterMode, selectedMap]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header of Section */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-50 to-amber-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t('selectOriginalWires')}
            </h3>
            <p className="text-xs text-slate-500">
              Pick wires from the Standard Wire Gauge (SWG) chart. Multiple wires of the same gauge are supported.
            </p>
          </div>
        </div>

        {/* Selected count badge & clear */}
        <div className="flex items-center gap-2">
          {totalWiresCount > 0 && (
            <>
              <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                {totalWiresCount} {t('strands')}
              </span>
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                title={t('clearAll')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('clearAll')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs Bar (Search deleted as requested) */}
      <div className="px-3 sm:px-4 py-2 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-600">Gauge Filter:</span>
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilterMode('common')}
            className={`px-3 py-1 rounded-md transition ${
              filterMode === 'common'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('commonGauges')}
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-md transition ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('allGauges')} ({swgTable.length})
          </button>
          <button
            onClick={() => setFilterMode('selected')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1 ${
              filterMode === 'selected'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Selected</span>
            {totalWiresCount > 0 && (
              <span className="w-4 h-4 text-[10px] bg-amber-500 text-slate-950 font-bold rounded-full flex items-center justify-center">
                {totalWiresCount}
              </span>
            )}
          </button>
        </div>
      </div>



      {/* The SWG Wires Grid/List */}
      <div className="p-2 sm:p-3 max-h-[360px] sm:max-h-[420px] overflow-y-auto">
        {filteredWires.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No wire gauges match the search or filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredWires.map((wire) => {
              const count = selectedMap.get(wire.swg) || 0;
              const isSelected = count > 0;

              return (
                <div
                  key={wire.swg}
                  className={`relative p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-500 shadow-sm ring-1 ring-amber-400'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {/* Left: Checkbox & Wire Info */}
                  <div
                    onClick={() => onToggleWire(wire)}
                    className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                  >
                    {/* Custom Checkbox */}
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">
                          {wire.swg}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          SWG
                        </span>
                        {isSelected && count > 1 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-600 text-white">
                            ×{count}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        <span>⌀ {wire.mm.toFixed(3)} mm</span>
                        <span className="mx-1 text-slate-300">•</span>
                        <span className="font-mono text-slate-700 font-semibold">
                          {wire.area.toFixed(4)} mm²
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper (allows selecting more than one wire of the same SWG) */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isSelected ? (
                      <div className="flex items-center bg-white border border-amber-300 rounded-md shadow-2xs overflow-hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDecrementWire(wire);
                          }}
                          className="w-7 h-7 flex items-center justify-center hover:bg-amber-100 text-slate-700 active:bg-amber-200 transition"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900 select-none">
                          {count}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onIncrementWire(wire);
                          }}
                          className="w-7 h-7 flex items-center justify-center hover:bg-amber-100 text-slate-700 active:bg-amber-200 transition"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleWire(wire)}
                        className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded border border-transparent hover:border-amber-200 transition"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
