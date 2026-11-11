import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  SWGWire,
  SelectedWireItem,
  SuggestedCombination,
  MotorJobCard,
  CalculationHistoryItem,
} from './types';
import { DEFAULT_SWG_TABLE } from './data/swgData';
import { generateAlternateCombinations } from './utils/combinationEngine';
import { Header } from './components/Header';
import { SWGSelectionGrid } from './components/SWGSelectionGrid';
import { OriginalWiresBreakdown } from './components/OriginalWiresBreakdown';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { JobCardAndExportPanel } from './components/JobCardAndExportPanel';
import { HistoryModal } from './components/HistoryModal';
import { SWGTableModal } from './components/SWGTableModal';
import { FeedbackFooter } from './components/FeedbackFooter';
import {
  Layers,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  CheckCircle2,
  FileCheck2,
  Smartphone,
  Tablet,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'ralfin_swg_history_v1';
const STORAGE_KEY_CUSTOM_TABLE = 'ralfin_swg_custom_table_v1';
const STORAGE_KEY_JOB_CARD = 'ralfin_swg_job_card_draft';

export default function App() {
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

  // Selected Alternate Combination (when user clicks "Select")
  const [selectedCombination, setSelectedCombination] =
    useState<SuggestedCombination | null>(null);

  // Calculation tolerance (allowable 0.5% - 3.0%, initially set to 1.0%)
  const [tolerancePct, setTolerancePct] = useState<number>(1.0);
  // Strand-to-strand variance tolerance (allowable 0% - 50%, initially set to 30%)
  const [maxVariancePct, setMaxVariancePct] = useState<number>(30);

  // Helper to replace any references to Auma / Ralin with Ralfin Electricals, Bangalore
  const sanitizeAuma = (text?: string): string => {
    if (!text) return '';
    return text
      .replace(/\bauma(\s*india)?\b/gi, 'Ralfin Electricals, Bangalore')
      .replace(/\bapex(\s*textiles)?\b/gi, 'Ralfin Electricals, Bangalore')
      .replace(/\bralin(\s*electricals)?\b/gi, 'Ralfin Electricals, Bangalore');
  };

  // History list
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: CalculationHistoryItem) => {
            if (!item || !item.jobCard) return item;
            return {
              ...item,
              jobCard: {
                ...item.jobCard,
                clientName: sanitizeAuma(item.jobCard.clientName) || 'Ralfin Electricals, Bangalore',
                motorDesc: sanitizeAuma(item.jobCard.motorDesc),
                remarks: sanitizeAuma(item.jobCard.remarks),
              },
            };
          });
        }
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Motor Job Card State (clientName suggested as 'Ralfin Electricals, Bangalore', motor power KW and HP left blank)
  const [jobCard, setJobCard] = useState<MotorJobCard>(() => {
    const toUpper = (str?: string) => (str ? str.toUpperCase() : '');
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOB_CARD);
      if (saved) {
        const parsed = JSON.parse(saved);
        let client = sanitizeAuma(parsed.clientName);
        if (!client || /auma|apex|ralin/i.test(client)) {
          client = 'Ralfin Electricals, Bangalore';
        }
        return {
          ...parsed,
          clientName: toUpper(client || 'Ralfin Electricals, Bangalore'),
          motorDesc: parsed.motorDesc === '3-PHASE AC INDUCTION MOTOR' ? '' : toUpper(sanitizeAuma(parsed.motorDesc) || ''),
          serialNo: toUpper(parsed.serialNo || ''),
          motorType: toUpper(parsed.motorType || '3-PHASE SQUIRREL CAGE INDUCTION'),
          powerKw: parsed.powerKw === '0.75' ? '' : toUpper(parsed.powerKw || ''),
          hp: parsed.hp === '1.0' ? '' : toUpper(parsed.hp || ''),
          voltage: parsed.voltage === '415' ? '' : toUpper(parsed.voltage || ''),
          mounting: parsed.mounting === 'Foot Mounted (B3)' ? '' : toUpper(parsed.mounting || ''),
          bearings: toUpper(parsed.bearings || ''),
          remarks: toUpper(sanitizeAuma(parsed.remarks) || ''),
        };
      }
    } catch (e) {
      // fallback
    }
    return {
      clientName: 'RALFIN ELECTRICALS, BANGALORE',
      contactPhone: '',
      motorDesc: '',
      serialNo: '',
      motorType: '3-PHASE SQUIRREL CAGE INDUCTION',
      powerKw: '',
      hp: '',
      voltage: '',
      frequency: '50',
      poles: '4',
      phases: '3',
      rpm: '1440',
      mounting: '',
      bearings: '',
      remarks: '',
    };
  });

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSWGTableOpen, setIsSWGTableOpen] = useState(false);

  // Active view mode for narrow screens / mobile: 'select' | 'suggestions' | 'jobcard'
  const [activeTab, setActiveTab] = useState<'calc' | 'jobcard'>('calc');

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Save jobCard draft
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOB_CARD, JSON.stringify(jobCard));
    } catch (e) {
      // ignore
    }
  }, [jobCard]);

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

  // Total Original Area calculation
  const originalTotalArea = useMemo(() => {
    return selectedWires.reduce(
      (sum, item) => sum + item.wire.area * item.count,
      0
    );
  }, [selectedWires]);

  // Total individual original strands count
  const originalStrandsCount = useMemo(() => {
    return selectedWires.reduce((sum, item) => sum + item.count, 0);
  }, [selectedWires]);

  // Generate Suggestions (excluding exact same combination as original)
  const suggestions = useMemo(() => {
    if (!originalTotalArea || originalTotalArea <= 0) return [];
    return generateAlternateCombinations({
      originalArea: originalTotalArea,
      swgTable,
      tolerancePct,
      maxVariancePct,
      minWires: 1,
      maxWires: 8,
      originalWires: selectedWires,
    });
  }, [originalTotalArea, swgTable, tolerancePct, maxVariancePct, selectedWires]);

  // Reset selected combination if original wires change significantly
  useEffect(() => {
    if (selectedCombination) {
      // verify if current selection still matches roughly
      const diff = Math.abs(selectedCombination.totalArea - originalTotalArea);
      if (diff / originalTotalArea > 0.05) {
        setSelectedCombination(null);
        setActiveTab('calc');
      }
    }
  }, [originalTotalArea]);

  // Toggle wire selection in grid (add with 1 count or remove)
  const handleToggleWire = useCallback((wire: SWGWire) => {
    setSelectedWires((prev) => {
      const existing = prev.find((item) => item.wire.swg === wire.swg);
      if (existing) {
        return prev.filter((item) => item.wire.swg !== wire.swg);
      } else {
        return [...prev, { wire, count: 1 }];
      }
    });
  }, []);

  // Increment wire count
  const handleIncrementWire = useCallback((wire: SWGWire) => {
    setSelectedWires((prev) => {
      const existing = prev.find((item) => item.wire.swg === wire.swg);
      if (existing) {
        return prev.map((item) =>
          item.wire.swg === wire.swg ? { ...item, count: item.count + 1 } : item
        );
      } else {
        return [...prev, { wire, count: 1 }];
      }
    });
  }, []);

  // Decrement wire count
  const handleDecrementWire = useCallback((wire: SWGWire) => {
    setSelectedWires((prev) => {
      const existing = prev.find((item) => item.wire.swg === wire.swg);
      if (!existing) return prev;
      if (existing.count > 1) {
        return prev.map((item) =>
          item.wire.swg === wire.swg ? { ...item, count: item.count - 1 } : item
        );
      } else {
        return prev.filter((item) => item.wire.swg !== wire.swg);
      }
    });
  }, []);

  // Remove single wire strand by gauge
  const handleRemoveIndividualWire = useCallback((swg: string) => {
    setSelectedWires((prev) => {
      const existing = prev.find((item) => item.wire.swg === swg);
      if (!existing) return prev;
      if (existing.count > 1) {
        return prev.map((item) =>
          item.wire.swg === swg ? { ...item, count: item.count - 1 } : item
        );
      }
      return prev.filter((item) => item.wire.swg !== swg);
    });
  }, []);

  // Clear all selections
  const handleClearAll = useCallback(() => {
    setSelectedWires([]);
    setSelectedCombination(null);
    setActiveTab('calc');
  }, []);

  // Presets
  const handleApplyPreset = useCallback(
    (presetKey: string) => {
      const findW = (g: string) => swgTable.find((w) => w.swg === g);
      if (presetKey === 'single18') {
        const w18 = findW('18');
        if (w18) setSelectedWires([{ wire: w18, count: 1 }]);
      } else if (presetKey === 'mix18_20') {
        const w18 = findW('18');
        const w20 = findW('20');
        if (w18 && w20) {
          setSelectedWires([
            { wire: w18, count: 1 },
            { wire: w20, count: 1 },
          ]);
        }
      } else if (presetKey === 'double20') {
        const w20 = findW('20');
        if (w20) setSelectedWires([{ wire: w20, count: 2 }]);
      } else if (presetKey === 'triple22') {
        const w22 = findW('22');
        if (w22) setSelectedWires([{ wire: w22, count: 3 }]);
      }
      setSelectedCombination(null);
      setActiveTab('calc');
    },
    [swgTable]
  );

  // Handle Select Combination
  // "On clicking the select button, the other suggestions can disappear and this information including original combination and its area and the new selected combination and its area can be saved in a pdf file, and shared."
  const handleSelectCombination = (comb: SuggestedCombination) => {
    setSelectedCombination(comb);
    setActiveTab('jobcard');

    setTimeout(() => {
      const el = document.getElementById('engineering-verification-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);

    // Auto record to history
    const historyItem: CalculationHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      originalWires: selectedWires.map((item) => ({
        swg: item.wire.swg,
        mm: item.wire.mm,
        area: item.wire.area,
        count: item.count,
      })),
      originalTotalArea,
      selectedCombination: comb,
      jobCard,
    };

    setHistory((prev) => [historyItem, ...prev.slice(0, 29)]);
  };

  // Load history item
  const handleLoadHistoryItem = (item: CalculationHistoryItem) => {
    const loadedSelectedWires: SelectedWireItem[] = item.originalWires
      .map((ow) => {
        const wire =
          swgTable.find((w) => w.swg === ow.swg) || {
            swg: ow.swg,
            swgNum: parseInt(ow.swg, 10) || 0,
            mm: ow.mm,
            inch: ow.mm / 25.4,
            area: ow.area,
          };
        return {
          wire,
          count: ow.count,
        };
      })
      .filter(Boolean);

    setSelectedWires(loadedSelectedWires);
    setSelectedCombination(item.selectedCombination);
    if (item.jobCard) {
      setJobCard(item.jobCard);
    }
    setIsHistoryOpen(false);
    setActiveTab('jobcard');
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your calculation history?')) {
      setHistory([]);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans antialiased">
      {/* 1. Header with Company Branding & Developer Info */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSWGTable={() => setIsSWGTableOpen(true)}
        historyCount={history.length}
      />

      {/* 2. Mobile/Tablet/Foldable Step Indicator Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
          {/* Step tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('calc')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === 'calc'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Wire Selection & Suggestions</span>
            </button>

            <button
              onClick={() => {
                if (selectedCombination) setActiveTab('jobcard');
              }}
              disabled={!selectedCombination}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === 'jobcard'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : selectedCombination
                  ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>2. Motor Job Card & PDF Export</span>
              {selectedCombination && activeTab !== 'jobcard' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>
          </div>

          {/* Persistent Live Total Callout */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-500">Original Total:</span>
            <span className="font-mono font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              {originalTotalArea.toFixed(4)} mm²
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-5">
        {activeTab === 'jobcard' && selectedCombination ? (
          /* When a suggestion is selected: other suggestions disappear and Job Card with PDF export is shown */
          <JobCardAndExportPanel
            originalWires={selectedWires}
            originalTotalArea={originalTotalArea}
            selectedCombination={selectedCombination}
            jobCard={jobCard}
            onChangeJobCard={setJobCard}
            onBackToSuggestions={() => setActiveTab('calc')}
            onSavedToHistory={() => {
              // already added, or can update
            }}
            tolerancePct={tolerancePct}
            maxVariancePct={maxVariancePct}
          />
        ) : (
          /* Main Calculation Mode: Selection Panel + Breakdown + Suggestions */
          <div className="space-y-5">
            {/* Top Grid: Wire Selection */}
            <SWGSelectionGrid
              swgTable={swgTable}
              selectedWires={selectedWires}
              onToggleWire={handleToggleWire}
              onIncrementWire={handleIncrementWire}
              onDecrementWire={handleDecrementWire}
              onClearAll={handleClearAll}
              onApplyPreset={handleApplyPreset}
            />

            {/* Middle Section: Original Wires Breakdown (Showing the totalling with one wire per row) */}
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
                selectedCombination={selectedCombination}
                onSelectCombination={handleSelectCombination}
                tolerancePct={tolerancePct}
                onChangeTolerance={setTolerancePct}
                maxVariancePct={maxVariancePct}
                onChangeMaxVariance={setMaxVariancePct}
              />
            )}
          </div>
        )}
      </main>

      {/* 4. Feedback & Developer Contact Footer */}
      <FeedbackFooter />

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadHistoryItem={handleLoadHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />

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
