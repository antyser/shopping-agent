import React, { useState } from 'react';
import { useAuth } from '../../state/AuthProvider';

interface SignupFormProps {
  onNavigateToLogin: () => void; // Function to navigate back to login
}

function SignupForm({ onNavigateToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { signupWithEmail } = useAuth();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    console.log("Signup attempt with:", { email, nickname });

    try {
      if (!signupWithEmail) {
          throw new Error("Signup function not available from AuthProvider.");
      }
      await signupWithEmail(email, password, nickname || null);
      console.log("Signup successful, verification email sent.");
      setMessage("Account created! Please check your email for a verification link.");
      onNavigateToLogin();
    } catch (err: any) {
        console.error("Signup failed:", err);
        setError(err.message || "Failed to create account.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
        />
        <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
        />
        <input
            type="text"
            placeholder="Nickname (Optional)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ marginBottom: '15px', width: '100%', padding: '8px' }}
        />
        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
        {message && <p style={{ color: 'green', fontSize: '14px', marginBottom: '10px' }}>{message}</p>}
        <button
            type="submit"
            disabled={loading || !!message}
            style={{
                width: '100%',
                marginBottom: '15px',
                padding: '10px',
                cursor: (loading || !!message) ? 'not-allowed' : 'pointer'
            }}
         >
             {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      {!message && (
          <button
              onClick={onNavigateToLogin}
              style={{
                  background: 'none',
                  border: 'none',
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  width: '100%',
                  textAlign: 'center'
              }}
              disabled={loading}
          >
            Already have an account? Log In
          </button>
      )}
       {message && (
          <button
              onClick={onNavigateToLogin}
              style={{
                  background: 'none',
                  border: 'none',
                  color: '#555',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '10px 0 0 0',
                  width: '100%',
                  textAlign: 'center'
              }}
          >
            Go to Login
          </button>
       )}
    </div>
  );
}

export default SignupForm; 