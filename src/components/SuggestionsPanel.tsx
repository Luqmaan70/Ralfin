import React, { useState, useMemo } from 'react';
import { SuggestedCombination } from '../types';
import {
  Sliders,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  ChevronRight,
  Info,
  SlidersHorizontal,
} from 'lucide-react';

interface SuggestionsPanelProps {
  originalArea: number;
  suggestions: SuggestedCombination[];
  selectedCombination: SuggestedCombination | null;
  onSelectCombination: (comb: SuggestedCombination) => void;
  tolerancePct: number;
  onChangeTolerance: (tol: number) => void;
}

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  originalArea,
  suggestions,
  selectedCombination,
  onSelectCombination,
  tolerancePct,
  onChangeTolerance,
}) => {
  // Slider state for wire count: 0 means 'All' (1-8), 1..8 means exact wire count
  const [wireCountFilter, setWireCountFilter] = useState<number>(0);

  // Available wire counts in suggestions
  const wireCountCounts = useMemo(() => {
    const map: Record<number, number> = {};
    for (let i = 1; i <= 8; i++) map[i] = 0;
    suggestions.forEach((s) => {
      map[s.wireCount] = (map[s.wireCount] || 0) + 1;
    });
    return map;
  }, [suggestions]);

  // Filter suggestions by slider
  const displayedSuggestions = useMemo(() => {
    if (wireCountFilter === 0) return suggestions;
    return suggestions.filter((s) => s.wireCount === wireCountFilter);
  }, [suggestions, wireCountFilter]);

  // Group summary for quick pills
  const availableWireNumbers = useMemo(() => {
    const set = new Set<number>();
    suggestions.forEach((s) => set.add(s.wireCount));
    return Array.from(set).sort((a, b) => a - b);
  }, [suggestions]);

  if (originalArea <= 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header bar */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-700 to-amber-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-600/50 rounded-lg border border-amber-400/30">
            <Sliders className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Suggested Alternate Wire Combinations
            </h3>
            <p className="text-[11px] text-amber-200">
              Cross-sectional area within ±{tolerancePct}% • Strand variance ≤ 30% • Sorted 1 to 8 wires
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-amber-800/80 rounded-full border border-amber-500/40 font-semibold text-amber-100">
            {suggestions.length} matching combination{suggestions.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Slider Controls Bar directly above suggestions */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Filter Number of Wires:
            </span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              {wireCountFilter === 0 ? 'All Wires (1 to 8)' : `${wireCountFilter} Wire${wireCountFilter > 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Quick tolerance switch */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 self-start sm:self-auto">
            <span className="font-medium text-slate-500">Tolerance:</span>
            {[1.5, 1.8, 2.0].map((tol) => (
              <button
                key={tol}
                onClick={() => onChangeTolerance(tol)}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                  tolerancePct === tol
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-amber-400'
                }`}
              >
                ±{tol}%
              </button>
            ))}
          </div>
        </div>

        {/* The Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={wireCountFilter}
              onChange={(e) => setWireCountFilter(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
            />
          </div>

          {/* Slider Marks */}
          <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 font-medium px-1">
            <button
              onClick={() => setWireCountFilter(0)}
              className={`hover:text-amber-700 ${wireCountFilter === 0 ? 'text-amber-700 font-bold' : ''}`}
            >
              All (1-8)
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
              const count = wireCountCounts[n] || 0;
              return (
                <button
                  key={n}
                  onClick={() => setWireCountFilter(n)}
                  className={`flex flex-col items-center hover:text-amber-700 transition ${
                    wireCountFilter === n ? 'text-amber-700 font-extrabold' : ''
                  }`}
                >
                  <span>{n}W</span>
                  <span className={`text-[9px] ${count > 0 ? 'text-slate-600 font-bold' : 'text-slate-300'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Clickable Wire Count Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setWireCountFilter(0)}
            className={`px-2.5 py-1 text-xs rounded-md font-semibold transition ${
              wireCountFilter === 0
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-250 hover:bg-slate-100'
            }`}
          >
            Show All ({suggestions.length})
          </button>
          {availableWireNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setWireCountFilter(n)}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition flex items-center gap-1 ${
                wireCountFilter === n
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-250 hover:bg-slate-100'
              }`}
            >
              <span>{n} Wire{n > 1 ? 's' : ''}</span>
              <span className={`px-1 py-0.2 rounded-full text-[10px] ${
                wireCountFilter === n ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {wireCountCounts[n]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggestion Panels Container */}
      <div className="p-3 sm:p-4 bg-slate-100/60">
        {displayedSuggestions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <Info className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">
              No Combinations Found for {wireCountFilter === 0 ? 'Criteria' : `${wireCountFilter} Wires`}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Try adjusting the wire count slider or tolerance slightly (e.g. ±2.0%), or select another wire count where matching combinations exist.
            </p>
            {wireCountFilter !== 0 && (
              <button
                onClick={() => setWireCountFilter(0)}
                className="mt-3 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition"
              >
                View All Wire Counts ({suggestions.length})
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {displayedSuggestions.map((comb, index) => {
              const isSelected = selectedCombination?.id === comb.id;
              const isDiffPositive = comb.diff >= 0;

              // Summary string of gauges e.g. "2× 20 SWG + 1× 21 SWG"
              const gaugeCountMap = new Map<string, number>();
              comb.wires.forEach((w) => {
                gaugeCountMap.set(w.swg, (gaugeCountMap.get(w.swg) || 0) + 1);
              });
              const summaryTitle = Array.from(gaugeCountMap.entries())
                .map(([swg, cnt]) => `${cnt > 1 ? `${cnt}× ` : ''}${swg} SWG`)
                .join(' + ');

              return (
                <div
                  key={comb.id}
                  className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500 shadow-md'
                      : 'border-slate-250 hover:border-amber-400 hover:shadow-sm'
                  }`}
                >
                  {/* Top Bar of Small Panel */}
                  <div className="p-3 bg-gradient-to-r from-slate-50 to-amber-50/40 border-b border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-amber-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {summaryTitle}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {comb.wireCount} Wire Strand{comb.wireCount > 1 ? 's' : ''} in Parallel
                        </span>
                      </div>
                    </div>

                    {/* Tolerance Match Badge */}
                    <div
                      className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shrink-0 ${
                        comb.absDiffPct <= 0.8
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : comb.absDiffPct <= 1.5
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isDiffPositive ? (
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-blue-600" />
                      )}
                      <span>
                        {isDiffPositive ? '+' : ''}
                        {comb.diffPct.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Individual Wire Breakdown: ONE SINGLE WIRE PER ROW */}
                  <div className="p-3 space-y-2.5 flex-1">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Wire Totalling (One Wire Per Row)</span>
                      <span className="text-[10px] text-slate-400">
                        Strand Variance: {comb.maxVariancePct.toFixed(1)}% (≤30%)
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100/90 text-slate-600 text-[10px] uppercase font-semibold border-b border-slate-200">
                            <th className="py-1 px-2.5 w-10 text-center">Row</th>
                            <th className="py-1 px-2">SWG Gauge</th>
                            <th className="py-1 px-2 text-right">Bare Dia</th>
                            <th className="py-1 px-2.5 text-right">Area</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/80">
                          {comb.wires.map((wire, wIdx) => (
                            <tr key={`${comb.id}-${wIdx}`} className="hover:bg-amber-50/30">
                              <td className="py-1 px-2.5 text-center text-slate-400 font-mono text-[11px]">
                                {wIdx + 1}
                              </td>
                              <td className="py-1 px-2 font-bold text-slate-900">
                                {wire.swg} SWG
                              </td>
                              <td className="py-1 px-2 text-right font-mono text-slate-600 text-[11px]">
                                {wire.mm.toFixed(3)} mm
                              </td>
                              <td className="py-1 px-2.5 text-right font-mono font-semibold text-slate-800">
                                {wire.area.toFixed(4)} mm²
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {/* Totalling Row */}
                        <tfoot>
                          <tr className="bg-amber-100/60 border-t border-amber-300/80 font-bold text-slate-900">
                            <td colSpan={2} className="py-1.5 px-2.5 text-amber-900 text-xs">
                              COMBINED TOTAL
                            </td>
                            <td className="py-1.5 px-2 text-right text-[11px] text-slate-500">
                              {comb.wireCount} wire{comb.wireCount > 1 ? 's' : ''}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-mono font-extrabold text-amber-900 text-xs">
                              {comb.totalArea.toFixed(4)} mm²
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Comparison Box */}
                    <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-700">
                        <span>Original Total Area:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {originalArea.toFixed(4)} mm²
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span>Suggested Total Area:</span>
                        <span className="font-mono font-semibold text-amber-900">
                          {comb.totalArea.toFixed(4)} mm²
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-slate-800 font-semibold">
                        <span>Area Difference:</span>
                        <span className="font-mono">
                          {isDiffPositive ? '+' : ''}
                          {comb.diff.toFixed(4)} mm² ({isDiffPositive ? '+' : ''}
                          {comb.diffPct.toFixed(2)}%)
                        </span>
                      </div>

                      {/* Closest SWG wire from chart */}
                      <div className="pt-1 text-[11px] text-amber-800 flex items-center justify-between">
                        <span className="font-medium">Closest SWG to Difference:</span>
                        <span className="font-bold bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs font-mono">
                          {comb.closestWireDiff
                            ? `${comb.closestWireDiff.swg} SWG (${comb.closestWireDiff.area.toFixed(4)} mm²)`
                            : 'Negligible (< 50 SWG)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action: SELECT BUTTON */}
                  <div className="p-3 bg-slate-50 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => onSelectCombination(comb)}
                      className={`w-full py-2 px-3 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-xs ${
                        isSelected
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-slate-900 hover:bg-amber-600 text-white hover:text-white'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isSelected ? 'Selected for Job Card' : 'Select This Combination'}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                    </button>
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
