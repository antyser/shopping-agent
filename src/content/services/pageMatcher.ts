/**
 * Utility functions to determine if the current page matches specific criteria.
 */

/**
 * Checks if the current URL corresponds to an Amazon product page.
 * @returns {boolean} True if it's a product page, false otherwise.
 */
export function isAmazonProductPage(): boolean {
  // Ensure window object is available (it should be in content scripts)
  if (typeof window === "undefined") {
    return false;
  }
  const url: string = window.location.href;
  // Check for a valid Amazon domain
  const domainRegex =
    /^https?:\/\/(www\.)?amazon\.(com|co\.uk|de|fr|ca|it|es|jp)\//i;
  // Check for product path patterns (/dp/ or /gp/product/)
  const productPathRegex = /(\/dp\/|\/gp\/product\/)/i;

  return domainRegex.test(url) && productPathRegex.test(url);
}

/**
 * Checks if the current page is supported by the extension.
 * Currently, only checks for Amazon product pages.
 * @returns {boolean} True if the page is supported, false otherwise.
 */
export function isSupportedPage(): boolean {
  // Add more checks here for other supported pages later
  return true;
}
