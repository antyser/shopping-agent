import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase";
import { signInWithGoogle, signOutUser } from "./auth";
import { fetchProductInsights } from "./api"; // Import the API function

console.log("Background script started.");
console.log("Firebase Auth service:", auth); // Log the imported auth service

/**
 * Listens for Firebase Auth state changes and updates chrome.storage.local.
 */
onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    // User is signed in
    console.log("Auth state changed: User is signed in", user.uid);
    chrome.storage.local.set({ isLoggedIn: true, userId: user.uid }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error setting auth state in storage:",
          chrome.runtime.lastError
        );
      }
      // You could optionally get and store the ID token here if needed frequently,
      // but it's often better to get it on demand using user.getIdToken()
      // user.getIdToken().then((token) => { ... });
    });
  } else {
    // User is signed out
    console.log("Auth state changed: User is signed out");
    chrome.storage.local.set({ isLoggedIn: false, userId: null }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error clearing auth state in storage:",
          chrome.runtime.lastError
        );
      }
    });
  }
});
console.log("Auth state listener added.");

/**
 * Listens for messages from other parts of the extension (e.g., popup).
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message);

  if (message.action === "login") {
    signInWithGoogle()
      .then((userCredential) => {
        console.log("Background: Login successful", userCredential.user.uid);
        sendResponse({ status: "success" });
      })
      .catch((error) => {
        console.error("Background: Login failed", error);
        sendResponse({ status: "error", error: error.message });
      });
    return true; // Indicate that sendResponse will be called asynchronously
  } else if (message.action === "logout") {
    signOutUser()
      .then(() => {
        console.log("Background: Logout successful");
        sendResponse({ status: "success" });
      })
      .catch((error) => {
        console.error("Background: Logout failed", error);
        sendResponse({ status: "error", error: error.message });
      });
    return true; // Indicate that sendResponse will be called asynchronously
  }

  // Handle other message types if needed
  console.log("Unknown message action:", message.action);
  // Return false or undefined if not handling the message asynchronously
  return false;
});

// --- Message Listener for Content Script Communication ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  console.log("Sender:", sender);

  // Check if the message is from our content script and has the correct type
  if (message.type === "PRODUCT_PAGE_DETECTED" && message.url) {
    console.log(`Product page detected: ${message.url}. Fetching insights...`);

    // Call the async API function
    fetchProductInsights(message.url)
      .then((insights) => {
        console.log("Sending insights back to content script:", insights);
        // Send the insights back to the content script
        sendResponse({ success: true, data: insights });
      })
      .catch((error) => {
        console.error("Error fetching insights:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch insights";
        sendResponse({ success: false, error: errorMessage });
      });

    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }

  // Handle other message types if needed in the future
  console.log("Unhandled message type or origin.");
  // Return false or undefined if not handling the message asynchronously
  return false;
});

console.log("Message listener added.");

// TODO: Add listeners for browser actions, messages, etc.
// TODO: Implement core background logic here
