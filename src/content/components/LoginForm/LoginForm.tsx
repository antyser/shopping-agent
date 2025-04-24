import React, { useState } from 'react';
import { useAuth } from '../../state/AuthProvider'; // Adjust path as needed
// import { chromeApi } from '../../services/chromeApi'; // Removed unused import
import { Button } from '../../../components/ui/button'; // Import Shadcn Button
import { Input } from '../../../components/ui/input'; // Import Shadcn Input
import AuthHeader from '../AuthHeader/AuthHeader'; // Import the new header

// Define props for the component
interface LoginFormProps {
    onNavigateToSignup: () => void; // Function to navigate to the signup view
}

const LoginForm: React.FC<LoginFormProps> = ({ onNavigateToSignup }) => {
    const { signInWithGoogle, loginWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailLogin = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        setError(null); // Clear previous errors
        setLoading(true);

        try {
            await loginWithEmail(email, password);
            // On success, AuthProvider state updates via storage listener,
            // and AppContent will render the appropriate view (VerifyEmail or Insights)
            // No need to explicitly navigate here.
            console.log("Email login attempt successful (message sent).");
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || "Failed to log in.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true); // Show loading potentially, though Google flow is external
        try {
            await signInWithGoogle();
            // Success is handled by background/storage listener
        } catch (err: any) {
            console.error("Google login failed:", err);
            // Don't show "cancelled" errors prominently in the form
            if (err.message && !err.message.toLowerCase().includes('cancelled')) {
                setError(err.message || "Google Sign-In failed.");
            }
        } finally {
             // Reset loading state *if* the flow failed here (rare)
             // Typically loading stops when the main component re-renders due to state change
             setLoading(false);
        }
    }

    // Get the icon URL
    const iconUrl = chrome.runtime.getURL('assets/logo.png');

    return (
        <div className="p-5 flex flex-col items-center bg-white">
            {/* Use the reusable header component with all required props */}
            <AuthHeader 
              title="Welcome Back"
              subtitle="Sign in with your email"
              iconSrc={iconUrl} 
            />

            {/* Google Login Button - using Shadcn Button */}
            <Button
                variant="outline" // Style as an outline button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full mb-4" // Added margin bottom
            >
                {/* TODO: Add Google Icon */}
                {loading ? 'Loading...' : 'Sign in with Google'}
            </Button>

            <div className="relative w-full flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="w-full space-y-4">
                <Input // Use Shadcn Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <Input // Use Shadcn Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                 {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                
                <Button // Use Shadcn Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#8B5CF6] hover:bg-[#7c3aed]" // Example purple color
                >
                    {loading ? 'Logging In...' : 'Sign In with Email'}
                </Button>
            </form>

            {/* Navigation to Signup */}
            <Button
                variant="link" // Use link variant
                onClick={onNavigateToSignup}
                disabled={loading}
                className="w-full mt-4 text-sm text-secondary"
            >
                Don't have an account? <span className="text-blue-600 font-semibold">Sign Up</span>
            </Button>
        </div>
    );
}

export default LoginForm; 