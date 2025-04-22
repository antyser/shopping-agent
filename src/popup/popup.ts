/**
 * Updates the popup UI based on the user's login status.
 */
const updateUI = (isLoggedIn: boolean) => {
  const userStatusElement = document.getElementById("user-status");
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");

  if (!userStatusElement || !loginButton || !logoutButton) {
    console.error("Popup UI elements not found!");
    return;
  }

  if (isLoggedIn) {
    userStatusElement.innerHTML = "<p>Status: Logged In</p>"; // Simple status for now
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
  } else {
    userStatusElement.innerHTML = "<p>Status: Logged Out</p>";
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
  }
};

/**
 * Fetches the initial login state from storage and updates the UI.
 */
const initializePopup = () => {
  chrome.storage.local.get(["isLoggedIn", "userId"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error getting auth state:", chrome.runtime.lastError);
      updateUI(false); // Assume logged out on error
    } else {
      console.log("Initial auth state from storage:", result);
      updateUI(!!result.isLoggedIn);
    }
  });
};

// --- Event Listeners --- //

document.addEventListener("DOMContentLoaded", () => {
  initializePopup();

  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");

  loginButton?.addEventListener("click", () => {
    console.log("Login button clicked, sending message to background...");
    chrome.runtime.sendMessage({ action: "login" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Login message failed:", chrome.runtime.lastError);
        // Handle error - maybe display a message to the user
        alert("Login failed: " + chrome.runtime.lastError.message);
        return;
      }
      if (response?.status === "success") {
        console.log("Login successful (initiated by background)");
        // The UI should update automatically via the onAuthStateChanged listener
        // in the background script updating storage, and the next time the popup
        // opens, initializePopup will read the new state.
        // We could force an update here, but let's rely on the storage change for now.
        updateUI(true); // Optimistically update UI
      } else {
        console.error("Login failed:", response?.error);
        alert("Login failed: " + (response?.error || "Unknown error"));
      }
    });
  });

  logoutButton?.addEventListener("click", () => {
    console.log("Logout button clicked, sending message to background...");
    chrome.runtime.sendMessage({ action: "logout" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Logout message failed:", chrome.runtime.lastError);
        alert("Logout failed: " + chrome.runtime.lastError.message);
        return;
      }
      if (response?.status === "success") {
        console.log("Logout successful (initiated by background)");
        // Similar to login, the UI update relies on storage changes triggered by background
        updateUI(false); // Optimistically update UI
      } else {
        console.error("Logout failed:", response?.error);
        alert("Logout failed: " + (response?.error || "Unknown error"));
      }
    });
  });

  // Optional: Listen for storage changes to update UI if popup stays open
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.isLoggedIn) {
      console.log("Auth state changed in storage, updating UI...");
      updateUI(changes.isLoggedIn.newValue);
    }
  });
});
