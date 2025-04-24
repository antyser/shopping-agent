import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  PropsWithChildren,
} from "react";
import * as chromeApi from "../services/chromeApi"; // Import the chrome API service

// Define the shape of the authentication state
interface AuthState {
  isLoggedIn: boolean | null; // null indicates loading/unknown initially
  userId: string | null;
  displayName: string | null; // Added displayName
  photoURL: string | null;    // Added photoURL
  emailVerified: boolean | null; // Added emailVerified status
  email: string | null; // Task 3.2: Add email
}

// Define the shape of the context value
interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, nickname: string | null) => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>; // Task 6.1: Add resend function type
  error: string | null; // Add error state
}

// Define common response type for background messages
interface AuthActionResponse {
    status: 'success' | 'error' | 'pending' | 'cancelled';
    error?: string;
    userId?: string;
    message?: string;
}

// Create the context with a default value (or undefined)
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Define the provider component
export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: null, // Start as loading
    userId: null,
    displayName: null, // Initialize displayName
    photoURL: null,    // Initialize photoURL
    emailVerified: null, // Initialize emailVerified
    email: null, // Task 3.2: Initialize email
  });
  const [error, setError] = useState<string | null>(null); // Add error state management

  // Effect to load initial state and set up listener
  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    // Function to load state from storage
    const loadInitialState = async () => {
      console.log("AuthProvider: Loading initial auth state including email...");
      setError(null); // Clear error on load
      try {
        // Task 3.2: Load email from storage
        const result = await chromeApi.getStorageLocal([
            "isLoggedIn",
            "userId",
            "displayName",
            "photoURL",
            "emailVerified",
            "email"
        ]);
        if (isMounted) {
            console.log("AuthProvider: Initial state loaded:", result);
            setAuthState({
                isLoggedIn: result.isLoggedIn === true,
                userId: result.userId as string | null,
                displayName: result.displayName as string | null,
                photoURL: result.photoURL as string | null,
                emailVerified: typeof result.emailVerified === 'boolean' ? result.emailVerified : null,
                email: result.email as string | null // Task 3.2: Set email from storage
            });
        }
      } catch (error) {
        console.error("AuthProvider: Error loading initial state:", error);
        if (isMounted) {
            // Reset all fields on error
            setError("Failed to load initial authentication state."); // Set error on load failure
            setAuthState({ isLoggedIn: false, userId: null, displayName: null, photoURL: null, emailVerified: null, email: null });
        }
      }
    };

    loadInitialState();

    // Listener for storage changes from background script
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      // Task 3.2: Listen for email changes
      if (areaName === "local" && (changes.isLoggedIn || changes.userId || changes.displayName || changes.photoURL || changes.emailVerified || changes.email)) {
        console.log("AuthProvider: Detected storage change:", changes);
        const newIsLoggedIn = changes.isLoggedIn?.newValue;
        const newUserId = changes.userId?.newValue;
        const newDisplayName = changes.displayName?.newValue;
        const newPhotoURL = changes.photoURL?.newValue;
        const newEmailVerified = changes.emailVerified?.newValue;
        const newEmail = changes.email?.newValue; // Task 3.2: Get email change

        // Update state based on changed values
        setAuthState(prevState => ({
            // Keep existing values and update changed ones
            ...prevState,
            ...(newIsLoggedIn !== undefined && { isLoggedIn: newIsLoggedIn === true }),
            ...(newUserId !== undefined && { userId: newUserId }),
            ...(newDisplayName !== undefined && { displayName: newDisplayName }),
            ...(newPhotoURL !== undefined && { photoURL: newPhotoURL }),
            ...(newEmailVerified !== undefined && { emailVerified: typeof newEmailVerified === 'boolean' ? newEmailVerified : null }),
            ...(newEmail !== undefined && { email: newEmail as string | null }) // Task 3.2: Update email state
        }));
      }
    };

    chromeApi.addStorageListener(handleStorageChange);
    console.log("AuthProvider: Storage listener added (all fields).");

    // Cleanup function
    return () => {
      isMounted = false;
      chromeApi.removeStorageListener(handleStorageChange);
      console.log("AuthProvider: Cleaned up storage listener.");
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Action Functions --- //
  const signInWithGoogle = useCallback(async () => {
    console.log("AuthProvider: Requesting Google login...");
    setError(null); // Clear previous errors
    try {
      // Use AuthActionResponse type for consistency
      const response = await chromeApi.sendMessage({ action: "loginWithGoogle" }) as AuthActionResponse;
      console.log("AuthProvider: Google login message sent. Response:", response);
      if (response?.status !== 'success' && response?.status !== 'cancelled') { // Allow cancellation
           throw new Error(response?.error || "Google login failed.");
      }
      // Let onAuthStateChanged handle success state updates
    } catch (error) {
      console.error("AuthProvider: Error during Google login flow:", error);
      // Re-throw error for component handling
      const errorMessage = error instanceof Error ? error.message : String(error) || "An unknown Google login error occurred.";
      setError(errorMessage); // Set error state
      throw new Error(errorMessage); // Re-throw after setting state
    }
  }, []);

  // Task 3.1: Implement Email/Password Login Function
  const loginWithEmail = useCallback(async (email: string, pass: string) => {
    console.log("AuthProvider: Requesting Email login...");
    setError(null); // Clear previous errors
    try {
      const response = await chromeApi.sendMessage({
          action: "loginWithEmail",
          email,
          password: pass
      }) as AuthActionResponse; // Use common response type

      console.log("AuthProvider: Email login message sent. Response:", response);

      if (response?.status !== 'success') {
          throw new Error(response?.error || "Email/Password login failed.");
      }
      // Success: onAuthStateChanged will handle state update
    } catch (error) {
      console.error("AuthProvider: Error during Email login:", error);
      // Re-throw error for component handling
      const errorMessage = error instanceof Error ? error.message : String(error) || "An unknown email login error occurred.";
      setError(errorMessage); // Set error state
      throw new Error(errorMessage); // Re-throw after setting state
    }
  }, []);

  // Define an expected response shape for signup message
  interface SignupResponse {
    status: 'success' | 'error' | 'pending' | 'cancelled'; // Extend with possible statuses
    error?: string; // Optional error message
    userId?: string; // Optional user ID on success
  }

  // Added signup function
  const signupWithEmail = useCallback(async (email: string, pass: string, nickname: string | null) => {
      console.log("AuthProvider: Requesting Email signup...");
      setError(null); // Clear previous errors
      try {
          const response = await chromeApi.sendMessage({
              action: "signupWithEmail",
              email,
              password: pass,
              nickname
          }) as AuthActionResponse; // Use common response type

          console.log("AuthProvider: Signup message sent. Response:", response);

          if (response?.status !== 'success') {
              throw new Error(response?.error || "Signup failed in background script.");
          }
          // Signup successful - onAuthStateChanged listener will handle state update
      } catch (error) {
          console.error("AuthProvider: Error sending signup message or processing response:", error);
          const errorMessage = error instanceof Error ? error.message : String(error) || "An unknown signup error occurred.";
          setError(errorMessage); // Set error state
          throw new Error(errorMessage); // Re-throw after setting state
      }
  }, []);

  const logout = useCallback(async () => {
    console.log("AuthProvider: Requesting logout...");
    setError(null); // Clear errors on logout attempt
    try {
      const response = await chromeApi.sendMessage({ action: "logout" }) as AuthActionResponse;
      console.log("AuthProvider: Logout message sent. Response:", response);
      if (response?.status !== 'success') {
            console.warn("AuthProvider: Logout message failed in background?", response?.error);
            // Don't necessarily throw error, as onAuthStateChanged should clear state anyway
      }
      // State update will happen via storage listener from onAuthStateChanged
    } catch (error) {
        console.error("AuthProvider: Error sending logout message:", error);
        // Set error state, but don't necessarily throw
        setError(error instanceof Error ? error.message : String(error) || "Failed to send logout request.");
    }
  }, []);

  // Task 6.1: Add resendVerificationEmail function
  const resendVerificationEmail = useCallback(async () => {
    console.log("AuthProvider: Requesting resend verification email...");
    setError(null); // Clear previous errors
    try {
      const response = await chromeApi.sendMessage({
        action: "resendVerificationEmail"
      }) as AuthActionResponse;

      console.log("AuthProvider: Resend email message sent. Response:", response);

      if (response?.status !== 'success') {
        throw new Error(response?.error || "Failed to resend verification email.");
      }
      // Success message can be handled in the component calling this
    } catch (error) {
      console.error("AuthProvider: Error sending resend email message:", error);
      const errorMessage = error instanceof Error ? error.message : String(error) || "An unknown error occurred while resending email.";
      setError(errorMessage); // Set error state
      throw new Error(errorMessage); // Re-throw after setting state
    }
  }, []);

  // Value provided to consuming components
  const value: AuthContextValue = {
    ...authState, // Spread all state fields including email
    signInWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    resendVerificationEmail, // Task 6.1: Provide function
    error, // Provide error state
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 