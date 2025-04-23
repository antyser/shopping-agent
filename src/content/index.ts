console.log("Content script loaded.");

/**
 * Checks if the current URL corresponds to an Amazon product page.
 * @returns {boolean} True if it's a product page, false otherwise.
 */
function isAmazonProductPage(): boolean {
  const url: string = window.location.href;
  // Check for a valid Amazon domain
  const domainRegex =
    /^https?:\/\/(www\.)?amazon\.(com|co\.uk|de|fr|ca|it|es|jp)\//i;
  // Check for product path patterns (/dp/ or /gp/product/)
  const productPathRegex = /(\/dp\/|\/gp\/product\/)/i;

  return domainRegex.test(url) && productPathRegex.test(url);
}

// Main execution logic for the content script
if (isAmazonProductPage()) {
  const currentUrl = window.location.href;
  console.log("This is an Amazon product page:", currentUrl);

  console.log("Sending message to background script...");
  chrome.runtime.sendMessage(
    {
      type: "PRODUCT_PAGE_DETECTED", // Message type identifier
      url: currentUrl, // The full URL of the product page
    },
    (response) => {
      // Optional: Handle response from the background script
      if (chrome.runtime.lastError) {
        console.error(
          "Error sending message:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log("Background script responded:", response);
      }
    }
  );
} else {
  console.log("This is not an Amazon product page.");
}

// Example: If you need to interact with the DOM, ensure types are available
// const body: HTMLBodyElement | null = document.querySelector('body');
// if (body) {
//   console.log('Body element found');
// }
