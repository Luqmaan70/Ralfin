import React, { useState, useMemo, useCallback } from 'react';
import {
  SWGWire,
  SelectedWireItem,
} from './types';
import { DEFAULT_SWG_TABLE } from './data/swgData';
import { generateAlternateCombinations } from './utils/combinationEngine';
import { Header } from './components/Header';
import { SWGSelectionGrid } from './components/SWGSelectionGrid';
import { OriginalWiresBreakdown } from './components/OriginalWiresBreakdown';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { SWGTableModal } from './components/SWGTableModal';
import { FeedbackFooter } from './components/FeedbackFooter';
import { useLanguage } from './i18n';
import { Layers } from 'lucide-react';

const STORAGE_KEY_CUSTOM_TABLE = 'ralfin_swg_custom_table_v1';

export default function App() {
  const { t } = useLanguage();
  // SWG Table state (defaults to standard BS 3728 / IS 13730)
  const [swgTable, setSwgTable] = useState<SWGWire[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_TABLE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_SWG_TABLE;
  });

  // Selected Original Wires (do not preselect any SWG)
  const [selectedWires, setSelectedWires] = useState<SelectedWireItem[]>([]);

  // Calculation tolerance (allowable 0.5% - 3.0%, initially set to 1.5%)
  const [tolerancePct, setTolerancePct] = useState<number>(1.5);
  // Wire-to-wire variance tolerance (allowable 0% - 50%, initially set to 30%)
  const [maxVariancePct, setMaxVariancePct] = useState<number>(30);

  // Modals state
  const [isSWGTableOpen, setIsSWGTableOpen] = useState(false);

  // Save custom SWG table
  const handleUpdateSWGTable = (newTable: SWGWire[]) => {
    setSwgTable(newTable);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_TABLE, JSON.stringify(newTable));
    } catch (e) {
      // ignore
    }
  };

  const handleResetSWGTable = () => {
    setSwgTable(DEFAULT_SWG_TABLE);
    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_TABLE);
    } catch (e) {
      // ignore
    }
  };

  // Wire selection operations
  const handleToggleWire = useCallback((wire: SWGWire) => {
    setSelectedWires((prev) => {
      const existing = prev.find((item) => item.wire.swg === wire.swg);
      if (existing) {
        return prev.filter((item) => item.wire.swg !== wire.swg);
      }
      return [...prev, { wire, count: 1 }];
    });
  }, []);

  const handleIncrementWire = useCallback((wire: SWGWire) => {
    setSelectedWires((prev) => {
      const idx = prev.findIndex((item) => item.wire.swg === wire.swg);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], count: next[idx].count + 1 };
        return next;
      }
      return [...prev, { wire, count: 1 }];
    });
  }, []);

  const handleDecrementWire = useCallback((wire: SWGWire) => {
    setSelectedWires((prev) => {
      const idx = prev.findIndex((item) => item.wire.swg === wire.swg);
      if (idx >= 0) {
        if (prev[idx].count <= 1) {
          return prev.filter((item) => item.wire.swg !== wire.swg);
        }
        const next = [...prev];
        next[idx] = { ...next[idx], count: next[idx].count - 1 };
        return next;
      }
      return prev;
    });
  }, []);

  const handleRemoveIndividualWire = useCallback((swg: string) => {
    setSelectedWires((prev) => {
      const idx = prev.findIndex((item) => item.wire.swg === swg);
      if (idx >= 0) {
        if (prev[idx].count <= 1) {
          return prev.filter((item) => item.wire.swg !== swg);
        }
        const next = [...prev];
        next[idx] = { ...next[idx], count: next[idx].count - 1 };
        return next;
      }
      return prev;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedWires([]);
  }, []);

  // Compute total original cross-sectional area
  const originalTotalArea = useMemo(() => {
    return selectedWires.reduce(
      (sum, item) => sum + item.wire.area * item.count,
      0
    );
  }, [selectedWires]);

  // Generate parallel combination suggestions in real time
  const suggestions = useMemo(() => {
    if (originalTotalArea <= 0) return [];
    return generateAlternateCombinations({
      originalArea: originalTotalArea,
      originalWires: selectedWires,
      swgTable,
      tolerancePct,
      maxVariancePct,
    });
  }, [originalTotalArea, selectedWires, swgTable, tolerancePct, maxVariancePct]);

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans antialiased">
      {/* 1. Header with Company Branding & Developer Info */}
      <Header
        onOpenSWGTable={() => setIsSWGTableOpen(true)}
      />

      {/* 2. Top Summary & Live Total Callout Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Alternate Wire Gauge Calculator
            </span>
          </div>

          {/* Persistent Live Total Callout */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">{t('originalTotal')}:</span>
            <span className="font-mono font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-300">
              {originalTotalArea.toFixed(4)} mm²
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-5">
        {/* Top Grid: Wire Selection */}
        <SWGSelectionGrid
          swgTable={swgTable}
          selectedWires={selectedWires}
          onToggleWire={handleToggleWire}
          onIncrementWire={handleIncrementWire}
          onDecrementWire={handleDecrementWire}
          onClearAll={handleClearAll}
        />

        {/* Middle Section: Original Wires Breakdown (one wire per row) */}
        <OriginalWiresBreakdown
          selectedWires={selectedWires}
          totalArea={originalTotalArea}
          onRemoveIndividualWire={handleRemoveIndividualWire}
          onClearAll={handleClearAll}
        />

        {/* Bottom Section: Suggested Alternate Wire Combinations */}
        {originalTotalArea > 0 && (
          <SuggestionsPanel
            originalArea={originalTotalArea}
            suggestions={suggestions}
            tolerancePct={tolerancePct}
            onChangeTolerance={setTolerancePct}
            maxVariancePct={maxVariancePct}
            onChangeMaxVariance={setMaxVariancePct}
          />
        )}
      </main>

      {/* 4. Feedback & Developer Contact Footer */}
      <FeedbackFooter />

      {/* Modals */}
      <SWGTableModal
        isOpen={isSWGTableOpen}
        onClose={() => setIsSWGTableOpen(false)}
        swgTable={swgTable}
        onUpdateTable={handleUpdateSWGTable}
        onResetDefault={handleResetSWGTable}
      />
    </div>
  );
}
