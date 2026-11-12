import React, { useState } from 'react';
import {
  Zap,
  Phone,
  MessageSquare,
  TableProperties,
  Download,
  Copy,
  Check,
  ExternalLink,
  FileCode,
  X,
} from 'lucide-react';
import { useLanguage } from '../i18n';

interface HeaderProps {
  onOpenSWGTable: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSWGTable,
}) => {
  const { t } = useLanguage();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const directUrl = `${window.location.origin}/wire_gauge_calculator.html`;

  const handleDirectDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch('/wire_gauge_calculator.html');
      const htmlText = await res.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Ralfin_Alternate_Wire_Gauge_Calculator.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      window.open('/wire_gauge_calculator.html', '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      const res = await fetch('/wire_gauge_calculator.html');
      const htmlText = await res.text();
      await navigator.clipboard.writeText(htmlText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      alert('Unable to copy automatically. Please click "Open in New Tab" and press Ctrl+S to save.');
    }
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-amber-600/40 text-white shadow-xl relative overflow-hidden print:hidden">
        {/* Decorative copper gradient top line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5">
          {/* Top Company & Developer Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/90">
            <div className="flex flex-wrap items-baseline gap-2.5">
              {/* Prominent Company Name */}
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-xs">
                Ralfin Electricals, Bangalore
              </h1>
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-md border border-amber-400/40">
                {t('motorWindingDivision')}
              </span>

              <span className="text-slate-600 hidden md:inline">•</span>

              {/* Author's Name and Phone in smaller font at the top */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-300">
                <span className="text-amber-300 font-medium">
                  {t('developedBy')} <strong className="text-white">Lukhman</strong>
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
                  href="https://wa.me/917019192462?text=Hello%20Lukhman,%20regarding%20Alternate%20Wire%20Gauge%20Calculator%20(Ralfin%20Electricals,%20Bangalore):"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold flex items-center gap-1"
                  title="Send WhatsApp message"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>{t('whatsappMessage')}</span>
                </a>
              </div>
            </div>

            {/* Right Action Buttons: SWG Chart & Download HTML File */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
              <button
                onClick={onOpenSWGTable}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition shadow-sm"
                title="View Standard Wire Gauge Chart"
              >
                <TableProperties className="w-4 h-4 text-amber-400" />
                <span>{t('swgChart')}</span>
              </button>

              {/* Download Standalone Single-File Offline HTML App */}
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 transition shadow-sm"
                title="Download Standalone Single-File HTML App (Works 100% Offline without internet on any device)"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{t('downloadHtmlApp')}</span>
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
                  {t('appTitle')}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-amber-100 mt-0.5 drop-shadow-2xs">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Standalone HTML Download Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">
                  Download Standalone Offline HTML File
                </h3>
              </div>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <p className="text-slate-600 leading-relaxed">
                This is a <strong>complete, single-file HTML application</strong> with zero external dependencies. You can save it to any computer, phone, or USB drive and run it offline anytime in Chrome, Edge, Safari, or Firefox without internet or Node.js.
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* 1-Click Direct File Download */}
                <button
                  onClick={handleDirectDownload}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2 p-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-sm text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Downloading...' : '1-Click Download .html File'}</span>
                </button>

                {/* Open in New Tab */}
                <a
                  href="/wire_gauge_calculator.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition shadow-sm text-xs sm:text-sm"
                >
                  <ExternalLink className="w-4 h-4 text-sky-400" />
                  <span>Open Standalone in New Tab</span>
                </a>
              </div>

              {/* Copy Full HTML Code */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Alternative: Copy Full HTML Code</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-300 rounded-lg text-xs transition shadow-2xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  You can copy the code, paste it into Notepad or TextEdit on your computer, and save it as <code>wire_calculator.html</code>.
                </p>
              </div>

              {/* Direct Link */}
              <div className="text-[11px] text-slate-500 pt-1">
                <span className="font-semibold text-slate-700">Direct File Path:</span>{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono select-all">
                  /wire_gauge_calculator.html
                </code>
              </div>
            </div>

            <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
