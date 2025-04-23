import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { isSupportedPage } from "./services/pageMatcher"; // Import the page check function

console.log("Content script loaded. React version.");

const HOST_ELEMENT_ID = "shopping-agent-react-host";

/**
 * Creates the host element, attaches shadow DOM, and mounts the React app.
 */
function mountReactApp() {
  // 1. Check if already mounted
  if (document.getElementById(HOST_ELEMENT_ID)) {
    console.log("React host element already exists.");
    return;
  }

  // 2. Create the host element on the main page
  const hostElement = document.createElement("div");
  hostElement.id = HOST_ELEMENT_ID;
  document.body.appendChild(hostElement);
  console.log("React host element created.");

  // 3. Attach Shadow DOM
  const shadowRoot = hostElement.attachShadow({ mode: "open" });
  console.log("Shadow DOM attached.");

  // 4. Create the root element *inside* the Shadow DOM for React
  const reactRootElement = document.createElement("div");
  reactRootElement.id = "react-root"; // Optional ID for the inner root
  shadowRoot.appendChild(reactRootElement);
  console.log("React root element created inside Shadow DOM.");

  // 5. Mount the React App
  const root = createRoot(reactRootElement); // Use createRoot from react-dom/client
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React app mounted into Shadow DOM.");

  // Optional: Inject global styles into Shadow DOM if needed
  // const styleElement = document.createElement('style');
  // styleElement.textContent = `
  //   #react-root { /* styles for the container */ }
  //   /* Other global styles for the shadow boundary */
  // `;
  // shadowRoot.appendChild(styleElement);
}

// --- Main Execution Logic ---
if (isSupportedPage()) { // Use the imported function
  console.log("Supported page detected. Mounting React app...");
  mountReactApp();
} else {
  console.log("Not a supported page. React app not mounted.");
}
