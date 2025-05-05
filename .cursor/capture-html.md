# Plan: Auto-Extract Product Name and URL (TypeScript)

Goal: Automatically capture the product name (from the `<title>` or `og:title` meta tag) and the current page URL from the active tab's content and make it available to the `ProductInsightSection` component, removing the manual input field. Using TypeScript.

**Files to Modify:**

1.  `src/content/index.ts` (or create `src/content/productExtractor.ts` and update manifest)
2.  `src/background/index.ts`
3.  Script rendering `ProductInsightSection` (e.g., `src/sidepanel/index.tsx` or similar)
4.  `src/content/components/ProductInfo/ProductInsightSection.tsx`
5.  `src/manifest.json`

**Steps:**

1.  **Content Script (`src/content/index.ts`): Extract Info & Send**
    *   **Add Logic:**
        *   Get page URL: `const pageUrl: string = window.location.href;`
        *   Get product name: Try `og:title` first, then fallback to `document.title`.
          ```typescript
          let productName: string | null = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content || document.title || null;
          if (productName) {
            productName = productName.trim(); // Clean up whitespace
          } else {
             console.warn("Could not extract product name from og:title or document.title");
             productName = null; // Ensure it's null if not found
          }
          ```
    *   **Send Message:** When the content script loads, send the extracted data to the background script.
        ```typescript
        interface ProductInfoPayload {
          name: string;
          url: string;
        }

        if (productName && pageUrl) {
          const payload: ProductInfoPayload = { name: productName, url: pageUrl };
          chrome.runtime.sendMessage({
            type: 'PRODUCT_INFO_CAPTURED',
            payload: payload
          }, (response) => {
             if (chrome.runtime.lastError) {
               console.error("Error sending PRODUCT_INFO_CAPTURED:", chrome.runtime.lastError.message);
             } else {
               console.log("PRODUCT_INFO_CAPTURED acknowledged:", response);
             }
          });
        }
        ```
    *   **Manifest:** Ensure this script runs on appropriate pages (e.g., `"matches": ["<all_urls>"]`) and uses `index.ts`.

2.  **Background Script (`src/background/index.ts`): Listen & Store**
    *   **Define Types:** Define types for messages and storage.
      ```typescript
      interface ProductInfo {
          name: string;
          url: string;
      }

      interface MessagePayload {
          type: string;
          payload?: any; // Use specific types if possible
          tabId?: number;
          // Add other potential message properties
      }
      ```
    *   **Add Listener:** Listen for messages, using defined types.
        ```typescript
        chrome.runtime.onMessage.addListener((message: MessagePayload, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean | undefined => {
          if (message.type === 'PRODUCT_INFO_CAPTURED' && sender.tab?.id) {
            const tabId: number = sender.tab.id;
            const productInfo = message.payload as ProductInfo; // Assuming payload is ProductInfo
            const key = `productInfo_${tabId}`;

            chrome.storage.local.set({ [key]: productInfo }, () => {
              if (chrome.runtime.lastError) {
                console.error(`Error storing product info for tab ${tabId}:`, chrome.runtime.lastError.message);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
              } else {
                console.log(`Stored product info for tab ${tabId}:`, productInfo);
                sendResponse({ success: true });

                // --- Send message back to content script ---
                console.log(`Sending RENDER_INSIGHTS_UI to tab ${tabId}`);
                 chrome.tabs.sendMessage(tabId, { type: 'RENDER_INSIGHTS_UI', payload: productInfo }, (response) => {
                   if (chrome.runtime.lastError) {
                     console.warn(`Could not send RENDER_INSIGHTS_UI message to tab ${tabId}: ${chrome.runtime.lastError.message}.`);
                   } else {
                     console.log(`Tab ${tabId} acknowledged RENDER_INSIGHTS_UI:`, response);
                   }
                 });
                 // -----------------------------------------
              }
            });
            return true; // Indicates async response
          }

          // Handle other message types...

           return false; // Indicate sync response or message not handled by this branch
        });
        ```
    *   **Manifest:** Ensure `"permissions": ["storage", "tabs"]` are present and background points to `index.ts`.

