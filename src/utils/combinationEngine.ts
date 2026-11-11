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
  originalWires?: any[]; // original wire selection to exclude identical combinations and apply adjacent wire logic
}

/**
 * Finds adjacent wire replacement pairs for a given wire:
 * In the SWG chart, two wires of diameter D can be replaced by:
 * - Immediate 1-step adjacent wires in the chart (one wire smaller in area, one wire larger in area).
 *   Example: two wires of 21½ SWG have combined cross-sectional area of 21 SWG and 22 SWG.
 * - If whole gauge, also check 2-step adjacent wires (full stop above and below) if within 1.8% tolerance.
 */
function getAdjacentPairs(
  wire: SWGWire,
  sortedWires: SWGWire[]
): { pair: [SWGWire, SWGWire]; note: string }[] {
  const pairs: { pair: [SWGWire, SWGWire]; note: string }[] = [];
  const idx = sortedWires.findIndex((w) => w.swg === wire.swg);
  if (idx <= 0 || idx >= sortedWires.length - 1) return pairs;

  // 1-step adjacent in chart (sorted ascending by area)
  // idx - 1 is one size smaller in area (higher gauge number)
  // idx + 1 is one size larger in area (lower gauge number)
  const pSmaller = sortedWires[idx - 1];
  const pLarger = sortedWires[idx + 1];
  const sum1 = pSmaller.area + pLarger.area;
  const diffPct1 = Math.abs((sum1 - wire.area * 2) / (wire.area * 2)) * 100;
  if (diffPct1 <= 1.8) {
    pairs.push({
      pair: [pLarger, pSmaller],
      note: `Replaced 2 × ${wire.swg} SWG with ${pLarger.swg} SWG + ${pSmaller.swg} SWG`,
    });
  }

  // 2-step adjacent (e.g. full stops across half-stops)
  if (idx >= 2 && idx <= sortedWires.length - 3) {
    const qSmaller = sortedWires[idx - 2];
    const qLarger = sortedWires[idx + 2];
    const sum2 = qSmaller.area + qLarger.area;
    const diffPct2 = Math.abs((sum2 - wire.area * 2) / (wire.area * 2)) * 100;
    if (diffPct2 <= 1.8) {
      pairs.push({
        pair: [qLarger, qSmaller],
        note: `Replaced 2 × ${wire.swg} SWG with ${qLarger.swg} SWG + ${qSmaller.swg} SWG`,
      });
    }
  }

  return pairs;
}

