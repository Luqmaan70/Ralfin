import React, { useState } from 'react';
import { SWGWire } from '../types';
import {
  X,
  TableProperties,
  Search,
  Download,
  Upload,
  RotateCcw,
  Check,
  FileSpreadsheet,
} from 'lucide-react';

interface SWGTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  swgTable: SWGWire[];
  onUpdateTable: (newTable: SWGWire[]) => void;
  onResetDefault: () => void;
}

export const SWGTableModal: React.FC<SWGTableModalProps> = ({
  isOpen,
  onClose,
  swgTable,
  onUpdateTable,
  onResetDefault,
}) => {
  const [search, setSearch] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [pastedData, setPastedData] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = swgTable.filter((w) => {
    const q = search.trim().toLowerCase();
    const normalizedQ = q.replace('.5', '½').replace('1/2', '½');
    return (
      w.swg.toLowerCase().includes(q) ||
      w.swg.toLowerCase().includes(normalizedQ) ||
      w.mm.toString().includes(q) ||
      w.area.toFixed(3).includes(q)
    );
  });

  // Export as CSV
  const handleExportCSV = () => {
    const headers = ['SWG', 'Diameter_mm', 'Diameter_inch', 'Area_mm2', 'Weight_kg_km', 'Resistance_ohm_km'];
    const rows = swgTable.map((w) => [
      w.swg,
      w.mm.toFixed(3),
      w.inch.toFixed(4),
      w.area.toFixed(4),
      w.weightKgKm?.toFixed(2) || '',
      w.resistanceOhmKm?.toFixed(2) || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Ralfin_SWG_Chart.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV/Excel paste
  const handleParseImport = () => {
    try {
      const lines = pastedData.trim().split('\n');
      if (lines.length < 2) {
        setImportStatus('Error: Paste at least 2 rows of data (Header and values).');
        return;
      }

      const parsed: SWGWire[] = [];
      // Attempt to parse tab-separated (from Excel) or comma-separated
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const delim = line.includes('\t') ? '\t' : ',';
        const cols = line.split(delim).map((c) => c.replace(/["\r]/g, '').trim());

        // Skip header if first col is not numeric or has "SWG"
        if (i === 0 && (isNaN(parseFloat(cols[1])) || cols[0].toLowerCase().includes('swg'))) {
          continue;
        }

        const swg = cols[0];
        const mm = parseFloat(cols[1]);
        if (!swg || isNaN(mm)) continue;

        const inch = cols[2] && !isNaN(parseFloat(cols[2])) ? parseFloat(cols[2]) : mm / 25.4;
        const area = (Math.PI / 4) * Math.pow(mm, 2);

        parsed.push({
          swg,
          swgNum: parseInt(swg, 10) || i,
          mm,
          inch,
          area,
          weightKgKm: cols[4] ? parseFloat(cols[4]) : undefined,
          resistanceOhmKm: cols[5] ? parseFloat(cols[5]) : undefined,
        });
      }

      if (parsed.length > 0) {
        onUpdateTable(parsed);
        setImportStatus(`Successfully loaded ${parsed.length} SWG entries!`);
        setTimeout(() => {
          setShowImport(false);
          setImportStatus(null);
        }, 1500);
      } else {
        setImportStatus('Could not parse valid wire rows. Expected: SWG, Diameter(mm)');
      }
    } catch (err) {
      setImportStatus('Failed to parse text. Please ensure valid format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <TableProperties className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Standard Wire Gauge (SWG) Master Chart
              </h3>
              <p className="text-xs text-slate-400">
                British Standard (BS 3728) & Indian Standard (IS 13730) for round copper winding wire
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

        {/* Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
              placeholder="Search SWG or diameter..."
              className="w-full pl-7 pr-2.5 py-1.5 bg-white rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className="px-2.5 py-1.5 rounded-md font-semibold bg-white hover:bg-amber-50 text-slate-700 border border-slate-300 hover:border-amber-400 flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{showImport ? 'Hide Import' : 'Import Excel / CSV'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 rounded-md font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
              title="Download table as CSV"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onResetDefault}
              className="px-2.5 py-1.5 rounded-md font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
              title="Reset to factory standards"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Import section drawer */}
        {showImport && (
          <div className="p-4 bg-amber-50/60 border-b border-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950">
                Paste Excel or CSV Wire Data (Columns: SWG, Diameter mm, etc.)
              </span>
              <button
                onClick={() => setShowImport(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            <textarea
              rows={4}
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
              placeholder="Example from Excel (copy and paste cells):&#10;18	1.219&#10;19	1.016&#10;20	0.914"
              className="w-full p-2 bg-white rounded-lg border border-amber-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-800">
                You can copy cells straight from Excel and paste here!
              </span>
              <button
                onClick={handleParseImport}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shadow-xs transition"
              >
                Apply Custom Data
              </button>
            </div>
            {importStatus && (
              <p className="text-xs font-semibold text-amber-900">{importStatus}</p>
            )}
          </div>
        )}

        {/* Table Body */}
        <div className="overflow-y-auto flex-1 p-2 sm:p-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 text-[11px] uppercase font-bold border-b border-slate-300 z-10">
              <tr>
                <th className="py-2 px-3">SWG</th>
                <th className="py-2 px-3 text-right">Dia (mm)</th>
                <th className="py-2 px-3 text-right">Dia (in)</th>
                <th className="py-2 px-3 text-right font-extrabold text-slate-900">
                  Area (mm²)
                </th>
                <th className="py-2 px-3 text-right hidden sm:table-cell">
                  Weight (kg/km)
                </th>
                <th className="py-2 px-3 text-right hidden sm:table-cell">
                  Resist (Ω/km)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-mono">
              {filtered.map((w) => (
                <tr key={w.swg} className="hover:bg-amber-50/60 transition-colors">
                  <td className="py-1.5 px-3 font-sans font-bold text-slate-900">
                    {w.swg} SWG
                  </td>
                  <td className="py-1.5 px-3 text-right text-slate-700">
                    {w.mm.toFixed(3)}
                  </td>
                  <td className="py-1.5 px-3 text-right text-slate-500">
                    {w.inch.toFixed(4)}
                  </td>
                  <td className="py-1.5 px-3 text-right font-bold text-amber-900 bg-amber-50/40">
                    {w.area.toFixed(4)}
                  </td>
                  <td className="py-1.5 px-3 text-right text-slate-500 hidden sm:table-cell">
                    {w.weightKgKm?.toFixed(1) || '—'}
                  </td>
                  <td className="py-1.5 px-3 text-right text-slate-500 hidden sm:table-cell">
                    {w.resistanceOhmKm?.toFixed(1) || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Displaying {filtered.length} of {swgTable.length} wire gauge entries
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
