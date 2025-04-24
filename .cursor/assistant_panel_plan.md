# Content Script Side Panel - UI Structure Plan

This plan outlines the structure for the React components rendered within the content script's side panel.

Here's a design mock for the main view: @image.png

## Overall Flow

1.  **Injection & Mounting**: Content script injects root, React mounts `SidePanelContainer.tsx`.
2.  **Auth Check**: `SidePanelContainer.tsx` checks auth status via background script.
3.  **Conditional Rendering**:
    *   **Logged Out**: Renders `LoginView.tsx`.
    *   **Logged In**: Renders `MainView.tsx`.
4.  **Main View Layout**: `MainView.tsx` establishes the core layout:
    *   A **scrollable content area** at the top.
    *   A **fixed chat input section** at the bottom.
5.  **Scrollable Content**: The scrollable area, rendered by `MainView.tsx` (perhaps via a `ScrollableContent.tsx` child), displays components sequentially:
    *   `HeaderSection.tsx` (User info, welcome, search, actions).
    *   `SubNavigationSection.tsx` (Placeholder: AI Assistant, Category, Recent, etc. tabs).
    *   `AboutProductSection.tsx` (Title, tags, overview, highlights, deals).
    *   `ReviewsRatingsSection.tsx` (Placeholder: Aggregate score, breakdown, pros/cons keywords).
    *   `SuitabilitySection.tsx` ("Is it right for you?", keywords, text).
    *   `SimilarProductsSection.tsx` (Title, product cards carousel).
    *   `MessageDisplay.tsx` (Displays the list of chat messages).
6.  **Chat Interaction**:
    *   User views initial content, scrolls down.
    *   The `MessageDisplay.tsx` area appends new messages as the conversation progresses.
    *   User interacts with the fixed `ChatInputSection.tsx` at the bottom (types message, clicks suggested questions, clicks send).
    *   Sending messages involves communication with the background script.

## 1. Directory Structure (`src/content/`)

```
src/
├── content/
│   ├── components/
│   │   ├── SidePanelContainer.tsx  # Top-level, handles auth, renders LoginView or MainView
│   │   ├── LoginView.tsx           # Sign-in prompt view
│   │   ├── MainView.tsx            # Logged-in view, manages scrollable/fixed layout
│   │   │   ├── ScrollableContent.tsx # Wrapper for all scrollable components
│   │   │   └── ChatInputSection.tsx # Fixed section at the bottom with input & suggestions
│   │   ├── HeaderSection/          # Components for the top header bar
│   │   │   ├── HeaderSection.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── SearchBar.tsx       # Placeholder
│   │   │   └── UserActions.tsx
│   │   ├── SubNavigation/          # Placeholder section below header
│   │   │   └── SubNavigationSection.tsx # Placeholder
│   │   ├── ProductInfo/            # Components for product-specific sections
│   │   │   ├── AboutProductSection.tsx
│   │   │   ├── ReviewsRatingsSection.tsx # Placeholder
│   │   │   ├── SuitabilitySection.tsx
│   │   │   └── SimilarProductsSection.tsx
│   │   ├── Chat/                   # Components for conversational chat display and input
│   │   │   ├── MessageDisplay.tsx   # Renders the list of messages
│   │   │   └── Message.tsx          # Individual chat message bubble (user or AI)
│   │   ├── Shared/                 # Reusable components (Avatar, Icon, Button, Card, etc.)
│   │   │   ├── Avatar.tsx
│   │   │   ├── Icon.tsx
│   │   │   └── ...
│   │   └── ... (other content script components)
│   ├── index.ts                  # Content script entry point, injects & mounts React app
│   └── styles/                   # Optional: Global styles or CSS modules entry
├── background/
│   └── ... (auth logic, API call handling)
└── ... (other src directories)
```

## 2. Component Breakdown

*   **`SidePanelContainer.tsx`**:
    *   (As before) Top-level, manages auth state, renders `LoginView` or `MainView`. Potentially holds fetched `userData` and `productContext` to pass down.

