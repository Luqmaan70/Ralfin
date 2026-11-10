import { SWGWire, SuggestedCombination } from '../types';
import { findClosestSWGToArea } from '../data/swgData';

export interface CombinationSearchParams {
  originalArea: number;
  swgTable: SWGWire[];
  tolerancePct?: number; // default 1.8%
  maxVariancePct?: number; // default 30%
  minWires?: number; // default 1
  maxWires?: number; // default 8
  allowedSwgList?: string[]; // optional filter of gauges in stock
}

/**
 * Searches for all alternate wire combinations:
 * - Total area within tolerancePct (default 1.8%) of originalArea
 * - Individual wires have cross-sectional area within maxVariancePct (default 30%) of each other
 * - Wire count from least possible (1..8) up to maxWires (default 8)
 * - Sorted primarily by wire count (least wires first), then by absolute area difference
 */
export function generateAlternateCombinations(
  params: CombinationSearchParams
): SuggestedCombination[] {
  const {
    originalArea,
    swgTable,
    tolerancePct = 1.8,
    maxVariancePct = 30.0,
    minWires = 1,
    maxWires = 8,
    allowedSwgList,
  } = params;

  if (!originalArea || originalArea <= 0) return [];

  const toleranceRatio = tolerancePct / 100.0;
  const maxVarianceRatio = maxVariancePct / 100.0;

  // Filter available wires if user restricted stock
  const availableWires = (
    allowedSwgList && allowedSwgList.length > 0
      ? swgTable.filter((w) => allowedSwgList.includes(w.swg))
      : swgTable
  ).filter((w) => w.area > 0);

  // Sort ascending by area
  const sortedWires = [...availableWires].sort((a, b) => a.area - b.area);

  const results: SuggestedCombination[] = [];
  const minCombinedArea = originalArea * (1.0 - toleranceRatio);
  const maxCombinedArea = originalArea * (1.0 + toleranceRatio);

  for (let k = minWires; k <= maxWires; k++) {
    // For k wires, average area per wire target is originalArea / k
    const avgTarget = originalArea / k;
    // Fast pruning of candidate gauges:
    // With 30% variance, wires must be within [avgTarget * 0.6, avgTarget * 1.6]
    const candidates = sortedWires.filter(
      (w) => w.area >= avgTarget * 0.45 && w.area <= avgTarget * 1.75
    );

    if (candidates.length === 0) continue;

    // Search combinations of length k with repetition allowed
    // Since candidates are sorted ascending by area, index `startIdx` ensures combinations (not permutations)
    function search(
      startIdx: number,
      currentWires: SWGWire[],
      currentArea: number
    ) {
      const remainingCount = k - currentWires.length;

      // Base case: combination of length k
      if (remainingCount === 0) {
        if (currentArea >= minCombinedArea && currentArea <= maxCombinedArea) {
          const minA = currentWires[0].area;
          const maxA = currentWires[currentWires.length - 1].area;
          const variance = ((maxA - minA) / maxA) * 100;

          if (variance <= maxVariancePct) {
            const diff = currentArea - originalArea;
            const diffPct = (diff / originalArea) * 100;
            const closest = findClosestSWGToArea(diff, swgTable);

            results.push({
              id: `${k}-${currentWires.map((w) => w.swg).join('-')}-${currentArea.toFixed(4)}`,
              wireCount: k,
              wires: [...currentWires],
              totalArea: currentArea,
              diff,
              diffPct,
              absDiffPct: Math.abs(diffPct),
              maxVariancePct: variance,
              closestWireDiff: closest,
            });
          }
        }
        return;
      }

      // Pruning bounds
      const minPossibleNextArea = candidates[startIdx].area * remainingCount;
      if (currentArea + minPossibleNextArea > maxCombinedArea) {
        return; // already exceeds upper limit
      }

      const maxPossibleNextArea =
        candidates[candidates.length - 1].area * remainingCount;
      if (currentArea + maxPossibleNextArea < minCombinedArea) {
        return; // cannot reach lower limit
      }

      for (let i = startIdx; i < candidates.length; i++) {
        const nextWire = candidates[i];

        // 30% variance check: compare against smallest wire already chosen
        if (currentWires.length > 0) {
          const firstWireArea = currentWires[0].area;
          // nextWire.area >= firstWireArea because candidates are sorted ascending
          if ((nextWire.area - firstWireArea) / nextWire.area > maxVarianceRatio) {
            // Since candidates are sorted, all subsequent wires will also exceed maxVariance
            break;
          }
        }

        // Check if adding nextWire will already exceed upper bound with minimum remaining
        if (
          currentArea + nextWire.area + (remainingCount - 1) * nextWire.area >
          maxCombinedArea
        ) {
          // Since all further wires have >= nextWire.area, they will also overshoot
          break;
        }

        search(i, [...currentWires, nextWire], currentArea + nextWire.area);
      }
    }

    search(0, [], 0);
  }

  // Sort results:
  // 1. By wire count (least number of wires possible first)
  // 2. By absolute area difference (closest match first)
  results.sort((a, b) => {
    if (a.wireCount !== b.wireCount) {
      return a.wireCount - b.wireCount;
    }
    return a.absDiffPct - b.absDiffPct;
  });

  return results;
}
