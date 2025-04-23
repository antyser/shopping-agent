/**
 * A service module to wrap Chrome Extension APIs for easier use and testing.
 */

/**
 * Sends a message to other parts of the extension (e.g., background script)
 * and returns the response via a Promise.
 * @param message - The message object to send.
 * @returns A promise that resolves with the response or rejects on error.
 */
export function sendMessage<TResponse = unknown>(
  message: unknown
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        // Reject the promise with the lastError message
        return reject(new Error(chrome.runtime.lastError.message));
      }
      // Resolve the promise with the response
      resolve(response as TResponse);
    });
  });
}

/**
 * Gets data from chrome.storage.local.
 * @param keys - A key or array of keys to retrieve.
 * @returns A promise that resolves with an object containing the requested key-value pairs.
 */
export function getStorageLocal(
  keys: string | string[] | null
): Promise<{ [key: string]: unknown }> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve(result);
    });
  });
}

/**
 * Sets data in chrome.storage.local.
 * @param items - An object containing one or more key-value pairs to store.
 * @returns A promise that resolves when the operation completes or rejects on error.
 */
export function setStorageLocal(items: {
  [key: string]: unknown;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve();
    });
  });
}

/**
 * Adds a listener to chrome.storage.onChanged events.
 * @param callback - Function to call when storage changes.
 *                  Receives (changes, areaName) as arguments.
 */
export function addStorageListener(
  callback: (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) => void
): void {
  chrome.storage.onChanged.addListener(callback);
}

/**
 * Removes a listener previously added with addStorageListener.
 * @param callback - The exact same function reference passed to addStorageListener.
 */
export function removeStorageListener(
  callback: (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) => void
): void {
  chrome.storage.onChanged.removeListener(callback);
}

// Add more wrappers as needed (e.g., for chrome.identity, chrome.tabs, etc.)
