// Area Calculator Utility for Real Estate
// Converts between different area units

export const AREA_UNITS = {
  SQ_FEET: "sq_feet",
  SQ_METER: "sq_meter",
  SQ_YARD: "sq_yard",
  ACRE: "acre",
  HECTARE: "hectare",
  BIGHA: "bigha",
  KATHA: "katha",
  GUNTA: "gunta",
  CENT: "cent",
};

export const UNIT_LABELS = {
  [AREA_UNITS.SQ_FEET]: "Sq Ft",
  [AREA_UNITS.SQ_METER]: "Sq M",
  [AREA_UNITS.SQ_YARD]: "Sq Yd",
  [AREA_UNITS.ACRE]: "Acre",
  [AREA_UNITS.HECTARE]: "Hectare",
  [AREA_UNITS.BIGHA]: "Bigha",
  [AREA_UNITS.KATHA]: "Katha",
  [AREA_UNITS.GUNTA]: "Gunta",
  [AREA_UNITS.CENT]: "Cent",
};

export const UNIT_FULL_NAMES = {
  [AREA_UNITS.SQ_FEET]: "Square Feet",
  [AREA_UNITS.SQ_METER]: "Square Meter",
  [AREA_UNITS.SQ_YARD]: "Square Yard",
  [AREA_UNITS.ACRE]: "Acre",
  [AREA_UNITS.HECTARE]: "Hectare",
  [AREA_UNITS.BIGHA]: "Bigha",
  [AREA_UNITS.KATHA]: "Katha",
  [AREA_UNITS.GUNTA]: "Gunta",
  [AREA_UNITS.CENT]: "Cent",
};

// Conversion rates to square feet (base unit)
const CONVERSION_TO_SQ_FEET = {
  [AREA_UNITS.SQ_FEET]: 1,
  [AREA_UNITS.SQ_METER]: 10.764, // 1 sq meter = 10.764 sq feet
  [AREA_UNITS.SQ_YARD]: 9, // 1 sq yard = 9 sq feet
  [AREA_UNITS.ACRE]: 43560, // 1 acre = 43,560 sq feet
  [AREA_UNITS.HECTARE]: 107639.1, // 1 hectare = 107,639.1 sq feet
  [AREA_UNITS.BIGHA]: 26909.8, // 1 bigha ≈ 26,909.8 sq feet (varies by region)
  [AREA_UNITS.KATHA]: 1361.25, // 1 katha ≈ 1,361.25 sq feet (Bengal)
  [AREA_UNITS.GUNTA]: 1089, // 1 gunta = 1,089 sq feet
  [AREA_UNITS.CENT]: 435.6, // 1 cent = 435.6 sq feet
};

/**
 * Convert area from one unit to another
 * @param {number} value - The area value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertArea(value, fromUnit, toUnit) {
  if (!value || value <= 0) return 0;
  if (fromUnit === toUnit) return value;

  // Convert to square feet first, then to target unit
  const sqFeetValue = value * CONVERSION_TO_SQ_FEET[fromUnit];
  const convertedValue = sqFeetValue / CONVERSION_TO_SQ_FEET[toUnit];

  return Math.round(convertedValue * 100) / 100; // Round to 2 decimal places
}

/**
 * Get all possible conversions for a given area value
 * @param {number} value - Area value in square feet
 * @param {string} originalUnit - Original unit (default: sq_feet)
 * @returns {Object} Object with all unit conversions
 */
export function getAllConversions(value, originalUnit = AREA_UNITS.SQ_FEET) {
  const conversions = {};

  Object.values(AREA_UNITS).forEach((unit) => {
    conversions[unit] = convertArea(value, originalUnit, unit);
  });

  return conversions;
}

/**
 * Format area value with proper unit display
 * @param {number} value - Area value
 * @param {string} unit - Unit type
 * @param {boolean} showFullName - Show full unit name or abbreviation
 * @returns {string} Formatted string
 */
export function formatArea(value, unit, showFullName = false) {
  if (!value || value <= 0) return "N/A";

  const formattedValue = new Intl.NumberFormat("en-IN").format(value);
  const unitLabel = showFullName ? UNIT_FULL_NAMES[unit] : UNIT_LABELS[unit];

  return `${formattedValue} ${unitLabel}`;
}

/**
 * Get the most appropriate unit for display based on area size
 * @param {number} sqFeet - Area in square feet
 * @returns {string} Most appropriate unit
 */
export function getOptimalUnit(sqFeet) {
  if (sqFeet >= 43560) return AREA_UNITS.ACRE; // 1+ acre
  if (sqFeet >= 10000) return AREA_UNITS.BIGHA; // Large plots
  if (sqFeet >= 1000) return AREA_UNITS.SQ_FEET; // Regular properties
  if (sqFeet >= 100) return AREA_UNITS.SQ_METER; // Small properties
  return AREA_UNITS.SQ_FEET; // Default
}

/**
 * Get popular units for Indian real estate
 * @returns {Array} Array of popular units
 */
export function getPopularUnits() {
  return [
    AREA_UNITS.SQ_FEET,
    AREA_UNITS.SQ_METER,
    AREA_UNITS.SQ_YARD,
    AREA_UNITS.ACRE,
    AREA_UNITS.BIGHA,
    AREA_UNITS.GUNTA,
  ];
}

/**
 * Validate if area value is reasonable
 * @param {number} value - Area value
 * @param {string} unit - Unit type
 * @returns {boolean} Is valid
 */
export function isValidArea(value, unit) {
  if (!value || value <= 0) return false;

  const sqFeetValue = convertArea(value, unit, AREA_UNITS.SQ_FEET);

  // Reasonable limits for real estate (50 sq ft to 1000 acres)
  return sqFeetValue >= 50 && sqFeetValue <= 43560000;
}
