import { SWGWire } from '../types';

/**
 * Standard Wire Gauge (SWG) Table including Half-Stops (Half Sizes)
 * Extracted directly from the official specification chart:
 * BS 3728 / IS 13730 round copper magnet winding wire.
 */
export const DEFAULT_SWG_TABLE: SWGWire[] = [
  { swg: '7/0', swgNum: -6, mm: 12.700, inch: 0.5000, area: (Math.PI / 4) * Math.pow(12.700, 2) },
  { swg: '6/0', swgNum: -5, mm: 11.786, inch: 0.4640, area: (Math.PI / 4) * Math.pow(11.786, 2) },
  { swg: '5/0', swgNum: -4, mm: 10.973, inch: 0.4320, area: (Math.PI / 4) * Math.pow(10.973, 2) },
  { swg: '4/0', swgNum: -3, mm: 10.160, inch: 0.4000, area: (Math.PI / 4) * Math.pow(10.160, 2) },
  { swg: '3/0', swgNum: -2, mm: 9.449, inch: 0.3720, area: (Math.PI / 4) * Math.pow(9.449, 2) },
  { swg: '2/0', swgNum: -1, mm: 8.839, inch: 0.3480, area: (Math.PI / 4) * Math.pow(8.839, 2) },
  { swg: '0', swgNum: 0, mm: 8.230, inch: 0.3240, area: (Math.PI / 4) * Math.pow(8.230, 2) },
  { swg: '1', swgNum: 1, mm: 7.620, inch: 0.3000, area: (Math.PI / 4) * Math.pow(7.620, 2) },
  { swg: '1½', swgNum: 1.5, mm: 7.315, inch: 0.2880, area: (Math.PI / 4) * Math.pow(7.315, 2) },
  { swg: '2', swgNum: 2, mm: 7.010, inch: 0.2760, area: (Math.PI / 4) * Math.pow(7.010, 2) },
  { swg: '2½', swgNum: 2.5, mm: 6.706, inch: 0.2640, area: (Math.PI / 4) * Math.pow(6.706, 2) },
  { swg: '3', swgNum: 3, mm: 6.401, inch: 0.2520, area: (Math.PI / 4) * Math.pow(6.401, 2) },
  { swg: '3½', swgNum: 3.5, mm: 6.147, inch: 0.2420, area: (Math.PI / 4) * Math.pow(6.147, 2) },
  { swg: '4', swgNum: 4, mm: 5.893, inch: 0.2320, area: (Math.PI / 4) * Math.pow(5.893, 2) },
  { swg: '4½', swgNum: 4.5, mm: 5.639, inch: 0.2220, area: (Math.PI / 4) * Math.pow(5.639, 2) },
  { swg: '5', swgNum: 5, mm: 5.385, inch: 0.2120, area: (Math.PI / 4) * Math.pow(5.385, 2) },
  { swg: '5½', swgNum: 5.5, mm: 5.131, inch: 0.2020, area: (Math.PI / 4) * Math.pow(5.131, 2) },
  { swg: '6', swgNum: 6, mm: 4.877, inch: 0.1920, area: (Math.PI / 4) * Math.pow(4.877, 2) },
  { swg: '6½', swgNum: 6.5, mm: 4.674, inch: 0.1840, area: (Math.PI / 4) * Math.pow(4.674, 2) },
  { swg: '7', swgNum: 7, mm: 4.470, inch: 0.1760, area: (Math.PI / 4) * Math.pow(4.470, 2) },
  { swg: '7½', swgNum: 7.5, mm: 4.267, inch: 0.1680, area: (Math.PI / 4) * Math.pow(4.267, 2) },
  { swg: '8', swgNum: 8, mm: 4.064, inch: 0.1600, area: (Math.PI / 4) * Math.pow(4.064, 2) },
  { swg: '8½', swgNum: 8.5, mm: 3.861, inch: 0.1520, area: (Math.PI / 4) * Math.pow(3.861, 2) },
  { swg: '9', swgNum: 9, mm: 3.658, inch: 0.1440, area: (Math.PI / 4) * Math.pow(3.658, 2) },
  { swg: '9½', swgNum: 9.5, mm: 3.454, inch: 0.1360, area: (Math.PI / 4) * Math.pow(3.454, 2) },
  { swg: '10', swgNum: 10, mm: 3.251, inch: 0.1280, area: (Math.PI / 4) * Math.pow(3.251, 2) },
  { swg: '10½', swgNum: 10.5, mm: 3.099, inch: 0.1220, area: (Math.PI / 4) * Math.pow(3.099, 2) },
  { swg: '11', swgNum: 11, mm: 2.946, inch: 0.1160, area: (Math.PI / 4) * Math.pow(2.946, 2) },
  { swg: '11½', swgNum: 11.5, mm: 2.794, inch: 0.1100, area: (Math.PI / 4) * Math.pow(2.794, 2) },
  { swg: '12', swgNum: 12, mm: 2.642, inch: 0.1040, area: (Math.PI / 4) * Math.pow(2.642, 2) },
  { swg: '12½', swgNum: 12.5, mm: 2.489, inch: 0.0980, area: (Math.PI / 4) * Math.pow(2.489, 2) },
  { swg: '13', swgNum: 13, mm: 2.337, inch: 0.0920, area: (Math.PI / 4) * Math.pow(2.337, 2) },
  { swg: '13½', swgNum: 13.5, mm: 2.184, inch: 0.0860, area: (Math.PI / 4) * Math.pow(2.184, 2) },
  { swg: '14', swgNum: 14, mm: 2.032, inch: 0.0800, area: (Math.PI / 4) * Math.pow(2.032, 2) },
  { swg: '14½', swgNum: 14.5, mm: 1.930, inch: 0.0760, area: (Math.PI / 4) * Math.pow(1.930, 2) },
  { swg: '15', swgNum: 15, mm: 1.829, inch: 0.0720, area: (Math.PI / 4) * Math.pow(1.829, 2) },
  { swg: '15½', swgNum: 15.5, mm: 1.727, inch: 0.0680, area: (Math.PI / 4) * Math.pow(1.727, 2) },
  { swg: '16', swgNum: 16, mm: 1.626, inch: 0.0640, area: (Math.PI / 4) * Math.pow(1.626, 2) },
  { swg: '16½', swgNum: 16.5, mm: 1.524, inch: 0.0600, area: (Math.PI / 4) * Math.pow(1.524, 2) },
  { swg: '17', swgNum: 17, mm: 1.422, inch: 0.0560, area: (Math.PI / 4) * Math.pow(1.422, 2) },
  { swg: '17½', swgNum: 17.5, mm: 1.321, inch: 0.0520, area: (Math.PI / 4) * Math.pow(1.321, 2) },
  { swg: '18', swgNum: 18, mm: 1.219, inch: 0.0480, area: (Math.PI / 4) * Math.pow(1.219, 2) },
  { swg: '18½', swgNum: 18.5, mm: 1.118, inch: 0.0440, area: (Math.PI / 4) * Math.pow(1.118, 2) },
  { swg: '19', swgNum: 19, mm: 1.016, inch: 0.0400, area: (Math.PI / 4) * Math.pow(1.016, 2) },
  { swg: '19½', swgNum: 19.5, mm: 0.965, inch: 0.0380, area: (Math.PI / 4) * Math.pow(0.965, 2) },
  { swg: '20', swgNum: 20, mm: 0.914, inch: 0.0360, area: (Math.PI / 4) * Math.pow(0.914, 2) },
  { swg: '20½', swgNum: 20.5, mm: 0.864, inch: 0.0340, area: (Math.PI / 4) * Math.pow(0.864, 2) },
  { swg: '21', swgNum: 21, mm: 0.813, inch: 0.0320, area: (Math.PI / 4) * Math.pow(0.813, 2) },
  { swg: '21½', swgNum: 21.5, mm: 0.762, inch: 0.0300, area: (Math.PI / 4) * Math.pow(0.762, 2) },
  { swg: '22', swgNum: 22, mm: 0.711, inch: 0.0280, area: (Math.PI / 4) * Math.pow(0.711, 2) },
  { swg: '22½', swgNum: 22.5, mm: 0.660, inch: 0.0260, area: (Math.PI / 4) * Math.pow(0.660, 2) },
  { swg: '23', swgNum: 23, mm: 0.610, inch: 0.0240, area: (Math.PI / 4) * Math.pow(0.610, 2) },
  { swg: '23½', swgNum: 23.5, mm: 0.584, inch: 0.0230, area: (Math.PI / 4) * Math.pow(0.584, 2) },
  { swg: '24', swgNum: 24, mm: 0.559, inch: 0.0220, area: (Math.PI / 4) * Math.pow(0.559, 2) },
  { swg: '24½', swgNum: 24.5, mm: 0.533, inch: 0.0210, area: (Math.PI / 4) * Math.pow(0.533, 2) },
  { swg: '25', swgNum: 25, mm: 0.508, inch: 0.0200, area: (Math.PI / 4) * Math.pow(0.508, 2) },
  { swg: '25½', swgNum: 25.5, mm: 0.483, inch: 0.0190, area: (Math.PI / 4) * Math.pow(0.483, 2) },
  { swg: '26', swgNum: 26, mm: 0.457, inch: 0.0180, area: (Math.PI / 4) * Math.pow(0.457, 2) },
  { swg: '26½', swgNum: 26.5, mm: 0.437, inch: 0.0172, area: (Math.PI / 4) * Math.pow(0.437, 2) },
  { swg: '27', swgNum: 27, mm: 0.417, inch: 0.0164, area: (Math.PI / 4) * Math.pow(0.417, 2) },
  { swg: '28', swgNum: 28, mm: 0.376, inch: 0.0148, area: (Math.PI / 4) * Math.pow(0.376, 2) },
  { swg: '29', swgNum: 29, mm: 0.345, inch: 0.0136, area: (Math.PI / 4) * Math.pow(0.345, 2) },
  { swg: '30', swgNum: 30, mm: 0.315, inch: 0.0124, area: (Math.PI / 4) * Math.pow(0.315, 2) },
  { swg: '31', swgNum: 31, mm: 0.295, inch: 0.0116, area: (Math.PI / 4) * Math.pow(0.295, 2) },
  { swg: '32', swgNum: 32, mm: 0.274, inch: 0.0108, area: (Math.PI / 4) * Math.pow(0.274, 2) },
  { swg: '33', swgNum: 33, mm: 0.254, inch: 0.0100, area: (Math.PI / 4) * Math.pow(0.254, 2) },
  { swg: '34', swgNum: 34, mm: 0.234, inch: 0.0092, area: (Math.PI / 4) * Math.pow(0.234, 2) },
  { swg: '35', swgNum: 35, mm: 0.213, inch: 0.0084, area: (Math.PI / 4) * Math.pow(0.213, 2) },
  { swg: '36', swgNum: 36, mm: 0.193, inch: 0.0076, area: (Math.PI / 4) * Math.pow(0.193, 2) },
  { swg: '37', swgNum: 37, mm: 0.173, inch: 0.0068, area: (Math.PI / 4) * Math.pow(0.173, 2) },
  { swg: '38', swgNum: 38, mm: 0.152, inch: 0.0060, area: (Math.PI / 4) * Math.pow(0.152, 2) },
  { swg: '39', swgNum: 39, mm: 0.132, inch: 0.0052, area: (Math.PI / 4) * Math.pow(0.132, 2) },
  { swg: '40', swgNum: 40, mm: 0.122, inch: 0.0048, area: (Math.PI / 4) * Math.pow(0.122, 2) },
  { swg: '41', swgNum: 41, mm: 0.112, inch: 0.0044, area: (Math.PI / 4) * Math.pow(0.112, 2) },
  { swg: '42', swgNum: 42, mm: 0.102, inch: 0.0040, area: (Math.PI / 4) * Math.pow(0.102, 2) },
  { swg: '43', swgNum: 43, mm: 0.091, inch: 0.0036, area: (Math.PI / 4) * Math.pow(0.091, 2) },
  { swg: '44', swgNum: 44, mm: 0.081, inch: 0.0032, area: (Math.PI / 4) * Math.pow(0.081, 2) },
  { swg: '45', swgNum: 45, mm: 0.071, inch: 0.0028, area: (Math.PI / 4) * Math.pow(0.071, 2) },
  { swg: '46', swgNum: 46, mm: 0.061, inch: 0.0024, area: (Math.PI / 4) * Math.pow(0.061, 2) },
  { swg: '47', swgNum: 47, mm: 0.051, inch: 0.0020, area: (Math.PI / 4) * Math.pow(0.051, 2) },
  { swg: '48', swgNum: 48, mm: 0.041, inch: 0.0016, area: (Math.PI / 4) * Math.pow(0.041, 2) },
  { swg: '49', swgNum: 49, mm: 0.030, inch: 0.0012, area: (Math.PI / 4) * Math.pow(0.030, 2) },
  { swg: '50', swgNum: 50, mm: 0.025, inch: 0.0010, area: (Math.PI / 4) * Math.pow(0.025, 2) },
];

