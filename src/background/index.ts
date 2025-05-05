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

/**
 * Listens for messages from other parts of the extension (e.g., popup).
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    "Unified Message Listener: Received message:",
    message,
    "from sender:",
    sender
  );

  // --- Actions typically from Popup or Options page ---
  if (message.action === "loginWithGoogle") {
    console.log("Handling 'loginWithGoogle' action...");
    signInWithGoogle()
      .then((userCredential: UserCredential | null) => {
        console.log(
          "Background: Google Login successful",
          userCredential?.user?.uid
        );
        sendResponse({ status: "success", userId: userCredential?.user?.uid });
      })
      .catch((error: Error) => {
        console.error("Background: Google Login failed", error);
        let errorCode: string | null = null;
        if (error && typeof error === "object" && "code" in error) {
          errorCode = (error as { code: string }).code;
        }
        const errorMessage = error.message;
        if (
          errorCode === "auth/popup-closed-by-user" ||
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
        } else if (error.message && error.message.includes("chrome.identity")) {
          sendResponse({
            status: "error",
            error:
              "Browser identity error. Ensure extension permissions are granted.",
          });
        } else {
          sendResponse({
            status: "error",
            error: errorMessage || "An unknown login error occurred.",
          });
        }
      });
    return true;
  }

  if (message.action === "loginWithEmail") {
    console.log("Handling 'loginWithEmail' action...");
    const { email, password } = message;

    if (!email || !password) {
      console.error("Background: Login missing email or password.");
      sendResponse({
        status: "error",
        error: "Email and password are required for login.",
      });
      return false;
    }

    signInWithEmail(email, password)
      .then((userCredential: UserCredential) => {
        console.log(
          "Background: Email Login successful",
          userCredential.user.uid
        );
        sendResponse({ status: "success", userId: userCredential.user.uid });
      })
      .catch((error: Error) => {
        console.error("Background: Email Login failed", error);
        sendResponse({
          status: "error",
          error: error.message || "Login failed.",
        });
      });
    return true;
  }

  if (message.action === "signupWithEmail") {
    console.log("Handling 'signupWithEmail' action...");
    const { email, password, nickname } = message;
    if (!email || !password) {
      console.error("Background: Signup missing email or password.");
      sendResponse({
        status: "error",
        error: "Email and password are required for signup.",
      });
      return false;
    }
    if (password.length < 6) {
      console.error("Background: Signup password too short.");
      sendResponse({
        status: "error",
        error: "Password must be at least 6 characters long.",
      });
      return false;
    }
    signUpAndVerifyUser(email, password, nickname || null)
      .then((userCredential: UserCredential) => {
        console.log(
          "Background: Email Signup successful",
          userCredential.user.uid
        );
        sendResponse({
          status: "success",
          userId: userCredential.user.uid,
          message: "Account created, verification email sent.",
        });
      })
      .catch((error: Error) => {
        console.error("Background: Email Signup failed", error);
        sendResponse({
          status: "error",
          error: error.message || "Signup failed.",
        });
      });
    return true;
  }

  if (message.action === "logout") {
    console.log("Handling 'logout' action...");
    signOutUser()
      .then(() => {
        console.log("Background: Logout successful");
        sendResponse({ status: "success" });
      })
      .catch((error: Error) => {
        console.error("Background: Logout failed", error);
        sendResponse({ status: "error", error: error.message });
      });
    return true;
  }

  // Task 6.1: Add handler for resendVerificationEmail
  if (message.action === "resendVerificationEmail") {
    console.log("Handling 'resendVerificationEmail' action...");
    resendVerificationEmailHandler()
      .then(() => {
        console.log("Background: Resend verification email successful.");
        sendResponse({
          status: "success",
          message: "Verification email resent.",
        });
      })
      .catch((error: Error) => {
        console.error("Background: Resend verification email failed", error);
        sendResponse({
          status: "error",
          error: error.message || "Failed to resend email.",
        });
      });
    return true; // Indicate async response
  }

  // --- Default handling for unrecognised messages ---
  console.log(
    "Unified Message Listener: Unhandled message type/action:",
    message.type || message.action
  );
  return false;
});

console.log("Unified Message listener added.");

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
