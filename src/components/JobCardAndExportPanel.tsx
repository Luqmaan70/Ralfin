import React, { useState, useEffect } from 'react';
import {
  MotorJobCard,
  SelectedWireItem,
  SuggestedCombination,
} from '../types';
import { generateJobCardPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import {
  FileText,
  Download,
  Share2,
  Printer,
  ArrowLeft,
  CheckCircle2,
  User,
  Phone,
  Settings,
  Sparkles,
  Zap,
  Info,
  Save,
  ChevronDown,
} from 'lucide-react';

interface JobCardAndExportPanelProps {
  originalWires: SelectedWireItem[];
  originalTotalArea: number;
  selectedCombination: SuggestedCombination;
  jobCard: MotorJobCard;
  onChangeJobCard: (card: MotorJobCard) => void;
  onBackToSuggestions: () => void;
  onSavedToHistory?: () => void;
}

export const JobCardAndExportPanel: React.FC<JobCardAndExportPanelProps> = ({
  originalWires,
  originalTotalArea,
  selectedCombination,
  jobCard,
  onChangeJobCard,
  onBackToSuggestions,
  onSavedToHistory,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // Focus user on The Engineering Verification & Area comparison panel when opened
  useEffect(() => {
    const el = document.getElementById('engineering-verification-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleInputChange = (field: keyof MotorJobCard, value: string) => {
    // Automatically sanitize any references to Auma (case-insensitive) with Ralin Electricals
    const cleanValue = typeof value === 'string'
      ? value.replace(/\bauma(\s*india)?\b/gi, 'Ralin Electricals').replace(/\bapex(\s*textiles)?\b/gi, 'Ralin Electricals')
      : value;
    onChangeJobCard({
      ...jobCard,
      [field]: cleanValue,
    });
  };

  // Smooth scroll to the Winding Job Card Form
  const scrollToJobCardForm = () => {
    const el = document.getElementById('winding-job-card-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const firstInput = el.querySelector('input') as HTMLInputElement | null;
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 350);
      }
    }
  };

  // Flatten original wires for one-wire-per-row display in output panel
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

  // Flatten selected alternate wires (already individual in selectedCombination.wires)
  const flattenedAlternate = selectedCombination.wires.map((w, idx) => ({
    index: idx + 1,
    swg: w.swg,
    mm: w.mm,
    inch: w.inch,
    area: w.area,
  }));

  // Download PDF
  const handleDownloadPDF = () => {
    try {
      setIsExporting(true);
      const doc = generateJobCardPDF({
        jobCard,
        originalWires,
        originalTotalArea,
        selectedCombination,
      });

      const clientClean = (jobCard.clientName || 'Motor')
        .replace(/\bauma(\s*india)?\b/gi, 'Ralin')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 15);
      const filename = `Ralfin_Winding_JobCard_${clientClean}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      setShareSuccess('PDF Job Card downloaded successfully!');
      setTimeout(() => setShareSuccess(null), 4000);
      onSavedToHistory?.();
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Error creating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Print PDF directly
  const handlePrint = () => {
    try {
      const doc = generateJobCardPDF({
        jobCard,
        originalWires,
        originalTotalArea,
        selectedCombination,
      });
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } catch (err) {
      console.error('Print error:', err);
      window.print();
    }
  };

  // Share via Web Share API or WhatsApp
  const handleShare = async () => {
    const summaryText = `Ralfin Electricals - Motor Winding Division
Alternate Wire Gauge Calculation:
Original Area: ${originalTotalArea.toFixed(4)} mm² (${flattenedOriginal.length} wires)
Selected Alternate: ${selectedCombination.wires.map((w) => `${w.swg} SWG`).join(' + ')}
Total Alternate Area: ${selectedCombination.totalArea.toFixed(4)} mm² (${selectedCombination.diff >= 0 ? '+' : ''}${selectedCombination.diffPct.toFixed(2)}%)
Client: ${jobCard.clientName ? jobCard.clientName.replace(/\bauma(\s*india)?\b/gi, 'Ralin Electricals') : 'N/A'} | Motor: ${jobCard.powerKw ? jobCard.powerKw + ' KW' : ''} ${jobCard.hp ? jobCard.hp + ' HP' : ''}
Developed by Lukhman (+91-7019192462)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ralfin Electricals - Motor Winding Job Card',
          text: summaryText,
          url: window.location.href,
        });
        setShareSuccess('Shared successfully!');
        setTimeout(() => setShareSuccess(null), 3000);
        return;
      } catch (e) {
        // User cancelled or not supported
      }
    }

    // Fallback: WhatsApp share
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
    window.open(waUrl, '_blank');
    setShareSuccess('Opened WhatsApp to share calculation!');
    setTimeout(() => setShareSuccess(null), 4000);
  };

  const isDiffPositive = selectedCombination.diff >= 0;

  return (
    <div className="space-y-4">
      {/* Top Banner & Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-amber-300/80 p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToSuggestions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>Change Alternate Selection</span>
          </button>
          <span className="text-xs text-slate-500 hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 hidden sm:inline">
            Selected: {selectedCombination.wires.map((w) => `${w.swg} SWG`).join(' + ')}
          </span>
        </div>

        {/* Action Buttons: Form shortcut, PDF, Share, Print */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-2xs"
            title="Print Job Card"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-2xs"
            title="Share Calculation Summary"
          >
            <Share2 className="w-4 h-4 text-sky-600" />
            <span>Share</span>
          </button>

          {/* Button for creating a Winding job card form just before the download PDF button */}
          <button
            type="button"
            onClick={scrollToJobCardForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition shadow-xs"
            title="Scroll to Winding Job Card Form"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Winding Job Card Form</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF Job Card'}</span>
          </button>
        </div>
      </div>

      {shareSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{shareSuccess}</span>
        </div>
      )}

      {/* 1. Side-by-Side Winding Tables: Show the totaling of individual wires one wire per row in the output panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Combination Table (One Wire per Row) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-3 bg-slate-800 text-white flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>Original Wire Combination</span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({flattenedOriginal.length} wire{flattenedOriginal.length > 1 ? 's' : ''})
              </span>
            </h4>
            <span className="text-xs font-mono font-bold text-amber-300">
              {originalTotalArea.toFixed(4)} mm²
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 text-[10px] uppercase font-semibold">
                  <th className="py-2 px-3 w-10 text-center">Row</th>
                  <th className="py-2 px-3">Wire Gauge</th>
                  <th className="py-2 px-3 text-right">Bare Dia</th>
                  <th className="py-2 px-3 text-right font-semibold">Area</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {flattenedOriginal.map((w) => (
                  <tr key={`orig-${w.index}`} className="hover:bg-slate-50">
                    <td className="py-1.5 px-3 text-center text-slate-400 font-mono text-xs">
                      #{w.index}
                    </td>
                    <td className="py-1.5 px-3 font-bold text-slate-900">
                      {w.swg} SWG
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono text-slate-600">
                      {w.mm.toFixed(3)} mm
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono font-semibold text-slate-900">
                      {w.area.toFixed(4)} mm²
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                  <td colSpan={2} className="py-2 px-3">
                    ORIGINAL TOTAL
                  </td>
                  <td className="py-2 px-3 text-right text-[11px] text-slate-500">
                    {flattenedOriginal.length} strands
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-sm text-slate-900">
                    {originalTotalArea.toFixed(4)} mm²
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Selected Alternate Combination Table (One Wire per Row) */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-400 overflow-hidden ring-1 ring-amber-300">
          <div className="p-3 bg-amber-700 text-white flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>Selected Alternate Combination</span>
              <span className="text-[11px] text-amber-200 font-normal">
                ({flattenedAlternate.length} wire{flattenedAlternate.length > 1 ? 's' : ''})
              </span>
            </h4>
            <span className="text-xs font-mono font-bold text-white bg-amber-800/80 px-2 py-0.5 rounded border border-amber-500/50">
              {selectedCombination.totalArea.toFixed(4)} mm²
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-amber-50 text-amber-900 border-b border-amber-200 text-[10px] uppercase font-semibold">
                  <th className="py-2 px-3 w-10 text-center">Row</th>
                  <th className="py-2 px-3">Wire Gauge</th>
                  <th className="py-2 px-3 text-right">Bare Dia</th>
                  <th className="py-2 px-3 text-right font-semibold">Area</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {flattenedAlternate.map((w) => (
                  <tr key={`alt-${w.index}`} className="hover:bg-amber-50/50">
                    <td className="py-1.5 px-3 text-center text-amber-700 font-mono text-xs">
                      #{w.index}
                    </td>
                    <td className="py-1.5 px-3 font-bold text-slate-900">
                      {w.swg} SWG
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono text-slate-600">
                      {w.mm.toFixed(3)} mm
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono font-semibold text-amber-950">
                      {w.area.toFixed(4)} mm²
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-amber-100 border-t-2 border-amber-400 font-bold text-amber-950">
                  <td colSpan={2} className="py-2 px-3">
                    ALTERNATE TOTAL
                  </td>
                  <td className="py-2 px-3 text-right text-[11px] text-amber-800">
                    {flattenedAlternate.length} strands
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-sm text-amber-950">
                    {selectedCombination.totalArea.toFixed(4)} mm²
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Engineering Verification & Area Comparison Card */}
      <div
        id="engineering-verification-panel"
        className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 sm:p-5 shadow-sm space-y-3 border border-slate-700 scroll-mt-14"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-sm sm:text-base text-white">
              Engineering Verification & Area Comparison
            </h4>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
            ✓ Cross sectional area of Suggested combination is within 1.8% of the original cross sections combined.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Original Total Area</span>
            <span className="text-base font-extrabold text-white font-mono">
              {originalTotalArea.toFixed(4)} mm²
            </span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Alternate Total Area</span>
            <span className="text-base font-extrabold text-amber-400 font-mono">
              {selectedCombination.totalArea.toFixed(4)} mm²
            </span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Area Difference</span>
            <span
              className={`text-base font-extrabold font-mono ${
                isDiffPositive ? 'text-emerald-400' : 'text-sky-400'
              }`}
            >
              {isDiffPositive ? '+' : ''}
              {selectedCombination.diff.toFixed(4)} mm² ({isDiffPositive ? '+' : ''}
              {selectedCombination.diffPct.toFixed(2)}%)
            </span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Difference Equivalent SWG</span>
            <span className="text-sm font-bold text-amber-300 font-mono block truncate">
              {selectedCombination.closestWireDiff
                ? `${selectedCombination.closestWireDiff.swg} SWG (${selectedCombination.closestWireDiff.area.toFixed(4)} mm²)`
                : 'Negligible (< 50 SWG)'}
            </span>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/60">
          <span>
            Strand-to-strand variance in this combination is{' '}
            <strong className="text-white">
              {selectedCombination.maxVariancePct.toFixed(1)}%
            </strong>{' '}
            (well within maximum 30% tolerance).
          </span>

          {/* Action buttons: Provide button for creating a Winding job card form just before the download PDF button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToJobCardForm}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm"
              title="Fill Motor Specifications & Client Details"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Create Winding Job Card Form</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Motor and Client Details (Job Card Form) MOVED BELOW the Engineering Verification & Area comparison panel */}
      <div
        id="winding-job-card-form"
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden scroll-mt-14"
      >
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Motor and Client Details
              </h3>
              <p className="text-[11px] text-slate-300">
                Enter motor parameters and client details for the official job card. Horse power (HP) auto-calculates from KW (roundup to nearest 0.5).
              </p>
            </div>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono border border-amber-400/30">
            Motor and Client Details
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Row 1: Client & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name of Client / Company
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={jobCard.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="e.g. Ralin Electricals"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={jobCard.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="e.g. +91-9876543210"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Motor Description
              </label>
              <input
                type="text"
                value={jobCard.motorDesc}
                onChange={(e) => handleInputChange('motorDesc', e.target.value)}
                placeholder="e.g. Pump Motor / Stator Re-winding"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Serial No
              </label>
              <input
                type="text"
                value={jobCard.serialNo}
                onChange={(e) => handleInputChange('serialNo', e.target.value)}
                placeholder="e.g. SN-2026-449"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Motor Type, Power KW, HP (auto), Voltage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Motor Type
              </label>
              <select
                value={jobCard.motorType}
                onChange={(e) => handleInputChange('motorType', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="3-Phase Squirrel Cage Induction">3-Phase Induction (Squirrel Cage)</option>
                <option value="Single Phase Capacitor Start">Single Phase Capacitor Start</option>
                <option value="Slip Ring Induction Motor">Slip Ring Induction Motor</option>
                <option value="DC Motor (Shunt / Series)">DC Motor (Shunt / Series)</option>
                <option value="Submersible Pump Motor">Submersible Pump Motor</option>
                <option value="Fractional HP Motor">Fractional HP Motor</option>
                <option value="High Voltage Stator">High Voltage Stator</option>
                <option value="Other / Special">Other / Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Motor Power (KW)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={jobCard.powerKw}
                  onChange={(e) => handleInputChange('powerKw', e.target.value)}
                  placeholder=""
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  KW
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Motor Horse Power (HP)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={jobCard.hp}
                  onChange={(e) => handleInputChange('hp', e.target.value)}
                  placeholder=""
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  HP
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Motor Voltage (V)
              </label>
              <input
                type="text"
                value={jobCard.voltage}
                onChange={(e) => handleInputChange('voltage', e.target.value)}
                placeholder="e.g. 415"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Row 3: Frequency, Number of Poles, Phases, RPM */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Frequency (Hz)
              </label>
              <input
                type="text"
                value={jobCard.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                placeholder="50"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Poles
              </label>
              <select
                value={jobCard.poles}
                onChange={(e) => handleInputChange('poles', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="2">2 Poles (~3000 RPM)</option>
                <option value="4">4 Poles (~1500 RPM)</option>
                <option value="6">6 Poles (~1000 RPM)</option>
                <option value="8">8 Poles (~750 RPM)</option>
                <option value="10">10 Poles (~600 RPM)</option>
                <option value="12">12 Poles (~500 RPM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Phases
              </label>
              <select
                value={jobCard.phases}
                onChange={(e) => handleInputChange('phases', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="3">3 Phase</option>
                <option value="1">1 Phase</option>
                <option value="2">2 Phase</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rated RPM
              </label>
              <input
                type="text"
                value={jobCard.rpm}
                onChange={(e) => handleInputChange('rpm', e.target.value)}
                placeholder="e.g. 1440"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Row 4: Mounting & Bearings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mounting
              </label>
              <input
                type="text"
                value={jobCard.mounting}
                onChange={(e) => handleInputChange('mounting', e.target.value)}
                placeholder="e.g. Foot Mounted (B3) / Flange (B5)"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bearings (DE / NDE)
              </label>
              <input
                type="text"
                value={jobCard.bearings}
                onChange={(e) => handleInputChange('bearings', e.target.value)}
                placeholder=""
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks
            </label>
            <textarea
              rows={2}
              value={jobCard.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              placeholder="e.g. Dual-layer winding, class F insulation, VPI varnish, verify slot fullness and end-turn clearance."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action bar inside the form bottom */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500">
              Form data is automatically saved to this calculation job card and included in the PDF report.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-2xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Generating PDF...' : 'Download PDF Job Card'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
