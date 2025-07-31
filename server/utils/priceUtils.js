/**
 * Utility functions for handling price conversions
 */

/**
 * Convert price string to numeric value for database queries
 * @param {string} priceString - Price in format "33 CR", "50 LAKH", etc.
 * @returns {number} - Numeric value in base units
 */
export function parsePriceToNumber(priceString) {
  if (!priceString || typeof priceString !== "string") {
    return 0;
  }

  const trimmed = priceString.trim().toUpperCase();

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
 * @param {string} priceString - Price to check (e.g., "50 LAKH")
 * @param {string} threshold - Threshold price (e.g., "50 LAKH")
 * @returns {boolean} - True if price >= threshold
 */
export function isPriceGreaterThanOrEqual(priceString, threshold) {
  const priceNumeric = parsePriceToNumber(priceString);
  const thresholdNumeric = parsePriceToNumber(threshold);
  return priceNumeric >= thresholdNumeric;
}
