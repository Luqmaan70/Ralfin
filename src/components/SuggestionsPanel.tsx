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
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../i18n';

interface SuggestionsPanelProps {
  originalArea: number;
  suggestions: SuggestedCombination[];
  selectedCombination: SuggestedCombination | null;
  onSelectCombination: (comb: SuggestedCombination) => void;
  tolerancePct: number;
  onChangeTolerance: (tol: number) => void;
  maxVariancePct: number;
  onChangeMaxVariance: (variance: number) => void;
}

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  originalArea,
  suggestions,
  selectedCombination,
  onSelectCombination,
  tolerancePct,
  onChangeTolerance,
  maxVariancePct,
  onChangeMaxVariance,
}) => {
  const { t } = useLanguage();
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
              {t('step2Suggested')}
            </h3>
            <p className="text-[11px] text-amber-200">
              {t('leastWiresFirst')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-amber-800/80 rounded-full border border-amber-500/40 font-semibold text-amber-100">
            {suggestions.length} {t('found')}
          </span>
        </div>
      </div>

      {/* DUAL COMPACT NEON SLIDERS: Area Tolerance (Neon Yellow) + Strand Variance (Neon Green) */}
      <div className="p-2 sm:p-2.5 bg-slate-900 border-b border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wide text-white uppercase">
              Calculation Limit Sliders
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Real-time filtering of parallel wire solutions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* SLIDER 1: AREA TOLERANCE - COMPACT NEON YELLOW (0.5% to 3.0%, initial 1.5%) */}
          <div className="bg-slate-950 rounded-lg p-2 sm:p-2.5 border border-yellow-400/90 shadow-xs space-y-1.5 transition-all">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15] animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-yellow-300 uppercase">
                    {t('finalAreaTolerance')}
                  </h4>
                  <span className="text-[9px] text-yellow-200/70 font-medium">
                    Limit: 0.5% – 3.0%
                  </span>
                </div>
              </div>

              {/* Compact Neon Yellow Value Badge */}
              <div className="px-2 py-0.5 rounded-md bg-yellow-400 text-slate-950 font-black font-mono text-xs shadow-xs tracking-tight shrink-0 border border-yellow-200">
                ±{tolerancePct.toFixed(1)}%
              </div>
            </div>

            {/* Neon Yellow Range Input */}
            <div className="space-y-1">
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={tolerancePct}
                onChange={(e) => onChangeTolerance(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 focus:outline-none ring-1 ring-yellow-400/40"
              />

              {/* Quick shortcut tick markers */}
              <div className="flex justify-between text-[9px] font-semibold text-yellow-300/80 px-0.5">
                <button
                  type="button"
                  onClick={() => onChangeTolerance(0.5)}
                  className={`hover:text-yellow-100 transition ${tolerancePct === 0.5 ? 'text-white underline font-black' : ''}`}
                >
                  0.5%
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTolerance(1.0)}
                  className={`hover:text-yellow-100 transition ${tolerancePct === 1.0 ? 'text-white underline font-black' : ''}`}
                >
                  1.0%
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTolerance(1.5)}
                  className={`hover:text-yellow-100 transition px-1 py-0.2 rounded bg-yellow-400/25 text-yellow-300 ${tolerancePct === 1.5 ? 'ring-1 ring-yellow-400 text-white font-black' : ''}`}
                >
                  1.5% (Initial)
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTolerance(1.8)}
                  className={`hover:text-yellow-100 transition ${tolerancePct === 1.8 ? 'text-white underline font-black' : ''}`}
                >
                  1.8%
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTolerance(2.0)}
                  className={`hover:text-yellow-100 transition ${tolerancePct === 2.0 ? 'text-white underline font-black' : ''}`}
                >
                  2.0%
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTolerance(3.0)}
                  className={`hover:text-yellow-100 transition ${tolerancePct === 3.0 ? 'text-white underline font-black' : ''}`}
                >
                  3.0% (Max)
                </button>
              </div>
            </div>
          </div>

          {/* SLIDER 2: STRAND VARIANCE - COMPACT NEON GREEN (0% to 50%, initial 30%) */}
          <div className="bg-slate-950 rounded-lg p-2 sm:p-2.5 border border-emerald-400/90 shadow-xs space-y-1.5 transition-all">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                    {t('strandVariance')}
                  </h4>
                  <span className="text-[9px] text-emerald-200/70 font-medium">
                    Variation: 0% – 50%
                  </span>
                </div>
              </div>

              {/* Compact Neon Green Value Badge */}
              <div className="px-2 py-0.5 rounded-md bg-emerald-400 text-slate-950 font-black font-mono text-xs shadow-xs tracking-tight shrink-0 border border-emerald-200">
                ≤ {maxVariancePct}%
              </div>
            </div>

            {/* Neon Green Range Input */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={maxVariancePct}
                onChange={(e) => onChangeMaxVariance(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none ring-1 ring-emerald-400/40"
              />

              {/* Quick shortcut tick markers */}
              <div className="flex justify-between text-[9px] font-semibold text-emerald-300/80 px-0.5">
                <button
                  type="button"
                  onClick={() => onChangeMaxVariance(0)}
                  className={`hover:text-emerald-100 transition ${maxVariancePct === 0 ? 'text-white underline font-black' : ''}`}
                >
                  0% ({t('identical')})
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMaxVariance(15)}
                  className={`hover:text-emerald-100 transition ${maxVariancePct === 15 ? 'text-white underline font-black' : ''}`}
                >
                  15%
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMaxVariance(30)}
                  className={`hover:text-emerald-100 transition px-1 py-0.2 rounded bg-emerald-400/25 text-emerald-300 ${maxVariancePct === 30 ? 'ring-1 ring-emerald-400 text-white font-black' : ''}`}
                >
                  30% ({t('recommended')})
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMaxVariance(40)}
                  className={`hover:text-emerald-100 transition ${maxVariancePct === 40 ? 'text-white underline font-black' : ''}`}
                >
                  40%
                </button>
                <button
                  type="button"
                  onClick={() => onChangeMaxVariance(50)}
                  className={`hover:text-emerald-100 transition ${maxVariancePct === 50 ? 'text-white underline font-black' : ''}`}
                >
                  50% ({t('wide')})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wire Count Slider & Filter Bar - Compact */}
      <div className="p-2 sm:p-2.5 bg-slate-50 border-b border-slate-200 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold text-slate-800">
              Filter Number of Wires:
            </span>
          </div>
          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            {wireCountFilter === 0 ? 'All Wires (1 to 8)' : `${wireCountFilter} Wire${wireCountFilter > 1 ? 's' : ''}`}
          </span>
        </div>

        {/* The Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={8}
            step={1}
            value={wireCountFilter}
            onChange={(e) => setWireCountFilter(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
          />

          {/* Slider Marks */}
          <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-500 font-medium px-0.5">
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
                  <span className={`text-[8px] ${count > 0 ? 'text-slate-600 font-bold' : 'text-slate-300'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Clickable Wire Count Pills */}
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          <button
            onClick={() => setWireCountFilter(0)}
            className={`px-2 py-0.5 text-[11px] rounded font-semibold transition ${
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
              className={`px-2 py-0.5 text-[11px] rounded font-semibold transition flex items-center gap-1 ${
                wireCountFilter === n
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-250 hover:bg-slate-100'
              }`}
            >
              <span>{n}W</span>
              <span className={`px-1 py-0.2 rounded-full text-[9px] ${
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                            {summaryTitle}
                          </h4>
                          {comb.isAdjacentReplacement && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              Adjacent Wires
                            </span>
                          )}
                        </div>
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

                  {/* Adjacent Wire Replacement Rule Callout */}
                  {comb.isAdjacentReplacement && (
                    <div className="mx-3 mt-2.5 p-2 bg-gradient-to-r from-amber-500/10 via-amber-100/60 to-orange-50 rounded-lg border border-amber-300/90 flex items-start gap-2 text-xs">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950">
                          <span>Adjacent Wire Replacement Rule Applied</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-amber-200 text-amber-900 border border-amber-400/50">
                            Equiv Pair
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900 font-medium mt-0.5 leading-snug">
                          {comb.replacementNote || 'Two identical wires replaced by combination of two adjacent wires from chart.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Individual Wire Breakdown: ONE SINGLE WIRE PER ROW */}
                  <div className="p-3 space-y-2.5 flex-1">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>{t('wireCount')}</span>
                      <span className="text-[10px] text-slate-400">
                        {t('strandVariance')}: {comb.maxVariancePct.toFixed(1)}% (≤{maxVariancePct}%)
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100/90 text-slate-600 text-[10px] uppercase font-semibold border-b border-slate-200">
                            <th className="py-1 px-2.5 w-10 text-center">{t('row')}</th>
                            <th className="py-1 px-2">{t('wireGauge')}</th>
                            <th className="py-1 px-2 text-right">{t('bareDia')}</th>
                            <th className="py-1 px-2.5 text-right">{t('area')}</th>
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
                              TOTAL
                            </td>
                            <td className="py-1.5 px-2 text-right text-[11px] text-slate-500">
                              {comb.wireCount} {t('strands')}
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
                        <span>{t('originalTotal')}:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {originalArea.toFixed(4)} mm²
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span>{t('alternateTotalArea')}:</span>
                        <span className="font-mono font-semibold text-amber-900">
                          {comb.totalArea.toFixed(4)} mm²
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-slate-800 font-semibold">
                        <span>{t('areaDifference')}:</span>
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
                      <span>{isSelected ? t('selectedAlternateCombination') : t('selectAlternateAndJobCard')}</span>
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
