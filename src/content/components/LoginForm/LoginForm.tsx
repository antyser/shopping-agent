import React, { useState } from 'react';
import { useAuth } from '../../state/AuthProvider'; // Adjust path as needed
// import { chromeApi } from '../../services/chromeApi'; // Removed unused import

// Define props for the component
interface LoginFormProps {
    onNavigateToSignup: () => void; // Function to navigate to the signup view
}

const LoginForm: React.FC<LoginFormProps> = ({ onNavigateToSignup }) => {
    const { loginWithGoogle, loginWithEmail } = useAuth();
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
            await loginWithGoogle();
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

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#D8B4FE', marginBottom: '20px' }}>Login</h2> {/* Added margin */}

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                disabled={loading} // Disable while any operation is loading
                style={{
                    width: '100%',
                    padding: '10px',
                    background: 'white',
                    color: 'black',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginBottom: '10px'
                }}
            >
                {loading ? 'Loading...' : 'Sign in with Google'}
            </button>

            <p style={{ color: '#888', textAlign: 'center' }}>- OR -</p>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        boxSizing: 'border-box'
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        boxSizing: 'border-box'
                    }}
                />
                 {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#8B5CF6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    {loading ? 'Logging In...' : 'Sign In with Email'}
                </button>
            </form>

            {/* Navigation to Signup */}
            <button
                onClick={onNavigateToSignup}
                disabled={loading}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    padding: 0,
                    width: '100%',
                    textAlign: 'center'
                }}
            >
                Don't have an account? Sign Up
            </button>
        </div>
    );
}

export default LoginForm; 