import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './state/AuthProvider';

// Import actual components
import FloatingActionButton from './components/FloatingActionButton/FloatingActionButton';
import SidePanel from './components/SidePanel/SidePanel';
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import InsightsView from './components/InsightsView/InsightsView';
import VerifyEmailView from './components/VerifyEmailView/VerifyEmailView';

// Define possible view states within the panel (when not logged in or verifying)
type AuthView = 'login' | 'signup';

// Main App content component
function AppContent() {
    // Get full auth state including verification status
    const { isLoggedIn, emailVerified } = useAuth();
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    // State to manage which auth view (login/signup) is shown when logged out
    const [currentAuthView, setCurrentAuthView] = React.useState<AuthView>('login');

    console.log("Rendering AppContent, isLoggedIn:", isLoggedIn, "emailVerified:", emailVerified, "currentAuthView:", currentAuthView);

    // Effect to potentially reset auth view if user logs out while panel is open showing login/signup
    React.useEffect(() => {
        if (isLoggedIn === false) {
            setCurrentAuthView('login'); // Default to login when logged out
        }
        // We don't reset based on isLoggedIn true/null here, as the main render logic handles those cases
    }, [isLoggedIn]);

    const togglePanel = () => setIsPanelOpen(!isPanelOpen);
    const closePanel = () => setIsPanelOpen(false);

    // Effect to listen for messages from the background script
    useEffect(() => {
        const messageListener = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
            console.log("Content script received message:", message);
            if (message.action === "togglePanel") {
                console.log("Toggle panel action received");
                togglePanel();
                sendResponse({ status: "panel toggled" }); // Optional: acknowledge
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        // Cleanup function to remove the listener when the component unmounts
        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
            console.log("Content script message listener removed.");
        };
    }, [togglePanel]); // Add togglePanel to dependency array if it changes (it shouldn't with useCallback/stable ref)

    // Navigation functions for Login/Signup forms
    const navigateToSignup = () => setCurrentAuthView('signup');
    const navigateToLogin = () => setCurrentAuthView('login');

    // Function to render the correct component based on the overall auth state
    const renderPanelContent = () => {
        // 1. Loading state
        if (isLoggedIn === null) {
             // TODO: Use a proper loading spinner component
            return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Authentication...</div>;
        }

        // 2. Logged In state
        if (isLoggedIn === true) {
            // Check verification status
            if (emailVerified === true) {
                return <InsightsView />;
            } else {
                // User is logged in but email is not verified (or status unknown yet)
                return <VerifyEmailView />;
            }
        }

        // 3. Logged Out state (isLoggedIn === false)
        // Render Login or Signup form based on currentAuthView
        switch (currentAuthView) {
            case 'login':
                return <LoginForm onNavigateToSignup={navigateToSignup} />;
            case 'signup':
                // After signup success, SignupForm shows a message.
                // If the user clicks "Go to Login", this navigates back here.
                return <SignupForm onNavigateToLogin={navigateToLogin} />;
            default:
                 // Should not happen with current logic
                 console.error("Invalid currentAuthView state:", currentAuthView);
                 return <LoginForm onNavigateToSignup={navigateToSignup} />; // Fallback to login
        }
    };

    return (
        <>
            <FloatingActionButton onClick={togglePanel} />
            <SidePanel isOpen={isPanelOpen} onClose={closePanel}>
                {renderPanelContent()}
            </SidePanel>
        </>
    );
}

// Main App component wrapping content with the provider
function App() {
    console.log("Rendering main App component with AuthProvider...");
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App; 