*   **`LoginView.tsx`**:
    *   (As before) Simple view for sign-in prompt.

*   **`MainView.tsx`**:
    *   Receives `userData`, `productContext` (if applicable) from `SidePanelContainer`.
    *   **Manages overall layout**: renders `ScrollableContent` and `ChatInputSection`.
    *   **Holds chat state**: Manages the `messages` array state.
    *   **Provides chat actions**: Passes down functions like `handleSendMessage` to `ChatInputSection` and potentially `messages` to `ScrollableContent`.

*   **`ScrollableContent.tsx`**:
    *   Receives `userData`, `productContext`, `messages` as props.
    *   Simple container component that allows its children to scroll vertically.
    *   Renders the sections in order:
        *   `HeaderSection`
        *   `SubNavigationSection` (Placeholder)
        *   `AboutProductSection`
        *   `ReviewsRatingsSection` (Placeholder)
        *   `SuitabilitySection`
        *   `SimilarProductsSection`
        *   `MessageDisplay`

*   **`HeaderSection/HeaderSection.tsx`**:
    *   Receives `userData`.
    *   Renders `Header` (avatar, welcome), `SearchBar` (placeholder), `UserActions` (icons, profile).
    *   Corresponds to the top `h-16` div.

*   **`SubNavigation/SubNavigationSection.tsx`**: (Placeholder)
    *   Renders the row of tab-like buttons ("AI Assistant", "Category insights", etc.).
    *   Corresponds to the `h-9 top-[80px]` div. Functionality TBD.

*   **`ProductInfo/AboutProductSection.tsx`**:
    *   Receives `productContext`.
    *   Renders title ("About this product"), tags, overview text, highlight boxes, deals box, "See more" button.
    *   Corresponds to the `top-[124px]` div.

*   **`ProductInfo/ReviewsRatingsSection.tsx`**: (Placeholder)
    *   Receives `productContext` or review data.
    *   Renders title, aggregate score/stars, breakdown bars, pros/cons keywords and summaries.
    *   Corresponds to the `top-[635px]` div. Structure/data TBD.

*   **`ProductInfo/SuitabilitySection.tsx`**:
    *   Receives `productContext`.
    *   Renders title ("Is it right for you?"), keyword chips, descriptive text with "See more".
    *   Corresponds to the `top-[1068px]` div.

*   **`ProductInfo/SimilarProductsSection.tsx`**:
    *   Receives `productContext` or similar product data.
    *   Renders title ("Similar products"), horizontally scrollable product cards, scroll arrow button.
    *   Corresponds to the `top-[1258px]` div.

*   **`Chat/MessageDisplay.tsx`**:
    *   Receives the `messages` array from `MainView`.
    *   Renders a list of `Message` components.
    *   Handles scrolling to the latest message.
    *   Appears after `SimilarProductsSection` in the scroll flow.

*   **`Chat/Message.tsx`**:
    *   Receives data for a single message (sender, content, timestamp, etc.).
    *   Renders the individual chat bubble with appropriate styling for user vs. AI.

*   **`ChatInputSection.tsx`**:
    *   Receives `handleSendMessage` function prop from `MainView`.
    *   **Fixed position** at the bottom of `MainView`.
    *   Renders suggested question chips.
    *   Contains the text input field (`textarea` likely, for multi-line).
    *   Manages local state for the input field content.
    *   Renders action icons (image upload, mic, etc. - functionality TBD).
    *   Renders the "Send" button, which calls `handleSendMessage` on click.
    *   Corresponds to the `h-44 top-[1586px]` div (though its `top` will be determined by fixed positioning).

*   **Shared Components (`Avatar`, `Icon`, `Button`, `Card`, `Tag`, `ProgressBar`, `StarRating` etc.)**:
    *   Reusable UI primitives based on the design mock.

## 3. Styling