/**
 * Searches for all alternate wire combinations:
 * - Total area within tolerancePct (default 1.8%) of originalArea
 * - Individual wires have cross-sectional area within maxVariancePct (default 30%) of each other
 * - When there are at least two wires of the same diameter, those two can be replaced by a combination
 *   of two adjacent wires from the chart (e.g. 2 × 21½ SWG ➔ 21 SWG + 22 SWG)
 * - Wire count from least possible (1..8) up to maxWires (default 8)
 * - Do not suggest the exact same combination as original
 * - Sorted primarily by wire count (least wires first), then adjacent wire replacements, then by area difference
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
    originalWires,
  } = params;

  if (!originalArea || originalArea <= 0) return [];

  // Flatten original wires list
  const originalFlattenedWires: SWGWire[] = [];
  if (originalWires && Array.isArray(originalWires)) {
    originalWires.forEach((item: any) => {
      if (item && 'wire' in item && typeof item.count === 'number') {
        for (let c = 0; c < item.count; c++) {
          originalFlattenedWires.push(item.wire);
        }
      } else if (item && 'swg' in item) {
        originalFlattenedWires.push(item);
      }
    });
  }

  // Compute signature of original wire combination to prevent suggesting the exact same set
  const originalSignature = originalFlattenedWires
    .map((w) => String(w.swg))
    .sort()
    .join(',');

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
  const seenSignatures = new Set<string>();
  const minCombinedArea = originalArea * (1.0 - toleranceRatio);
  const maxCombinedArea = originalArea * (1.0 + toleranceRatio);

  // 1. Core Combinatoric Search (1 to maxWires)
  for (let k = minWires; k <= maxWires; k++) {
    // For k wires, average area per wire target is originalArea / k
    const avgTarget = originalArea / k;
    // With 30% variance, wires must be within [avgTarget * 0.45, avgTarget * 1.75]
    const candidates = sortedWires.filter(
      (w) => w.area >= avgTarget * 0.45 && w.area <= avgTarget * 1.75
    );

    if (candidates.length === 0) continue;

    function search(
      startIdx: number,
      currentWires: SWGWire[],
      currentArea: number
    ) {
      const remainingCount = k - currentWires.length;

      // Base case: combination of length k
      if (remainingCount === 0) {
        // Exclude exact same combination as original
        const candidateSignature = currentWires
          .map((w) => String(w.swg))
          .sort()
          .join(',');

        if (originalSignature && candidateSignature === originalSignature) {
          return; // Skip identical combination
        }

        if (seenSignatures.has(candidateSignature)) {
          return;
        }

        if (currentArea >= minCombinedArea && currentArea <= maxCombinedArea) {
          const minA = currentWires[0].area;
          const maxA = currentWires[currentWires.length - 1].area;
          const variance = ((maxA - minA) / maxA) * 100;

          if (variance <= maxVariancePct) {
            seenSignatures.add(candidateSignature);
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
          if ((nextWire.area - firstWireArea) / nextWire.area > maxVarianceRatio) {
            break;
          }
        }

        // Check if adding nextWire will already exceed upper bound
        if (
          currentArea + nextWire.area + (remainingCount - 1) * nextWire.area >
          maxCombinedArea
        ) {
          break;
        }

        search(i, [...currentWires, nextWire], currentArea + nextWire.area);
      }
    }

    search(0, [], 0);
  }

  // 2. Direct Adjacent Wire Replacement Logic:
  // "when there are at least two wires of the same diameter those two can be replaced by a combination of two adjacent wires from the chart"
  // e.g. two wires of 21½ SWG have combined area of 21 SWG and 22 SWG.
  if (originalFlattenedWires.length >= 2) {
    function generateAdjacentCombinations(
      currentWires: SWGWire[],
      accumulatedNotes: string[]
    ) {
      // Find wire gauges with count >= 2
      const gaugeCounts = new Map<string, { wire: SWGWire; count: number }>();
      for (const w of currentWires) {
        const entry = gaugeCounts.get(w.swg);
        if (entry) {
          entry.count++;
        } else {
          gaugeCounts.set(w.swg, { wire: w, count: 1 });
        }
      }

      for (const [swg, data] of gaugeCounts.entries()) {
        if (data.count >= 2) {
          const adjPairs = getAdjacentPairs(data.wire, sortedWires);
          for (const { pair, note } of adjPairs) {
            // Replace 2 wires of `swg` with `pair[0]` and `pair[1]`
            const nextWires: SWGWire[] = [];
            let removedCount = 0;
            for (const w of currentWires) {
              if (w.swg === swg && removedCount < 2) {
                removedCount++;
              } else {
                nextWires.push(w);
              }
            }
            nextWires.push(pair[0]);
            nextWires.push(pair[1]);
            // Sort descending by area (larger gauge first)
            nextWires.sort((a, b) => b.area - a.area);

            const signature = nextWires
              .map((w) => String(w.swg))
              .sort()
              .join(',');

            // Exclude identical to original wires
            if (originalSignature && signature === originalSignature) continue;

            const nextNotes = [...accumulatedNotes, note];
            const totalArea = nextWires.reduce((sum, w) => sum + w.area, 0);
            const diff = totalArea - originalArea;
            const diffPct = (diff / originalArea) * 100;

            if (Math.abs(diffPct) <= tolerancePct) {
              const minA = nextWires[nextWires.length - 1].area;
              const maxA = nextWires[0].area;
              const variance = ((maxA - minA) / maxA) * 100;

              // Check if combination is already in results: if so, mark it as adjacent replacement
              const existingIdx = results.findIndex(
                (r) =>
                  r.wires
                    .map((w) => String(w.swg))
                    .sort()
                    .join(',') === signature
              );

              if (existingIdx !== -1) {
                results[existingIdx].isAdjacentReplacement = true;
                results[existingIdx].replacementNote = nextNotes.join('; ');
              } else if (!seenSignatures.has(signature)) {
                seenSignatures.add(signature);
                results.push({
                  id: `adj-${nextWires.length}-${nextWires.map((w) => w.swg).join('-')}-${totalArea.toFixed(4)}`,
                  wireCount: nextWires.length,
                  wires: nextWires,
                  totalArea,
                  diff,
                  diffPct,
                  absDiffPct: Math.abs(diffPct),
                  maxVariancePct: variance,
                  closestWireDiff: findClosestSWGToArea(diff, swgTable),
                  isAdjacentReplacement: true,
                  replacementNote: nextNotes.join('; '),
                });
              }
            }

            // Recurse to allow cascading replacements if wireCount <= maxWires
            if (nextWires.length <= maxWires) {
              generateAdjacentCombinations(nextWires, nextNotes);
            }
          }
        }
      }
    }

    generateAdjacentCombinations(originalFlattenedWires, []);
  }

  // 3. Mark any other candidate combinations that happen to be adjacent replacements of pairs
  results.forEach((comb) => {
    if (!comb.isAdjacentReplacement && comb.wireCount >= 2) {
      // Check if replacing any pair in original produces this combination
      if (originalFlattenedWires.length >= 2) {
        const counts = new Map<string, { wire: SWGWire; count: number }>();
        for (const w of originalFlattenedWires) {
          const entry = counts.get(w.swg);
          if (entry) entry.count++;
          else counts.set(w.swg, { wire: w, count: 1 });
        }
        for (const [swg, data] of counts.entries()) {
          if (data.count >= 2) {
            const adj = getAdjacentPairs(data.wire, sortedWires);
            for (const { pair, note } of adj) {
              const testWires: string[] = [];
              let rem = 0;
              for (const w of originalFlattenedWires) {
                if (w.swg === swg && rem < 2) rem++;
                else testWires.push(String(w.swg));
              }
              testWires.push(String(pair[0].swg));
              testWires.push(String(pair[1].swg));
              if (
                testWires.sort().join(',') ===
                comb.wires.map((w) => String(w.swg)).sort().join(',')
              ) {
                comb.isAdjacentReplacement = true;
                comb.replacementNote = note;
                break;
              }
            }
          }
        }
      }
    }
  });

  // Sort results:
  // 1. By wire count (least number of wires possible first)
  // 2. Adjacent wire replacements prioritized at top of their wire count group
  // 3. By absolute area difference (closest match first)
  results.sort((a, b) => {
    if (a.wireCount !== b.wireCount) {
      return a.wireCount - b.wireCount;
    }
    if (a.isAdjacentReplacement && !b.isAdjacentReplacement) return -1;
    if (!a.isAdjacentReplacement && b.isAdjacentReplacement) return 1;
    return a.absDiffPct - b.absDiffPct;
  });

  return results;
}
