import {
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";
import {
  signInWithGoogle,
  signOutUser,
  signUpAndVerifyUser,
  signInWithEmail,
  resendVerificationEmailHandler,
} from "./auth";

console.log("Background script started.");
console.log("Firebase Auth service:", auth);

/**
 * Listens for Firebase Auth state changes and updates chrome.storage.local.
 */
onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    // User is signed in
    console.log("Auth state changed: User is signed in", {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
    chrome.storage.local.set(
      {
        isLoggedIn: true,
        userId: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error setting auth state in storage:",
            chrome.runtime.lastError
          );
        }
      }
    );
  } else {
    // User is signed out
    console.log("Auth state changed: User is signed out");
    chrome.storage.local.set(
      {
        isLoggedIn: false,
        userId: null,
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: null,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error clearing auth state in storage:",
            chrome.runtime.lastError
          );
        }
      }
    );
  }
});
console.log("Auth state listener added (includes emailVerified and email).");

// Define types for storage and messaging
interface ProductInfo {
  name: string;
  url: string;
}

// A more specific type for the PRODUCT_INFO_CAPTURED message
interface ProductInfoCapturedMessage {
  type: "PRODUCT_INFO_CAPTURED";
  payload: ProductInfo;
}

// A general type for other potential messages (can be expanded)
interface OtherMessage {
  type: string; // Use specific literal types for other messages if known
  payload?: unknown; // Use unknown instead of any
  tabId?: number;
}

// Type for messages using 'action'
interface ActionMessage {
  action: string; // e.g., "loginWithGoogle", "loginWithEmail"
  // Add other properties specific to action messages if needed
  // For example, for loginWithEmail:
  email?: string;
  password?: string;
  nickname?: string; // For signup
  payload?: unknown; // Generic payload if actions vary widely
}

type BackgroundMessage =
  | ProductInfoCapturedMessage
  | OtherMessage
  | ActionMessage;

