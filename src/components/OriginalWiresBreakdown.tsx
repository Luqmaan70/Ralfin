import React from 'react';
import { SelectedWireItem } from '../types';
import { Calculator, AlertCircle, Trash2 } from 'lucide-react';

interface OriginalWiresBreakdownProps {
  selectedWires: SelectedWireItem[];
  totalArea: number;
  onRemoveIndividualWire: (swg: string) => void;
  onClearAll: () => void;
}

export const OriginalWiresBreakdown: React.FC<OriginalWiresBreakdownProps> = ({
  selectedWires,
  totalArea,
  onRemoveIndividualWire,
  onClearAll,
}) => {
  // Flatten into individual single wire rows (one wire per row)
  const flattenedWires: {
    wireIndex: number;
    swg: string;
    mm: number;
    inch: number;
    area: number;
    isDuplicate: boolean;
  }[] = [];

  let counter = 1;
  selectedWires.forEach((item) => {
    for (let c = 0; c < item.count; c++) {
      flattenedWires.push({
        wireIndex: counter,
        swg: item.wire.swg,
        mm: item.wire.mm,
        inch: item.wire.inch,
        area: item.wire.area,
        isDuplicate: item.count > 1,
      });
      counter++;
    }
  });

  if (flattenedWires.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-dashed border-slate-300 p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <Calculator className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800">
          No Original Wires Selected Yet
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
          Select one or more wires from the SWG chart above to calculate the total cross-sectional area and see alternate winding suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-250 overflow-hidden">
      {/* Header bar */}
      <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Original Wire Set Breakdown (One Wire Per Row)
            </h3>
            <p className="text-[11px] text-slate-300">
              {flattenedWires.length} individual wire strand{flattenedWires.length > 1 ? 's' : ''} in parallel
            </p>
          </div>
        </div>

        {/* Big Total Area Callout */}
        <div className="flex items-baseline gap-2 bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Total Original Area:
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
            {totalArea.toFixed(4)}
          </span>
          <span className="text-xs text-amber-200 font-mono">mm²</span>
        </div>
      </div>

      {/* Neat table showing totaling with one wire per row */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3 sm:px-4 text-center w-14">#</th>
              <th className="py-2.5 px-3 sm:px-4">SWG Gauge</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">Bare Dia (mm)</th>
              <th className="py-2.5 px-3 sm:px-4 text-right hidden sm:table-cell">
                Bare Dia (in)
              </th>
              <th className="py-2.5 px-3 sm:px-4 text-right font-semibold">
                Area (mm²)
              </th>
              <th className="py-2.5 px-3 sm:px-4 text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {flattenedWires.map((wire, idx) => (
              <tr
                key={`${wire.swg}-${wire.wireIndex}`}
                className="hover:bg-amber-50/40 transition-colors"
              >
                <td className="py-2 px-3 sm:px-4 text-center font-bold text-slate-400 text-xs">
                  {wire.wireIndex}
                </td>
                <td className="py-2 px-3 sm:px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {wire.swg}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">SWG</span>
                  </div>
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-mono text-slate-700">
                  {wire.mm.toFixed(3)} mm
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-mono text-slate-500 hidden sm:table-cell text-xs">
                  {wire.inch.toFixed(4)}″
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-mono font-bold text-slate-900">
                  {wire.area.toFixed(4)} mm²
                </td>
                <td className="py-2 px-3 sm:px-4 text-center">
                  <button
                    onClick={() => onRemoveIndividualWire(wire.swg)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title={`Remove one ${wire.swg} SWG wire`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Totalling Row */}
          <tfoot>
            <tr className="bg-amber-50/80 border-t-2 border-amber-300 font-bold text-slate-900">
              <td className="py-3 px-3 sm:px-4 text-center text-amber-800">
                TOTAL
              </td>
              <td className="py-3 px-3 sm:px-4 text-amber-900">
                {flattenedWires.length} Wire Strand{flattenedWires.length > 1 ? 's' : ''}
              </td>
              <td className="py-3 px-3 sm:px-4 text-right text-slate-400">
                —
              </td>
              <td className="py-3 px-3 sm:px-4 text-right text-slate-400 hidden sm:table-cell">
                —
              </td>
              <td className="py-3 px-3 sm:px-4 text-right font-mono text-base font-extrabold text-amber-900">
                {totalArea.toFixed(4)} mm²
              </td>
              <td className="py-3 px-3 sm:px-4 text-center">
                <button
                  onClick={onClearAll}
                  className="text-[10px] text-rose-600 hover:underline font-semibold"
                >
                  Clear
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
