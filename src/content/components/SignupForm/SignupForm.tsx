import React, { useState } from 'react';
import { useAuth } from '../../state/AuthProvider';
import { Button } from '../Shared/Button';
import { Input } from '../Shared/Input';
import { Label } from '../Shared/Label';
import { GoogleSignInButton } from '../Shared/GoogleSignInButton';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import AuthHeader from '../AuthHeader/AuthHeader';

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
  const [showPassword, setShowPassword] = useState(false);

  const { signupWithEmail, signInWithGoogle } = useAuth();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
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

  const handleGoogleSignup = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);
    console.log("Attempting Google Sign-In / Sign-Up...");
    try {
      if (!signInWithGoogle) {
          throw new Error("Google Sign-In function not available from AuthProvider.");
      }
      await signInWithGoogle();
      console.log("Google Sign-In successful (or initiated).");
    } catch (err: any) {
        console.error("Google Sign-in failed:", err);
        setError(err.message || "Failed to sign in with Google.");
    } finally {
        setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const logoUrl = chrome.runtime.getURL('assets/logo.png');

  return (
    <div className="p-5 flex flex-col items-center bg-white space-y-6">
      <AuthHeader 
        title="Welcome"
        subtitle="Sign up with your email"
        iconSrc={logoUrl}
      />

      <form onSubmit={handleSignup} className="w-full space-y-6">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-[#140722] font-semibold text-base">
            Email <span className="text-[#EF4444]">*</span>
          </Label>
          <div className="relative flex items-center bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg shadow-sm">
            <Mail className="absolute left-3 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              className="pl-10 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-[#65686C] font-semibold text-base">
            Password <span className="text-[#EF4444]">*</span>
          </Label>
          <div className="relative flex items-center bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg shadow-sm">
            <Lock className="absolute left-3 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pl-10 pr-10 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <button 
              type="button" 
              onClick={togglePasswordVisibility} 
              className="absolute right-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="nickname" className="text-[#65686C] font-semibold text-base">
            Nickname (Optional)
          </Label>
          <div className="relative flex items-center bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg shadow-sm">
            <User className="absolute left-3 h-5 w-5 text-gray-400" />
            <Input
              id="nickname"
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
              className="pl-10 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        {message && (
          <p className="text-green-500 text-sm">{message}</p>
        )}
        
        <Button
          type="submit"
          disabled={loading || !!message}
          className="w-full h-9 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-sm font-medium font-sans"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      {!message && (
        <div className="relative flex py-2 items-center w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-xs font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      )}

      {!message && (
        <div className="w-full">
          <GoogleSignInButton onClick={handleGoogleSignup} disabled={loading} />
        </div>
      )}

      {!message && (
        <div className="text-center text-lg font-sans">
          <span className="text-[#65686C] font-normal">Already have an account? </span>
          <Button
            onClick={onNavigateToLogin}
            variant="link"
            className="p-0 h-auto text-lg text-[#8B5CF6] font-medium underline"
            disabled={loading}
          >
            Log In
          </Button>
        </div>
      )}
      
      {message && (
        <Button
          onClick={onNavigateToLogin}
          variant="link"
          className="w-full mt-4 text-sm text-slate-500"
        >
          Go to Login
        </Button>
      )}
    </div>
  );
}

export default SignupForm; 