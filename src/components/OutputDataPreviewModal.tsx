import React from 'react';
import {
  X,
  FileText,
  Download,
  Printer,
  Edit3,
  CheckCircle2,
  Building2,
  Cpu,
  Layers,
  ArrowRight,
  Calendar,
  Phone,
  Sparkles,
} from 'lucide-react';
import { MotorJobCard, SelectedWireItem, SuggestedCombination } from '../types';

interface OutputDataPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobCard: MotorJobCard;
  originalWires: SelectedWireItem[];
  originalTotalArea: number;
  selectedCombination: SuggestedCombination;
  onDownloadPDF: () => void;
  onPrint: () => void;
  onEditForm: () => void;
  isExporting?: boolean;
  tolerancePct?: number;
  maxVariancePct?: number;
}

export const OutputDataPreviewModal: React.FC<OutputDataPreviewModalProps> = ({
  isOpen,
  onClose,
  jobCard,
  originalWires,
  originalTotalArea,
  selectedCombination,
  onDownloadPDF,
  onPrint,
  onEditForm,
  isExporting = false,
  tolerancePct = 1.0,
  maxVariancePct = 30,
}) => {
  if (!isOpen) return null;

  // Flatten original wires for one-wire-per-row display
  const flattenedOriginal: { index: number; swg: string; mm: number; inch: number; area: number }[] = [];
  let oIdx = 1;
  originalWires.forEach((item) => {
    for (let c = 0; c < item.count; c++) {
      flattenedOriginal.push({
        index: oIdx++,
        swg: item.wire.swg,
        mm: item.wire.mm,
        inch: item.wire.inch,
        area: item.wire.area,
      });
    }
  });

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const clientClean = jobCard.clientName || 'Ralfin Electricals, Bangalore';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Modal Top Header */}
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between border-b border-amber-600/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                Output Form & Calculation Data Preview
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Review all motor specifications and alternate wire calculations before generating the PDF report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Document Content */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-4 text-slate-800">
          {/* Document Letterhead */}
          <div className="bg-slate-900 rounded-xl p-3.5 sm:p-4 text-white border-l-4 border-amber-500 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  Ralfin Electricals, Bangalore
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                  Motor Winding Division
                </span>
              </div>
              <p className="text-xs text-amber-400 font-bold mt-1 tracking-wide uppercase">
                Winding Calculation Report & Job Card Output Form
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-300 space-y-0.5">
              <div className="flex items-center sm:justify-end gap-2 font-semibold text-white">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Date: {currentDate}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Developed by <span className="text-white font-medium">Lukhman</span> (+91-7019192462)
              </p>
            </div>
          </div>

          {/* Section 1: Motor & Client Details Form Output */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  1. Motor and Client Details (Output Form)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditForm();
                }}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            </div>

            <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Client / Company</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{clientClean}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Contact Phone</span>
                <span className="font-semibold text-slate-800">{jobCard.contactPhone || '—'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Motor Description</span>
                <span className="font-semibold text-slate-800">{jobCard.motorDesc || '—'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Serial No</span>
                <span className="font-semibold text-slate-800 font-mono">{jobCard.serialNo || '—'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Motor Type</span>
                <span className="font-semibold text-slate-800">{jobCard.motorType || '—'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Power (KW / HP)</span>
                <span className="font-bold text-amber-800 font-mono">
                  {jobCard.powerKw ? `${jobCard.powerKw} KW` : ''}
                  {jobCard.hp ? `${jobCard.powerKw ? ' / ' : ''}${jobCard.hp} HP` : ''}
                  {!jobCard.powerKw && !jobCard.hp && '—'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Voltage / Frequency</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {jobCard.voltage ? `${jobCard.voltage} V` : '—'} / {jobCard.frequency ? `${jobCard.frequency} Hz` : '50 Hz'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Poles / Phases</span>
                <span className="font-semibold text-slate-800">
                  {jobCard.poles ? `${jobCard.poles} Poles` : '—'} / {jobCard.phases ? `${jobCard.phases} Phase` : '—'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Rated RPM</span>
                <span className="font-semibold text-slate-800 font-mono">{jobCard.rpm ? `${jobCard.rpm} RPM` : '—'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Mounting</span>
                <span className="font-semibold text-slate-800">{jobCard.mounting || '—'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Bearings (DE / NDE)</span>
                <span className="font-semibold text-slate-800">{jobCard.bearings || '—'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 col-span-2 sm:col-span-3 lg:col-span-4">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Remarks</span>
                <span className="font-medium text-slate-700 italic">{jobCard.remarks || '—'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Engineering Verification & Area Comparison */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                  2. Cross Sectional Area Comparison & Verification
                </h4>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded text-[11px] font-bold">
                Within ±{tolerancePct.toFixed(1)}% Tolerance
              </span>
            </div>

            <div className="p-3 sm:p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px]">
                      <th className="py-2 px-3">Configuration</th>
                      <th className="py-2 px-3 text-center">Strands</th>
                      <th className="py-2 px-3 text-right">Combined Area (mm²)</th>
                      <th className="py-2 px-3 text-right">Variance from Original</th>
                      <th className="py-2 px-3 text-center">Closest SWG Equivalent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        Original Wire Combination
                      </td>
                      <td className="py-2 px-3 text-center font-mono">
                        {flattenedOriginal.length} {flattenedOriginal.length === 1 ? 'Wire' : 'Wires'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {originalTotalArea.toFixed(4)} mm²
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500 font-mono">
                        Base (0.00%)
                      </td>
                      <td className="py-2 px-3 text-center text-slate-500">—</td>
                    </tr>
                    <tr className="bg-amber-50/60 font-semibold">
                      <td className="py-2 px-3 text-amber-950 font-bold">
                        Selected Alternate Wire Combination
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-amber-900">
                        {selectedCombination.wires.length} {selectedCombination.wires.length === 1 ? 'Wire' : 'Wires'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-extrabold text-amber-950">
                        {selectedCombination.totalArea.toFixed(4)} mm²
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                        {selectedCombination.diff >= 0 ? '+' : ''}{selectedCombination.diffPct.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-amber-900">
                        {selectedCombination.closestWireDiff
                          ? `${selectedCombination.closestWireDiff.swg} SWG`
                          : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {selectedCombination.isAdjacentReplacement && (
                <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-300 text-xs text-amber-950 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Adjacent Wire Replacement Applied:</strong> {selectedCombination.replacementNote || 'Two identical wires replaced by two adjacent wires from chart.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: One Wire Per Row Winding Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Original Wires Table */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="p-2.5 bg-slate-800 text-white flex items-center justify-between text-xs font-bold">
                <span>Original Wires ({flattenedOriginal.length} strands)</span>
                <span className="font-mono text-amber-300">{originalTotalArea.toFixed(4)} mm²</span>
              </div>
              <div className="p-2 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-200">
                      <th className="py-1 px-2">#</th>
                      <th className="py-1 px-2">Gauge</th>
                      <th className="py-1 px-2 text-right">Dia (mm)</th>
                      <th className="py-1 px-2 text-right">Area (mm²)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {flattenedOriginal.map((w) => (
                      <tr key={w.index} className="hover:bg-slate-50">
                        <td className="py-1 px-2 text-slate-400">{w.index}</td>
                        <td className="py-1 px-2 font-bold text-slate-800">{w.swg} SWG</td>
                        <td className="py-1 px-2 text-right text-slate-600">{w.mm.toFixed(3)}</td>
                        <td className="py-1 px-2 text-right font-semibold text-slate-900">{w.area.toFixed(4)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={3} className="py-1.5 px-2 font-sans uppercase text-[10px]">
                        Combined Original Area
                      </td>
                      <td className="py-1.5 px-2 text-right text-amber-900 font-mono font-extrabold">
                        {originalTotalArea.toFixed(4)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Alternate Wires Table */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="p-2.5 bg-amber-800 text-white flex items-center justify-between text-xs font-bold">
                <span>Selected Alternate ({selectedCombination.wires.length} strands)</span>
                <span className="font-mono text-amber-200">{selectedCombination.totalArea.toFixed(4)} mm²</span>
              </div>
              <div className="p-2 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-200">
                      <th className="py-1 px-2">#</th>
                      <th className="py-1 px-2">Gauge</th>
                      <th className="py-1 px-2 text-right">Dia (mm)</th>
                      <th className="py-1 px-2 text-right">Area (mm²)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {selectedCombination.wires.map((w, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/50">
                        <td className="py-1 px-2 text-slate-400">{idx + 1}</td>
                        <td className="py-1 px-2 font-bold text-amber-900">{w.swg} SWG</td>
                        <td className="py-1 px-2 text-right text-slate-600">{w.mm.toFixed(3)}</td>
                        <td className="py-1 px-2 text-right font-semibold text-slate-900">{w.area.toFixed(4)}</td>
                      </tr>
                    ))}
                    <tr className="bg-amber-100/70 font-bold text-amber-950 border-t-2 border-amber-300">
                      <td colSpan={3} className="py-1.5 px-2 font-sans uppercase text-[10px]">
                        Combined Alternate Area
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono font-extrabold text-amber-950">
                        {selectedCombination.totalArea.toFixed(4)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 4: Sign-off & Quality Inspection Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                Winding Supervisor Signature & Name:
              </span>
              <div className="h-9 mt-1 border-b border-dashed border-slate-300 flex items-end pb-1">
                <span className="text-xs text-slate-400 italic">Signature / Name</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
                <span>Date: _______________</span>
                <span className="font-medium text-slate-600">Ralfin Electricals</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">
                Quality Inspector / Tested By:
              </span>
              <div className="h-9 mt-1 border-b border-dashed border-slate-300 flex items-end pb-1">
                <span className="text-xs text-slate-400 italic">Signature / Name</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
                <span>Date: _______________</span>
                <span className="font-medium text-slate-600">QA Division</span>
              </div>
            </div>
          </div>

          {/* Developer Feedback Notice in 2 lines */}
          <div className="p-3 bg-slate-900 rounded-xl text-center text-xs text-white border border-amber-500/40 shadow-xs">
            <p className="font-bold text-amber-300">
              Please send your feedback regarding improvements and additional features you need,
            </p>
            <p className="font-semibold text-slate-200 mt-0.5">
              to developer Lukhman at +91-7019192462 (Message on whatsapp only)
            </p>
          </div>
        </div>

        {/* Modal Footer Action Buttons */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditForm();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition shadow-2xs flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Form Data</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDownloadPDF();
              }}
              disabled={isExporting}
              className="px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
