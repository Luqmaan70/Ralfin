import React from 'react';
import {
  Zap,
  Phone,
  MessageSquare,
  History,
  TableProperties,
} from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenSWGTable: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenSWGTable,
  historyCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-amber-600/40 text-white shadow-xl relative overflow-hidden">
      {/* Decorative copper gradient top line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5">
        {/* Top Company & Developer Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/90">
          <div className="flex flex-wrap items-baseline gap-2.5">
            {/* Prominent Company Name */}
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-xs">
              Ralfin Electricals
            </h1>
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-md border border-amber-400/40">
              Motor Winding Division
            </span>

            <span className="text-slate-600 hidden md:inline">•</span>

            {/* Author's Name and Phone in smaller font at the top */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-300">
              <span className="text-amber-300 font-medium">
                Developed by <strong className="text-white">Lukhman</strong>
              </span>
              <span className="text-slate-600">•</span>
              <a
                href="https://wa.me/917019192462"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-amber-300 transition-colors font-medium"
                title="Contact Developer"
              >
                +91-7019192462
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://wa.me/917019192462?text=Hello%20Lukhman,%20regarding%20Alternate%20Wire%20Gauge%20Calculator:"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold flex items-center gap-1"
                title="Send WhatsApp message"
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp Message</span>
              </a>
            </div>
          </div>

          {/* Right Action Buttons: SWG Chart & History */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={onOpenSWGTable}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition shadow-sm"
              title="View Standard Wire Gauge Chart"
            >
              <TableProperties className="w-4 h-4 text-amber-400" />
              <span>SWG Chart</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition shadow-sm relative"
              title="Past Calculations History"
            >
              <History className="w-4 h-4 text-sky-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* PROMINENT CELL OF A DIFFERENT COLOR WITH BIGGER FONT */}
        <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 border-2 border-amber-300/80 shadow-lg flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="p-2 sm:p-2.5 bg-slate-950/40 rounded-xl border border-amber-200/50 shadow-inner shrink-0">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
                Alternate Wire Gauge Calculator for Motor Winding
              </h2>
              <p className="text-xs sm:text-sm font-medium text-amber-100 mt-0.5 drop-shadow-2xs">
                Accurate parallel strand substitution • Cross-sectional area within 1.8% • Strand variance within 30%
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
