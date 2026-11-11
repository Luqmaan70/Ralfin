export interface SWGWire {
  swg: string; // e.g. "18", "7/0"
  swgNum: number; // numeric value for sorting (-6 for 7/0 to 50)
  mm: number; // diameter in mm
  inch: number; // diameter in inches
  area: number; // nominal cross-sectional area in mm²
  weightKgKm?: number; // approx copper weight kg/km
  resistanceOhmKm?: number; // approx resistance at 20°C ohm/km
}

export interface SelectedWireItem {
  wire: SWGWire;
  count: number;
}

export interface IndividualWireRow {
  index: number;
  swg: string;
  mm: number;
  inch: number;
  area: number;
}

export interface SuggestedCombination {
  id: string;
  wireCount: number;
  wires: SWGWire[]; // individual wires (e.g. [wireA, wireA, wireB])
  totalArea: number;
  diff: number; // suggested - original
  diffPct: number; // ((suggested - original) / original) * 100
  absDiffPct: number;
  maxVariancePct: number; // ((maxArea - minArea) / maxArea) * 100
  closestWireDiff: {
    swg: string;
    area: number;
    diffFromDifference: number;
  } | null;
  isAdjacentReplacement?: boolean;
  replacementNote?: string;
}

export interface MotorJobCard {
  clientName: string;
  contactPhone: string;
  motorDesc: string;
  serialNo: string;
  motorType: string;
  powerKw: string;
  hp: string;
  voltage: string;
  frequency: string;
  poles: string;
  phases: string;
  rpm: string;
  mounting: string;
  bearings: string;
  remarks: string;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: string;
  dateFormatted: string;
  originalWires: { swg: string; mm: number; area: number; count: number }[];
  originalTotalArea: number;
  selectedCombination: SuggestedCombination;
  jobCard: MotorJobCard;
}