*   **Tailwind CSS**: Primary styling. Use classes directly in JSX.
*   **Tailwind Config**: Define custom colors (`Primary-text-color`, `Input-bg`, `Divider`, etc.), fonts (`SF_Pro_Text`, `Inter`), and potentially spacing/sizing based on the design.
*   **Layout**: `MainView` uses flexbox or grid to position `ScrollableContent` and `ChatInputSection`. `ChatInputSection` uses `position: fixed` (or `sticky`) and `bottom: 0`. `ScrollableContent` takes up the remaining space and uses `overflow-y: auto`.

## 4. State Management

*   **Authentication State (`isLoading`, `isAuthenticated`, `userData`)**: Managed in `SidePanelContainer.tsx`, sourced via message passing from the background script.
*   **Product Context/Data**: Fetched (likely via background script based on URL) and potentially stored in `SidePanelContainer.tsx` or `MainView.tsx`, passed down to relevant sections (`AboutProduct`, `Reviews`, `Suitability`, `SimilarProducts`).
*   **Chat Messages (`messages` array)**: Managed in **`MainView.tsx`**. Updated when messages are sent or received via background script communication.
*   **Chat Input Text**: Local state within **`ChatInputSection.tsx`**.
*   **API Loading/Typing Indicators**:
    *   Auth Loading: State in `SidePanelContainer.tsx`.
    *   Chat Response Loading/Typing: State potentially in `MainView.tsx`, visually indicated near `ChatInputSection` or in `MessageDisplay`.
*   **Search Input**: Local state in `HeaderSection/SearchBar.tsx` (Placeholder).

## 5. Key Implementation Steps

1.  **Setup**: Configure Tailwind with custom theme values from the design. Create the directory structure and files.
2.  **Background Communication**: Establish message passing for auth, product data fetching, and chat API calls.
3.  **`SidePanelContainer`**: Implement auth state logic, conditional rendering. Fetch initial product context based on page URL.
4.  **`LoginView`**: Build sign-in prompt.
5.  **`MainView` Layout**: Implement the core layout with a scrollable top area and a fixed bottom `ChatInputSection`. Implement `messages` state management.
6.  **`HeaderSection`**: Build the top bar (incl. placeholder Search).
7.  **`SubNavigationSection`**: Build placeholder tabs.
8.  **Product Info Sections**: Build `AboutProduct`, `Suitability`, `SimilarProducts` (using placeholder data initially). Build placeholder `ReviewsRatings`.
9.  **`ChatInputSection`**: Build the fixed input area with suggested questions, text input, icons, send button. Implement local state and `handleSendMessage` prop.
10. **`MessageDisplay` & `Message`**: Build the components to render the chat history list from the `messages` state in `MainView`.
11. **`ScrollableContent`**: Assemble all scrollable sections inside this wrapper within `MainView`.
12. **Integration**: Connect background communication for sending/receiving messages, updating `messages` state in `MainView`. Pass data (`userData`, `productContext`, `messages`, `handleSendMessage`) down correctly.
13. **Styling**: Refine Tailwind classes for all components, ensuring visual consistency with the design mock and proper scroll/fixed behavior. Implement shared components (`Avatar`, `Button`, etc.).

## 6. Implementation Task List (Integrating with `src/content/index.tsx` and Existing Auth Components)

This task list outlines the steps to build the side panel UI based on the plan above, starting from the existing `src/content/index.tsx` which mounts the `<App />` component and integrating the existing authentication components (`LoginForm`, `SignupForm`, `VerifyEmailView`).

**Phase 1: Setup & Core Structure (Integrating Auth)**

- [ ] **1. Tailwind Configuration (`globals.css`)**: 
    - [ ] Define custom colors, fonts, and theme extensions based on the design mock (if not already done).
    - [ ] Ensure Tailwind directives are correctly included and linked in the shadow DOM (`src/content/index.tsx`).
