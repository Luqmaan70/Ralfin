import React from 'react';
import { CalculationHistoryItem } from '../types';
import {
  X,
  History,
  RotateCcw,
  Trash2,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { generateJobCardPDF } from '../utils/pdfGenerator';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onLoadHistoryItem: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onLoadHistoryItem,
  onClearHistory,
  onDeleteHistoryItem,
}) => {
  if (!isOpen) return null;

  const handleDownloadItemPDF = (item: CalculationHistoryItem) => {
    // Reconstruct SelectedWireItem[] from history
    const originalWires = item.originalWires.map((ow) => ({
      wire: {
        swg: ow.swg,
        swgNum: parseInt(ow.swg, 10) || 0,
        mm: ow.mm,
        inch: ow.mm / 25.4,
        area: ow.area,
      },
      count: ow.count,
    }));

    const doc = generateJobCardPDF({
      jobCard: item.jobCard,
      originalWires,
      originalTotalArea: item.originalTotalArea,
      selectedCombination: item.selectedCombination,
    });

    const clientClean = (item.jobCard.clientName || 'Motor')
      .replace(/\bauma(\s*india)?\b/gi, 'Ralfin')
      .replace(/\bralin(\s*electricals)?\b/gi, 'Ralfin')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 15);
    doc.save(`Ralfin_Winding_${clientClean}_${item.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-250 w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Calculation History & Past Jobs
              </h3>
              <p className="text-xs text-slate-400">
                Previously searched and selected alternate wire gauge combinations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50">
          {history.length === 0 ? (
            <div className="py-14 text-center">
              <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-700">
                No past calculations saved yet
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                When you select an alternate combination and generate a PDF or calculate, it will automatically be remembered here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">
                      {item.dateFormatted}
                    </span>
                    {item.jobCard.clientName && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold text-amber-700">
                          {item.jobCard.clientName
                            .replace(/\bauma(\s*india)?\b/gi, 'Ralfin Electricals, Bangalore')
                            .replace(/\bralin(\s*electricals)?\b/gi, 'Ralfin Electricals, Bangalore')}
                        </span>
                      </>
                    )}
                    {item.jobCard.powerKw && (
                      <span className="text-slate-500">
                        ({item.jobCard.powerKw} KW / {item.jobCard.hp} HP)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownloadItemPDF(item)}
                      className="p-1.5 rounded-md text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition text-xs flex items-center gap-1"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>
                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Wire summary comparison */}
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      Original Wires
                    </span>
                    <span className="font-bold text-slate-800">
                      {item.originalWires
                        .map((w) => `${w.count > 1 ? `${w.count}× ` : ''}${w.swg} SWG`)
                        .join(' + ')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      Area: {item.originalTotalArea.toFixed(4)} mm²
                    </span>
                  </div>

                  <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-amber-700 block font-semibold uppercase">
                      Selected Alternate
                    </span>
                    <span className="font-bold text-amber-950">
                      {item.selectedCombination.wires.map((w) => `${w.swg} SWG`).join(' + ')}
                    </span>
                    <span className="text-[11px] font-mono text-amber-800 block">
                      Area: {item.selectedCombination.totalArea.toFixed(4)} mm² (
                      {item.selectedCombination.diff >= 0 ? '+' : ''}
                      {item.selectedCombination.diffPct.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    {item.jobCard.motorType || 'Motor Winding'}
                  </span>
                  <button
                    onClick={() => onLoadHistoryItem(item)}
                    className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
                  >
                    <span>Load into Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {history.length} saved calculation{history.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-rose-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
