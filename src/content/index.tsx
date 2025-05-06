import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../styles/globals.css";

console.log("Content script loaded. React version.");

const HOST_ELEMENT_ID = "shopping-agent-react-host";

// --- Product Extraction Logic --- 

/**
 * Defines the structure of the product information payload sent to background.
 */
interface ProductInfoPayload {
  name: string;
  url: string;
}

/**
 * Extracts product title (og:title or document title) and URL.
 * Sends info to the background script.
 * @returns An object containing the extracted title (string | null) and url (string).
 */
function extractPageInfo(): { title: string | null; url: string } {
  const pageUrl: string = window.location.href;
  let productTitle: string | null =
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
      ?.content ||
    document.title ||
    null;

  if (productTitle) {
    productTitle = productTitle.trim();
  } else {
    console.warn(
      "Shopping Agent (content): Could not extract product title from og:title or document.title"
    );
    productTitle = null;
  }

  // Send Message to Background Script regardless of mount status
  if (productTitle) {
    console.log(
      `Shopping Agent (content): Extracted - Title: ${productTitle}, URL: ${pageUrl}`
    );
    const payload: ProductInfoPayload = { name: productTitle, url: pageUrl };
    chrome.runtime.sendMessage(
      { type: "PRODUCT_INFO_CAPTURED", payload: payload },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Shopping Agent (content): Error sending PRODUCT_INFO_CAPTURED:",
            chrome.runtime.lastError.message
          );
        } 
        // else {
        //   console.log("Shopping Agent (content): Background acknowledged PRODUCT_INFO_CAPTURED", response);
        // }
      }
    );
  } else {
    console.log("Shopping Agent (content): No product title found on this page.");
    // Optionally send a message indicating no title found if needed elsewhere
  }
  
  // Return both title and url
  return { title: productTitle, url: pageUrl };
}

// --- React App Mounting Logic --- 

/**
 * Creates the host element, attaches shadow DOM, and mounts the React app.
 * @param pageInfo An object containing the title and url extracted from the page.
 */
function mountReactApp(pageInfo: { title: string | null; url: string }) {
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

  // 5. Inject CSS link into Shadow DOM
  const cssUrl = chrome.runtime.getURL('content.css');
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = cssUrl;
  shadowRoot.appendChild(styleLink);
  console.log(`Linked CSS: ${cssUrl}`);

  // 6. Mount the React App
  const root = createRoot(reactRootElement); // Use createRoot from react-dom/client
  root.render(
    <React.StrictMode>
      <App title={pageInfo.title} url={pageInfo.url} />
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
// Extract info first
const pageInfo = extractPageInfo(); 

// Then mount the app, passing the extracted info object
console.log("Attempting to mount React app based on manifest matches...");
mountReactApp(pageInfo); // Pass the info object to the mount function