- [X] **2. Directory Structure**: Create the *remaining* component directories and empty files for the *authenticated view* (`components/MainView`, `components/HeaderSection`, `components/ProductInfo`, `components/Chat`, `components/Shared`, etc.).
- [X] **3. Refactor/Implement `App.tsx` (as `SidePanelContainer`)**: 
    - [ ] Modify `src/content/App.tsx` to act as the central controller.
    - [ ] **Integrate `useAuth`**: Utilize the existing `useAuth` hook.
    - [ ] **Manage View State**: Implement state (`useState`) to track the current view (`'login'`, `'signup'`, `'verify'`, `'main'`).
    - [ ] **Conditional Rendering Logic**: Implement logic to render correct view (`LoginView`, `SignupForm`, `VerifyEmailView`, `MainView`) based on auth state and view state.
    - [ ] **Error Handling**: Display auth errors from `useAuth`.
    - [ ] **Remove Standalone Auth**: Ensure `App.tsx` doesn't render auth forms directly.
- [ ] **4. (Review Auth Components)**: Review `LoginForm`, `SignupForm`, `VerifyEmailView` props and logic for alignment with `App.tsx` state.

**Phase 2: Build Authenticated View (`MainView` and Children)**

- [ ] **5. Implement `MainView.tsx`**: 
    - [ ] Receive `userData` prop.
    - [ ] Set up scrollable/fixed layout.
    - [ ] Implement `messages` state (`useState([])`).
    - [ ] Implement placeholder `handleSendMessage` function.
    - [ ] Render `<ScrollableContent />` and `<ChatInputSection />`, passing props.
- [ ] **6. Implement `ScrollableContent.tsx`**: 
    - [ ] Receive props.
    - [ ] Render basic, placeholder versions of child sections (`HeaderSection`, `SubNavigationSection`, etc.).
    - [ ] Apply scroll styling.
- [ ] **7. Implement `ChatInputSection.tsx`**: 
    - [ ] Receive `handleSendMessage` prop.
    - [ ] Apply fixed positioning styles.
    - [ ] Implement structure (suggested questions, `textarea`, icons, "Send" button).
    - [ ] Add local state for `textarea` value and connect to `handleSendMessage`.
- [ ] **8. Build `HeaderSection` Components**: 
    - [ ] Implement `HeaderSection.tsx`, `Header.tsx`, `SearchBar.tsx` (placeholder), `UserActions.tsx` using `userData`.
- [ ] **9. Build Placeholder Sections**: 
    - [ ] Implement `SubNavigationSection.tsx` (Placeholder).
    - [ ] Implement `ReviewsRatingsSection.tsx` (Placeholder).
- [ ] **10. Build Product Info Sections**: 
    - [ ] Implement `AboutProductSection.tsx`, `SuitabilitySection.tsx`, `SimilarProductsSection.tsx` using static content.
- [x] **11. Build Chat Display**: 
    - [ ] Implement `MessageDisplay.tsx` to map `messages` prop to `<Message />` components.
    - [ ] Implement `Message.tsx` for individual message bubbles.
- [x] **12. Develop Shared Components**: 
    - [ ] Create reusable components (`Avatar`, `Button`, `Tag`, etc.) in `components/Shared/` as needed.

**Phase 3: Integration & Functionality**

- [ ] **13. Background Communication**: 
    - [ ] Establish/verify message passing for:
        - [ ] Fetching product context data.
        - [ ] Sending chat messages.
        - [ ] Receiving chat responses.
- [ ] **14. Data Integration**: 
    - [ ] Update `App.tsx` or `MainView.tsx` to fetch product context and pass it down.
    - [ ] Connect Product Info sections to use this context data.
- [ ] **15. Chat Functionality**: 
    - [ ] Implement the actual logic in `handleSendMessage` in `MainView.tsx`.
    - [ ] Implement loading/typing indicators.
- [ ] **16. Refine Placeholders**: 
    - [ ] Implement Search.
    - [ ] Implement Reviews/Ratings.
    - [ ] Implement Sub-Navigation.
- [ ] **17. Styling & Polish**: 
    - [ ] Review against mock.
    - [ ] Refine Tailwind.
    - [ ] Test interactions & scrolling.
    - [ ] Add accessibility attributes.
