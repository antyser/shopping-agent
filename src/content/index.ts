console.log("Content script (ts) loaded.");

/**
 * Defines the structure of the product information payload.
 */
interface ProductInfoPayload {
  name: string;
  url: string;
}

/**
 * Extracts product name (og:title or document title) and URL,
 * then sends it to the background script.
 */
function extractAndSendProductInfo(): void {
  // 1. Get Page URL
  const pageUrl: string = window.location.href;

  // 2. Get Product Name
  let productName: string | null =
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
      ?.content ||
    document.title ||
    null;

  if (productName) {
    productName = productName.trim();
  } else {
    console.warn(
      "Content Script: Could not extract product name from og:title or document.title"
    );
    // Don't send if no name found
    return;
  }

  console.log("Content Script Extracted Info:", { productName, pageUrl });

  // 3. Send Message to Background Script
  const payload: ProductInfoPayload = { name: productName, url: pageUrl };
  chrome.runtime.sendMessage(
    { type: "PRODUCT_INFO_CAPTURED", payload: payload },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Content Script: Error sending PRODUCT_INFO_CAPTURED:",
          chrome.runtime.lastError.message
        );
      } else {
        console.log(
          "Content Script: PRODUCT_INFO_CAPTURED acknowledged by background:",
          response
        );
      }
    }
  );
}

// --- Initial Extraction Execution ---
// Run extraction logic when the document is idle
if (document.readyState === "complete") {
  extractAndSendProductInfo();
} else {
  window.addEventListener("load", extractAndSendProductInfo, { once: true });
}

// Note: No UI mounting logic here anymore. It will be in the side panel script.
