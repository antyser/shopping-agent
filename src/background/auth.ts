import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  type UserCredential,
  type AuthError,
} from "firebase/auth";
import { auth } from "./firebase"; // Import the initialized auth service

// Replace with your actual Google OAuth 2.0 Web Client ID
const GOOGLE_CLIENT_ID =
  "921094659766-j3da72n106mcgcjkvjf9k2nvuo61qrkp.apps.googleusercontent.com";

/**
 * Initiates the Google Sign-In flow using chrome.identity.launchWebAuthFlow
 * and then signs into Firebase using the obtained ID token.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential upon successful sign-in.
 * @throws {Error | AuthError} Throws an error if the auth flow or Firebase sign-in fails.
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return new Promise((resolve, reject) => {
    const redirectUri = chrome.identity.getRedirectURL(); // Gets chrome-extension://<id>/
    const scopes = ["openid", "email", "profile"];
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    authUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "id_token"); // Request ID token directly
    authUrl.searchParams.append("scope", scopes.join(" "));
    authUrl.searchParams.append(
      "nonce",
      Math.random().toString(36).substring(2)
    ); // Simple nonce

    console.log("Launching Google Auth Flow with URL:", authUrl.toString());
    console.log("Expected Redirect URI:", redirectUri);

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl.toString(),
        interactive: true, // Prompt user for interaction
      },
      async (responseUrl?: string) => {
        if (chrome.runtime.lastError || !responseUrl) {
          const errorMsg =
            chrome.runtime.lastError?.message || "No response URL received.";
          console.error("launchWebAuthFlow Error:", errorMsg);
          return reject(new Error(`Google Auth Flow failed: ${errorMsg}`));
        }

        console.log("Auth flow successful, response URL:", responseUrl);

        try {
          // Extract the ID token from the response URL fragment
          const urlFragment = new URL(responseUrl).hash.substring(1);
          const params = new URLSearchParams(urlFragment);
          const idToken = params.get("id_token");

          if (!idToken) {
            console.error("ID token not found in response URL fragment.");
            return reject(new Error("ID token not found in response URL."));
          }

          console.log("ID Token obtained, creating Firebase credential...");
          const credential = GoogleAuthProvider.credential(idToken);

          console.log("Signing into Firebase with credential...");
          const userCredential = await signInWithCredential(auth, credential);

          console.log("Firebase Sign-In successful:", userCredential.user);
          resolve(userCredential);
        } catch (error) {
          console.error("Firebase sign-in error:", error);
          reject(error); // Reject with the Firebase or parsing error
        }
      }
    );
  });
};

/**
 * Signs the current user out using Firebase Auth.
 * @returns {Promise<void>} A promise that resolves when sign-out is complete.
 * @throws {AuthError} Throws an error if sign-out fails.
 */
export const signOutUser = async (): Promise<void> => {
  try {
    console.log("Attempting Sign-Out...");
    await signOut(auth);
    console.log("Sign-Out successful.");
  } catch (error) {
    const authError = error as AuthError;
    console.error("Sign-Out Error:", authError);
    throw authError; // Re-throw the error
  }
};
