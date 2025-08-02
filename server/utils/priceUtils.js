/**
 * Utility functions for handling price conversions
 */

/**
 * Convert price string to numeric value for database queries
 * @param {string} priceString - Price in format "33 CR", "50 LAKH", "22cr - 27.6cr", etc.
 * @returns {number} - Numeric value in base units (for ranges, returns average)
 */
export function parsePriceToNumber(priceString) {
  if (!priceString || typeof priceString !== "string") {
    return 0;
  }

  const trimmed = priceString.trim().toUpperCase();

  // Handle price ranges (contains "-" or "to")
  if (trimmed.includes("-") || trimmed.includes("TO")) {
    return parsePriceRangeToNumber(trimmed);
  }

  // Handle CR (Crore) format: "33 CR" -> 33000000
  if (trimmed.includes("CR")) {
    const value = parseFloat(trimmed.replace("CR", "").trim());
    return isNaN(value) ? 0 : value * 10000000;
  }

  // Handle LAKH format: "50 LAKH" -> 5000000
  if (trimmed.includes("LAKH")) {
    const value = parseFloat(trimmed.replace("LAKH", "").trim());
    return isNaN(value) ? 0 : value * 100000;
  }

  // Handle plain numeric values
  const value = parseFloat(trimmed);
  return isNaN(value) ? 0 : value;
}

/**
 * Parse price range to numeric value (returns average)
 * @param {string} priceRange - Price range like "22CR - 27.6CR" or "35LAKH-66LAKH"
 * @returns {number} - Average numeric value in base units
 */
export function parsePriceRangeToNumber(priceRange) {
  if (!priceRange || typeof priceRange !== "string") {
    return 0;
  }

  const trimmed = priceRange.trim().toUpperCase();

  // Split by "-" or "TO"
  const parts = trimmed.split(/[-TO]+/).map((part) => part.trim());

  if (parts.length !== 2) {
    return 0;
  }

  const minPrice = parseSinglePriceToNumber(parts[0]);
  const maxPrice = parseSinglePriceToNumber(parts[1]);

  if (minPrice === 0 || maxPrice === 0) {
    return 0;
  }

  // Return average of min and max
  return (minPrice + maxPrice) / 2;
}

/**
 * Parse single price to numeric value
 * @param {string} priceString - Single price like "22CR" or "35LAKH"
 * @returns {number} - Numeric value in base units
 */
export function parseSinglePriceToNumber(priceString) {
  if (!priceString || typeof priceString !== "string") {
    return 0;
  }

  const trimmed = priceString.trim().toUpperCase();

  // Handle CR (Crore) format: "33CR" -> 33000000
  if (trimmed.includes("CR")) {
    const value = parseFloat(trimmed.replace("CR", "").trim());
    return isNaN(value) ? 0 : value * 10000000;
  }

  // Handle LAKH format: "50LAKH" -> 5000000
  if (trimmed.includes("LAKH")) {
    const value = parseFloat(trimmed.replace("LAKH", "").trim());
    return isNaN(value) ? 0 : value * 100000;
  }

  // Handle plain numeric values
  const value = parseFloat(trimmed);
  return isNaN(value) ? 0 : value;
}

/**
 * Convert numeric value back to price string format
 * @param {number} numericValue - Numeric value in base units
 * @returns {string} - Price in format "33 CR" or "50 LAKH"
 */
export function formatPriceToString(numericValue) {
  if (!numericValue || isNaN(numericValue)) {
    return "0 LAKH";
  }

  if (numericValue >= 10000000) {
    // Convert to Crore
    return `${(numericValue / 10000000).toFixed(2)} CR`;
  } else if (numericValue >= 100000) {
    // Convert to Lakh
    return `${(numericValue / 100000).toFixed(2)} LAKH`;
  } else {
    // Keep as is for smaller amounts
    return `${numericValue.toFixed(2)} LAKH`;
  }
}

/**
 * Create a Prisma where clause for price range filtering
 * @param {string} minPrice - Minimum price string
 * @param {string} maxPrice - Maximum price string
 * @returns {object} - Prisma where clause for price filtering
 */
export function createPriceFilter(minPrice, maxPrice) {
  const filter = {};

  if (minPrice) {
    const minNumeric = parsePriceToNumber(minPrice);
    if (minNumeric > 0) {
      filter.gte = minNumeric;
    }
  }

  if (maxPrice) {
    const maxNumeric = parsePriceToNumber(maxPrice);
    if (maxNumeric > 0) {
      filter.lte = maxNumeric;
    }
  }

  return Object.keys(filter).length > 0 ? filter : undefined;
}

/**
 * Create a Prisma where clause for string-based price filtering
 * This function works with the string price field in the database
 * @param {string} minPrice - Minimum price string (e.g., "50 LAKH")
 * @param {string} maxPrice - Maximum price string (e.g., "1 CR")
 * @returns {object} - Prisma where clause for string price filtering
 */
export function createStringPriceFilter(minPrice, maxPrice) {
  const filter = {};

  if (minPrice) {
    // For minimum price, we need to find prices that are >= minPrice
    // Since price is stored as string, we need to handle this differently
    const minNumeric = parsePriceToNumber(minPrice);
    if (minNumeric > 0) {
      // Convert back to string format for comparison
      const minPriceString = formatPriceToString(minNumeric);
      filter.gte = minPriceString;
    }
  }

  if (maxPrice) {
    const maxNumeric = parsePriceToNumber(maxPrice);
    if (maxNumeric > 0) {
      const maxPriceString = formatPriceToString(maxNumeric);
      filter.lte = maxPriceString;
    }
  }

  return Object.keys(filter).length > 0 ? filter : undefined;
}

/**
 * Check if a price string is greater than or equal to a threshold
 * @param {string} priceString - Price to check (e.g., "50 LAKH", "22cr - 27.6cr")
 * @param {string} threshold - Threshold price (e.g., "50 LAKH")
 * @returns {boolean} - True if price >= threshold
 */
export function isPriceGreaterThanOrEqual(priceString, threshold) {
  const priceNumeric = parsePriceToNumber(priceString);
  const thresholdNumeric = parsePriceToNumber(threshold);
  return priceNumeric >= thresholdNumeric;
}

/**
 * Check if a price string is a range
 * @param {string} priceString - Price string to check
 * @returns {boolean} - True if it's a price range
 */
export function isPriceRange(priceString) {
  if (!priceString || typeof priceString !== "string") {
    return false;
  }
  return priceString.includes("-") || priceString.toLowerCase().includes("to");
}

/**
 * Extract min and max values from a price range
 * @param {string} priceRange - Price range like "22cr - 27.6cr"
 * @returns {object} - { min: number, max: number } in base units
 */
export function extractPriceRangeValues(priceRange) {
  if (!isPriceRange(priceRange)) {
    const singleValue = parsePriceToNumber(priceRange);
    return { min: singleValue, max: singleValue };
  }

  const trimmed = priceRange.trim().toUpperCase();
  const parts = trimmed.split(/[-TO]+/).map((part) => part.trim());

  if (parts.length !== 2) {
    return { min: 0, max: 0 };
  }

  const minPrice = parseSinglePriceToNumber(parts[0]);
  const maxPrice = parseSinglePriceToNumber(parts[1]);

  return { min: minPrice, max: maxPrice };
}