3.  **Side Panel/UI Script (e.g., `src/sidepanel/index.tsx`): Render Component**
    *   **Structure:** Assuming a React setup for the side panel.
        ```typescript
        import React, { useState, useEffect } from 'react';
        import ReactDOM from 'react-dom/client';
        import ProductInsightSection from '../../content/components/ProductInfo/ProductInsightSection'; // Adjust path

        interface ProductInfo {
          name: string | null;
          url: string | null;
        }

        function SidePanelApp() {
          const [productInfo, setProductInfo] = useState<ProductInfo>({ name: null, url: null });
          const [error, setError] = useState<string | null>(null);

          useEffect(() => {
            // Listener for messages from the background script providing the info
            const messageListener = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
               if (message.type === 'RENDER_INSIGHTS_UI' && message.payload) {
                 console.log("SidePanel received RENDER_INSIGHTS_UI:", message.payload);
                 setProductInfo({
                    name: message.payload.name || null,
                    url: message.payload.url || null
                 });
                 setError(null); // Clear previous errors
                 sendResponse({ success: true });
                 return true;
               }
               // Potentially listen for other messages like 'CLEAR_UI'
               return false;
            };

            chrome.runtime.onMessage.addListener(messageListener);

             // --- Request initial info when panel opens (Optional but good practice) ---
             // This uses the GET_PRODUCT_INFO mechanism as a fallback/initial load
             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
               if (tabs.length > 0 && tabs[0].id) {
                 const currentTabId = tabs[0].id;
                 console.log(`SidePanel asking for initial info for tab ${currentTabId}`);
                 chrome.runtime.sendMessage({ type: 'GET_PRODUCT_INFO', tabId: currentTabId }, (response) => {
                   if (chrome.runtime.lastError) {
                     console.error("Error getting initial product info:", chrome.runtime.lastError.message);
                     setError("Could not retrieve product info initially.");
                   } else if (response && response.data) {
                     console.log("SidePanel received initial product info:", response.data);
                     setProductInfo({ name: response.data.name, url: response.data.url });
                     setError(null);
                   } else {
                     console.log("No initial product info found for this tab via GET_PRODUCT_INFO.");
                     // Optional: Keep state as null, wait for push message
                     // setError("No product info captured for this page yet.");
                   }
                 });
               }
             });
             // -----------------------------------------------------------------------

            return () => {
              chrome.runtime.onMessage.removeListener(messageListener);
            };
          }, []);

          return (
            <React.StrictMode>
              {/* Render based on state */}
              {error && <p className="error-message">{error}</p>}
              <ProductInsightSection detectedProductName={productInfo.name} />
              {/* You might want to display the URL or use it elsewhere */}
              {/* {productInfo.url && <p>URL: {productInfo.url}</p>} */}
            </React.StrictMode>
          );
        }

        const container = document.getElementById('root'); // Or your side panel root ID
        if (container) {
          const root = ReactDOM.createRoot(container);
          root.render(<SidePanelApp />);
        } else {
          console.error("Could not find root container for side panel app.");
        }

        ```
    *   **Manifest:** Ensure `side_panel` configuration points to the correct HTML file which loads this script.

4.  **`ProductInsightSection.tsx`:** Adapt Component (Mostly unchanged from previous JS plan, just verify types)
    *   **Accept Prop:** Ensure `detectedProductName` prop is correctly typed.
        ```typescript
        interface ProductInsightSectionProps {
          detectedProductName: string | null;
          // detectedProductUrl?: string | null; // Optional
        }

        function ProductInsightSection({ detectedProductName }: ProductInsightSectionProps): JSX.Element {
           // ... useStream hook ...
           // ... useEffect hook ...
           // ... return JSX ...
        }
        ```
    *   **Trigger Fetch:** The `useEffect` logic remains the same.

5.  **`manifest.json` Review:**
    *   Double-check `"permissions": ["storage", "tabs", "sidePanel"]`.
    *   Verify content script registration (`"content_scripts"`) uses `index.ts`.
    *   Verify background script registration (`"background"`) uses `index.ts`.
    *   Ensure `"side_panel"` configuration is correct (if using Side Panel API).