/**
 * Calculates nominal cross-sectional area from diameter in mm:
 * Area = (π / 4) * d²
 */
export function calculateAreaFromMm(diameterMm: number): number {
  return (Math.PI / 4) * Math.pow(diameterMm, 2);
}

/**
 * Finds which standard SWG wire has an area closest to a given target area (e.g. difference)
 */
export function findClosestSWGToArea(
  targetArea: number,
  table: SWGWire[] = DEFAULT_SWG_TABLE
): { swg: string; area: number; diffFromDifference: number } | null {
  const absTarget = Math.abs(targetArea);
  if (absTarget < 0.0001) {
    return null; // negligible
  }

  let closest: SWGWire = table[table.length - 1];
  let minDiff = Math.abs(closest.area - absTarget);

  for (const wire of table) {
    const diff = Math.abs(wire.area - absTarget);
    if (diff < minDiff) {
      minDiff = diff;
      closest = wire;
    }
  }

  return {
    swg: closest.swg,
    area: closest.area,
    diffFromDifference: minDiff,
  };
}

/**
 * Common standard winding gauges used in motor repairs (SWG 10 to 38, including half stops)
 */
export const COMMON_WINDING_SWG_LIST = [
  '12', '12½', '13', '13½', '14', '14½', '15', '15½', '16', '16½',
  '17', '17½', '18', '18½', '19', '19½', '20', '20½', '21', '21½',
  '22', '22½', '23', '23½', '24', '24½', '25', '25½', '26', '26½',
  '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38'
];