// Listener for messages from content scripts or other extension parts
chrome.runtime.onMessage.addListener(
  (
    message: BackgroundMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ): boolean | undefined => {
    console.log(
      "Unified Message Listener: Received message:",
      message,
      "from sender:",
      sender
    );

    // --- NEW: Check for 'action' property first for auth/command messages ---
    if ("action" in message && typeof message.action === "string") {
      const actionMessage = message as ActionMessage; // Type assertion

      if (actionMessage.action === "loginWithGoogle") {
        console.log("Handling 'loginWithGoogle' action...");
        signInWithGoogle()
          .then((userCredential: UserCredential | null) => {
            console.log(
              "Background: Google Login successful",
              userCredential?.user?.uid
            );
            sendResponse({
              status: "success",
              userId: userCredential?.user?.uid,
            });
          })
          .catch((error: Error) => {
            console.error("Background: Google Login failed", error);
            let errorCode: string | null = null;
            // Safely try to access 'code'
            if (error && typeof error === "object" && "code" in error) {
              errorCode = (error as { code: string }).code;
            }
            const errorMessage = error.message || "An unknown error occurred";

            if (
              errorMessage.includes("cancelled") || // Broader check for cancellation
              errorMessage.includes("closed by the user") ||
              errorCode === "auth/popup-closed-by-user" || // Firebase specific
              errorCode === "auth/cancelled-popup-request"
            ) {
              sendResponse({
                status: "cancelled",
                error: "Login cancelled by user.",
              });
            } else if (errorCode === "auth/network-request-failed") {
              sendResponse({
                status: "error",
                error: "Network error during login. Please check connection.",
              });
            } else if (errorMessage.includes("chrome.identity")) {
              // Check for chrome.identity issues
              sendResponse({
                status: "error",
                error:
                  "Browser identity error. Ensure extension permissions and OAuth Client ID are correct.",
              });
            } else {
              sendResponse({
                status: "error",
                error: errorMessage,
              });
            }
          });
        return true; // Indicates asynchronous response
      }

      if (actionMessage.action === "loginWithEmail") {
        console.log("Handling 'loginWithEmail' action...");
        const { email, password } = actionMessage;

        if (!email || !password) {
          console.error("Background: Login missing email or password.");
          sendResponse({
            status: "error",
            error: "Email and password are required for login.",
          });
          return false; // Synchronous response
        }

        signInWithEmail(email, password)
          .then((userCredential: UserCredential) => {
            console.log(
              "Background: Email Login successful",
              userCredential.user.uid
            );
            sendResponse({
              status: "success",
              userId: userCredential.user.uid,
            });
          })
          .catch((error: Error) => {
            console.error("Background: Email Login failed", error);
            sendResponse({ status: "error", error: error.message });
          });
        return true; // Indicates asynchronous response
      }

      if (actionMessage.action === "signupWithEmail") {
        console.log("Handling 'signupWithEmail' action...");
        const { email, password, nickname } = actionMessage;
        if (!email || !password) {
          sendResponse({
            status: "error",
            error: "Email and password are required for signup.",
          });
          return false;
        }
        signUpAndVerifyUser(email, password, nickname || null)
          .then((userCredential) => {
            sendResponse({
              status: "success",
              userId: userCredential.user.uid,
            });
          })
          .catch((error: Error) => {
            sendResponse({ status: "error", error: error.message });
          });
        return true;
      }

      if (actionMessage.action === "logout") {
        console.log("Handling 'logout' action...");
        signOutUser()
          .then(() => {
            sendResponse({ status: "success" });
          })
          .catch((error: Error) => {
            sendResponse({ status: "error", error: error.message });
          });
        return true;
      }

      if (actionMessage.action === "resendVerificationEmail") {
        console.log("Handling 'resendVerificationEmail' action...");
        resendVerificationEmailHandler()
          .then(() => {
            sendResponse({
              status: "success",
              message: "Verification email resent.",
            });
          })
          .catch((error: Error) => {
            sendResponse({ status: "error", error: error.message });
          });
        return true;
      }

      // Add other 'action' handlers here if needed

      // If action is not recognized by this block:
      console.log(
        "Unified Message Listener: Unhandled action type:",
        actionMessage.action
      );
      sendResponse({
        success: false,
        error: `Unhandled action: ${actionMessage.action}`,
      });
      return false; // Synchronous response for unhandled actions
    }
    // --- END NEW action handling block ---

    // --- Existing 'type' based handling ---
    // Type guard to ensure 'type' exists before checking its value
    if ("type" in message && message.type === "PRODUCT_INFO_CAPTURED") {
      const productInfoMessage = message as ProductInfoCapturedMessage; // Type assertion
      // Ensure the message came from a tab
      if (!sender.tab?.id) {
        console.warn(
          "Shopping Agent: Received PRODUCT_INFO_CAPTURED without sender.tab.id"
        );
        sendResponse({
          success: false,
          error: "Message must come from a content script in a tab.",
        });
        return false; // Indicate synchronous response
      }

      const tabId: number = sender.tab.id;
      const productInfo = productInfoMessage.payload; // Type is already ProductInfo due to check
      const key = `productInfo_${tabId}`; // Store per-tab

      console.log(
        `Shopping Agent: Received PRODUCT_INFO_CAPTURED for tab ${tabId}:`,
        productInfo
      );

      chrome.storage.local.set({ [key]: productInfo }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            `Shopping Agent: Error storing product info for tab ${tabId}:`,
            chrome.runtime.lastError.message
          );
          // Send failure response back to the content script
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          console.log(
            `Shopping Agent: Stored product info for tab ${tabId} under key ${key}.`
          );
          // Send success response back to the content script
          sendResponse({ success: true, storedKey: key });
        }
      });

      return true; // Crucial: Indicates that sendResponse will be called asynchronously
    }
    // If the message type isn't handled, indicate synchronous response (or no response needed)
    // --- MODIFIED: This part is effectively a fallback if neither 'action' nor known 'type' matched ---
    console.log(
      "Unified Message Listener: Received unhandled message structure:",
      message
    );
    sendResponse({
      success: false,
      error: "Unknown message structure or type.",
    });
    return false; // Synchronous response
  }
);

// Optional: Add listener for when a tab is removed to clean up storage
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  const key = `productInfo_${tabId}`;
  chrome.storage.local.remove(key, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `Shopping Agent: Error removing stored info for closed tab ${tabId}:`,
        chrome.runtime.lastError.message
      );
    } else {
      console.log(
        `Shopping Agent: Removed stored info for closed tab ${tabId} (key: ${key}).`
      );
    }
  });
});

// Listen for clicks on the browser action icon
chrome.action.onClicked.addListener((tab) => {
  console.log("Background script: Action icon clicked for tab:", tab.id);

  // Ensure the tab has an ID before trying to send a message
  if (tab.id) {
    console.log(
      `Background script: Sending 'togglePanel' message to tab ${tab.id}`
    );
    chrome.tabs.sendMessage(tab.id, { action: "togglePanel" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          `Background script: Error sending togglePanel message to tab ${tab.id}:`,
          chrome.runtime.lastError.message
        );
      } else {
        console.log(
          `Background script: Received response from content script in tab ${tab.id}:`,
          response
        );
      }
    });
  } else {
    console.warn("Background script: Clicked tab has no ID.");
  }
});

// TODO: Add listeners for browser actions, messages, etc.
// TODO: Implement core background logic here

console.log("Shopping Agent background script loaded.");
