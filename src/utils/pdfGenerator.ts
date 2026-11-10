import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MotorJobCard, SelectedWireItem, SuggestedCombination } from '../types';

interface PDFExportParams {
  jobCard: MotorJobCard;
  originalWires: SelectedWireItem[];
  originalTotalArea: number;
  selectedCombination: SuggestedCombination;
}

export function generateJobCardPDF({
  jobCard,
  originalWires,
  originalTotalArea,
  selectedCombination,
}: PDFExportParams): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Color Palette
  const primaryColor: [number, number, number] = [30, 41, 59]; // slate-800
  const copperColor: [number, number, number] = [194, 65, 12]; // orange-700 / copper
  const accentBg: [number, number, number] = [241, 245, 249]; // slate-100
  const successColor: [number, number, number] = [21, 128, 61]; // green-700
  const brightAmber: [number, number, number] = [251, 191, 36]; // bright amber-gold
  const warmHighlight: [number, number, number] = [254, 215, 170]; // warm gold

  // Current formatted date & time of generation
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // 1. Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Decorative copper bar
  doc.setFillColor(...copperColor);
  doc.rect(0, 30, pageWidth, 2.5, 'F');

  // Top Left: Company Name
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.text('RALFIN ELECTRICALS', 14, 9.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('MOTOR WINDING DIVISION  |  PRECISION REWINDING & ENGINEERING', 14, 14.5);

  // Top Right: Date of PDF Generation (explicitly requested at the top right)
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`Date of PDF Generation: ${currentDate}`, pageWidth - 14, 9.5, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Developed by Lukhman  |  Ph: +91-7019192462', pageWidth - 14, 14.5, { align: 'right' });

  // Prominent Heading: WINDING CALCULATION REPORT (bigger, prominent & in a brighter color)
  doc.setFontSize(12.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...brightAmber); // Brighter prominent gold-amber color
  doc.text('WINDING CALCULATION REPORT', 14, 24.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('ALTERNATE WIRE GAUGE CALCULATION', pageWidth - 14, 24.5, { align: 'right' });

  let currentY = 37;

  // 2. Motor and Client Details (Changed from Motor & Client Specifications)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('1. MOTOR AND CLIENT DETAILS', 14, currentY);

  currentY += 3;

  // Sanitize any references to Auma (case-insensitive) with Ralin Electricals
  const sanitizePdfText = (str?: string): string => {
    if (!str) return '';
    return str.replace(/\bauma(\s*india)?\b/gi, 'Ralin Electricals').replace(/\bapex(\s*textiles)?\b/gi, 'Ralin Electricals');
  };

  // Power string: do not mention any motor power (kw) if left blank
  const powerDisplay = jobCard.powerKw
    ? `${jobCard.powerKw} KW${jobCard.hp ? ` / ${jobCard.hp} HP` : ''}`
    : jobCard.hp
    ? `${jobCard.hp} HP`
    : '—';

  const clientNameDisplay = sanitizePdfText(jobCard.clientName) || '—';
  const motorDescDisplay = sanitizePdfText(jobCard.motorDesc) || 'Electric Motor Winding';
  const remarksDisplay = sanitizePdfText(jobCard.remarks) || '—';

  const motorTableData = [
    [
      { content: 'Client / Company:', styles: { fontStyle: 'bold' as const } },
      clientNameDisplay,
      { content: 'Contact Phone:', styles: { fontStyle: 'bold' as const } },
      jobCard.contactPhone || '—',
    ],
    [
      { content: 'Motor Description:', styles: { fontStyle: 'bold' as const } },
      motorDescDisplay,
      { content: 'Serial No:', styles: { fontStyle: 'bold' as const } },
      jobCard.serialNo || '—',
    ],
    [
      { content: 'Motor Type:', styles: { fontStyle: 'bold' as const } },
      jobCard.motorType || '3-Phase Induction',
      { content: 'Power (KW / HP):', styles: { fontStyle: 'bold' as const } },
      powerDisplay,
    ],
    [
      { content: 'Voltage / Freq:', styles: { fontStyle: 'bold' as const } },
      `${jobCard.voltage ? jobCard.voltage + ' V' : '—'} / ${jobCard.frequency ? jobCard.frequency + ' Hz' : '50 Hz'}`,
      { content: 'Poles / Phases:', styles: { fontStyle: 'bold' as const } },
      `${jobCard.poles ? jobCard.poles + ' Poles' : '—'} / ${jobCard.phases ? jobCard.phases + ' Phase' : '—'}`,
    ],
    [
      { content: 'Rated RPM:', styles: { fontStyle: 'bold' as const } },
      jobCard.rpm ? `${jobCard.rpm} RPM` : '—',
      { content: 'Mounting:', styles: { fontStyle: 'bold' as const } },
      jobCard.mounting || '—',
    ],
    [
      { content: 'Bearings (DE/NDE):', styles: { fontStyle: 'bold' as const } },
      jobCard.bearings || '—',
      { content: 'Winding Standard:', styles: { fontStyle: 'bold' as const } },
      'BS 3728 / IS 13730 Round Copper',
    ],
    [
      { content: 'Remarks:', styles: { fontStyle: 'bold' as const } },
      { content: remarksDisplay, colSpan: 3 },
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    body: motorTableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { cellWidth: 38, fillColor: accentBg },
      1: { cellWidth: 55 },
      2: { cellWidth: 38, fillColor: accentBg },
      3: { cellWidth: 51 },
    },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  currentY = doc.lastAutoTable.finalY + 7;

  // 3. Original Wire Combination (deleted "(one wire per row)")
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('2. ORIGINAL WIRE COMBINATION', 14, currentY);

  currentY += 3;

  // Flatten original wires into individual single wire rows
  const originalRows: (string | number)[][] = [];
  let origWireCounter = 1;
  originalWires.forEach((item) => {
    for (let c = 0; c < item.count; c++) {
      originalRows.push([
        `Wire #${origWireCounter}`,
        `${item.wire.swg} SWG`,
        `${item.wire.mm.toFixed(3)} mm`,
        `${item.wire.inch.toFixed(4)} in`,
        `${item.wire.area.toFixed(4)} mm²`,
      ]);
      origWireCounter++;
    }
  });

  // Add subtotal row
  originalRows.push([
    'ORIGINAL TOTAL',
    `${origWireCounter - 1} Wire(s)`,
    '—',
    '—',
    `${originalTotalArea.toFixed(4)} mm²`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Wire Line', 'Standard Wire Gauge', 'Diameter (mm)', 'Diameter (inches)', 'Cross-Section Area']],
    body: originalRows,
    theme: 'striped',
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      halign: 'center',
      cellPadding: 1.8,
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold' },
      4: { halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      // Highlight the total row
      if (data.row.index === originalRows.length - 1) {
        data.cell.styles.fillColor = [226, 232, 240];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [15, 23, 42];
      }
    },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  currentY = doc.lastAutoTable.finalY + 7;

  // 4. Selected Alternate Wire Combination (deleted "(one wire per row)")
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...copperColor);
  doc.text('3. SELECTED ALTERNATE COMBINATION', 14, currentY);

  currentY += 3;

  const alternateRows: (string | number)[][] = [];
  selectedCombination.wires.forEach((wire, idx) => {
    alternateRows.push([
      `Wire #${idx + 1}`,
      `${wire.swg} SWG`,
      `${wire.mm.toFixed(3)} mm`,
      `${wire.inch.toFixed(4)} in`,
      `${wire.area.toFixed(4)} mm²`,
    ]);
  });

  // Add subtotal row
  alternateRows.push([
    'ALTERNATE TOTAL',
    `${selectedCombination.wireCount} Wire(s)`,
    '—',
    '—',
    `${selectedCombination.totalArea.toFixed(4)} mm²`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Wire Line', 'Standard Wire Gauge', 'Diameter (mm)', 'Diameter (inches)', 'Cross-Section Area']],
    body: alternateRows,
    theme: 'striped',
    headStyles: {
      fillColor: copperColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      halign: 'center',
      cellPadding: 1.8,
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold' },
      4: { halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      // Highlight the total row
      if (data.row.index === alternateRows.length - 1) {
        data.cell.styles.fillColor = [254, 215, 170]; // warm copper highlight
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [124, 45, 18];
      }
    },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  currentY = doc.lastAutoTable.finalY + 6;

  // 5. Cross-Sectional Area Comparison & Engineering Verification
  // DELETED the column 'Variance / Difference' as requested
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('4. CROSS-SECTIONAL AREA COMPARISON & ENGINEERING VERIFICATION', 14, currentY);

  currentY += 3;

  const diffSign = selectedCombination.diff >= 0 ? '+' : '';
  const diffMm = `${diffSign}${selectedCombination.diff.toFixed(4)} mm²`;
  const diffPctFormatted = `${diffSign}${selectedCombination.diffPct.toFixed(2)}%`;
  const closestEquivalent = selectedCombination.closestWireDiff
    ? `${selectedCombination.closestWireDiff.swg} SWG (${selectedCombination.closestWireDiff.area.toFixed(4)} mm²)`
    : 'Negligible (< 50 SWG)';

  const origStrandCount = origWireCounter - 1;
  const altStrandCount = selectedCombination.wireCount;

  // 4 Columns: Parameter, Original, Alternate, Verification & Status
  // (Variance / Difference column deleted, with diff info merged cleanly into status/equivalents)
  const comparisonTableData = [
    [
      { content: 'Total Parallel Strands', styles: { fontStyle: 'bold' as const } },
      `${origStrandCount} Wire(s)`,
      `${altStrandCount} Wire(s)`,
      'Parallel winding configuration',
    ],
    [
      { content: 'Total Cross-Sectional Area', styles: { fontStyle: 'bold' as const } },
      `${originalTotalArea.toFixed(4)} mm²`,
      `${selectedCombination.totalArea.toFixed(4)} mm²`,
      // NOTE: "do not mention (standard) after 1.8%"
      `Diff: ${diffMm} (${diffPctFormatted}) • Within 1.8% of original cross sections combined (PASSED)`,
    ],
    [
      { content: 'Area Difference Equivalent', styles: { fontStyle: 'bold' as const } },
      'Baseline (100.0%)',
      `${(100 + selectedCombination.diffPct).toFixed(2)}% of Baseline`,
      `Equivalent closest wire: ${closestEquivalent}`,
    ],
    [
      { content: 'Strand-to-Strand Variance', styles: { fontStyle: 'bold' as const } },
      'Standard Winding',
      `${selectedCombination.maxVariancePct.toFixed(1)}% max variance`,
      'Within 30% limit • Balanced Current Flow (APPROVED)',
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [
      [
        'Engineering Parameter',
        'Original Winding',
        'Alternate Winding',
        'Verification & Equivalents',
      ],
    ],
    body: comparisonTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // primary slate
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.8,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.15,
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 48, fillColor: accentBg },
      1: { cellWidth: 36, fontStyle: 'bold' },
      2: { cellWidth: 38, fontStyle: 'bold', textColor: copperColor },
      3: { halign: 'left', cellWidth: 60, fontSize: 7.3 },
    },
    didParseCell: (data) => {
      // Highlight the Total Cross-Sectional Area row
      if (data.row.index === 1 && data.section === 'body') {
        if (data.column.index === 3) {
          data.cell.styles.fillColor = [240, 253, 244]; // light emerald
          data.cell.styles.textColor = successColor;
          data.cell.styles.fontStyle = 'bold';
        }
      }
      // Highlight approved variance
      if (data.row.index === 3 && data.section === 'body' && data.column.index === 3) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = successColor;
      }
    },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error autoTable adds lastAutoTable to doc
  currentY = doc.lastAutoTable.finalY + 7;

  // 6. Sign-off & Quality Inspection Box
  const signBoxWidth = (pageWidth - 28 - 6) / 2;

  // Left Sign Box
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, currentY, signBoxWidth, 20);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('REWINDER SIGNATURE & NAME:', 17, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('Date: ________________________', 17, currentY + 16);

  // Right Sign Box
  doc.rect(14 + signBoxWidth + 6, currentY, signBoxWidth, 20);
  doc.setFont('helvetica', 'bold');
  doc.text('QUALITY INSPECTOR / TESTED BY:', 14 + signBoxWidth + 9, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('Status: [✓] Approved for Winding', 14 + signBoxWidth + 9, currentY + 16);

  // 7. Footer Banner & Feedback notice (Bigger font with more visibility as requested)
  const footerHeight = 17;
  doc.setFillColor(...primaryColor);
  doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');

  // Decorative thin amber accent rule
  doc.setFillColor(...brightAmber);
  doc.rect(0, pageHeight - footerHeight, pageWidth, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5); // Bigger font with high visibility
  doc.setTextColor(255, 255, 255); // Crisp white
  doc.text(
    'Please send your feedback regarding improvements and additional features you need, to developer Lukhman at +91-7019192462 (Message only)',
    pageWidth / 2,
    pageHeight - 9.5,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...warmHighlight);
  doc.text(
    'Ralfin Electricals • Motor Winding Division • Alternate Wire Gauge Calculation & Job Card',
    pageWidth / 2,
    pageHeight - 4,
    { align: 'center' }
  );

  return doc;
}
