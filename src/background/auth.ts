import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  type UserCredential,
  type AuthError,
  type User,
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
          // Handle specific cancellation errors if needed
          if (
            errorMsg.includes("cancelled") ||
            errorMsg.includes("closed by the user")
          ) {
            return reject(new Error("Google Sign-In cancelled."));
          }
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
          // Task 1.1: Enhance Google Sign-In Error Handling
          const authError = error as AuthError;
          console.error(
            "Firebase sign-in error:",
            authError.code,
            authError.message
          );
          if (
            authError.code === "auth/account-exists-with-different-credential"
          ) {
            // Provide more specific guidance
            reject(
              new Error(
                "Email associated with this Google account already exists, possibly with email/password. Try logging in with email/password."
              )
            );
          } else {
            reject(
              new Error(
                `Firebase sign-in failed: ${
                  authError.message || "Unknown error"
                }`
              )
            );
          }
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

// Task 1.2: Implement Email/Password Sign-In Function
/**
 * Signs in a user with email and password.
 * @param email User's email.
 * @param password User's password.
 * @returns Promise resolving with UserCredential on success.
 * @throws Throws an error with a user-friendly message on failure.
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    console.log(`Attempting email/password sign-in for ${email}...`);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(
      `Email/password sign-in successful for ${userCredential.user.uid}`
    );
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    console.error("Email Sign-In Error:", authError.code, authError.message);
    // Map specific error codes to user-friendly messages
    switch (authError.code) {
      case "auth/user-not-found":
      case "auth/invalid-email": // Treat invalid email similar to not found
        throw new Error("Email address not found or is invalid.");
      case "auth/wrong-password":
      case "auth/invalid-credential": // Generic credential error (covers wrong password, etc.)
        throw new Error("Incorrect password. Please try again.");
      case "auth/too-many-requests":
        throw new Error(
          "Access temporarily disabled due to too many failed login attempts. Please try again later."
        );
      default:
        throw new Error(
          authError.message || "An unexpected error occurred during sign-in."
        );
    }
  }
};

/**
 * Creates a new user with email and password, optionally sets nickname,
 * and sends a verification email.
 * @param {string} email User's email address.
 * @param {string} password User's chosen password.
 * @param {string | null} nickname Optional nickname for the user profile.
 * @returns {Promise<UserCredential>} A promise resolving with the user credential.
 * @throws {Error} Throws specific user-friendly errors.
 */
export const signUpAndVerifyUser = async (
  email: string,
  password: string,
  nickname: string | null
): Promise<UserCredential> => {
  try {
    console.log(`Attempting signup for ${email}...`);
    // 1. Create user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(`User created successfully: ${user.uid}`);

    // 2. Update profile with nickname (if provided)
    if (nickname) {
      try {
        console.log(
          `Updating profile for ${user.uid} with nickname: ${nickname}`
        );
        await updateProfile(user, { displayName: nickname });
        console.log(`Profile updated successfully for ${user.uid}.`);
      } catch (profileError) {
        console.error(
          `Failed to update profile for ${user.uid}:`,
          profileError
        );
        // Log the error but don't necessarily fail the whole signup
      }
    }

    // 3. Send verification email
    try {
      console.log(`Sending verification email to ${user.email}...`);
      await sendEmailVerification(user);
      console.log(`Verification email sent successfully to ${user.email}.`);
    } catch (verificationError) {
      console.error(
        `Failed to send verification email to ${user.email}:`,
        verificationError
      );
      // Log the error, but the user is still created.
    }

    // Return the original user credential
    return userCredential;
  } catch (error) {
    const authError = error as AuthError;
    console.error("Signup Error:", authError.code, authError.message);

    // Task 1.3: Enhance Email/Password Signup Conflict Handling
    if (authError.code === "auth/email-already-in-use") {
      try {
        console.log(
          `Email ${email} already in use. Checking sign-in methods...`
        );
        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log(`Sign-in methods for ${email}:`, methods);
        if (methods.includes("google.com")) {
          throw new Error(
            "This email is linked to a Google account. Please sign in with Google."
          );
        } else if (methods.includes("password")) {
          // Should ideally not happen if createUser failed, but handle defensively
          throw new Error(
            "This email address is already registered. Please log in."
          );
        } else {
          // Fallback if methods are unexpected
          throw new Error("This email address is already in use.");
        }
      } catch (fetchError: unknown) {
        console.error("Error fetching sign-in methods:", fetchError);
        // Fallback to the original error message if fetching methods fails
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "an error occurred checking its status";
        throw new Error(`This email address is already in use or ${message}.`);
      }
    } else if (authError.code === "auth/weak-password") {
      throw new Error(
        "The password is too weak. Please choose a stronger password (at least 6 characters)."
      );
    } else if (authError.code === "auth/invalid-email") {
      throw new Error("Please enter a valid email address.");
    }
    // Re-throw a generic error or the specific one
    throw new Error(
      authError.message || "An unexpected error occurred during signup."
    );
  }
};

// Task 6.1: Add Resend Verification Email Handler
/**
 * Resends the verification email to the currently signed-in user, if any.
 * @returns {Promise<void>} Resolves on success.
 * @throws {Error} Throws error if no user is signed in, email is already verified, or sending fails.
 */
export const resendVerificationEmailHandler = async (): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("Resend Verification: No user is currently signed in.");
    throw new Error("No user logged in to resend verification for.");
  }

  if (currentUser.emailVerified) {
    console.log("Resend Verification: Email is already verified.");
    // Consider throwing an error or just returning successfully?
    // Throwing provides clearer feedback if the UI calls this unexpectedly.
    throw new Error("Your email is already verified.");
  }

  try {
    console.log(`Resending verification email to ${currentUser.email}...`);
    await sendEmailVerification(currentUser);
    console.log(
      `Verification email resent successfully to ${currentUser.email}.`
    );
  } catch (error) {
    const authError = error as AuthError;
    console.error(
      "Resend Verification Error:",
      authError.code,
      authError.message
    );
    // Handle specific errors like rate limiting
    if (authError.code === "auth/too-many-requests") {
      throw new Error(
        "Verification email resent too recently. Please wait before trying again."
      );
    }
    throw new Error(
      authError.message || "Failed to resend verification email."
    );
  }
};
