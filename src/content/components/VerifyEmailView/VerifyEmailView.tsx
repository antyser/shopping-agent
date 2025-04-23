import React, { useState, useCallback } from 'react';
import { useAuth } from '../../state/AuthProvider'; // Adjust path as needed

// TODO: The chrome extension cannot auto login verification. Fix this later

const VerifyEmailView: React.FC = () => {
    const { logout, email, resendVerificationEmail } = useAuth();
    const [resendLoading, setResendLoading] = useState(false);
    const [resendError, setResendError] = useState<string | null>(null);
    const [resendSuccess, setResendSuccess] = useState<string | null>(null);

    // Use the email from context or a default message
    const userEmail = email || "your email address";

    const handleResendEmail = useCallback(async () => {
        setResendError(null);
        setResendSuccess(null);
        setResendLoading(true);
        console.log("Resend verification email clicked...");

        try {
            await resendVerificationEmail();
            setResendSuccess("Verification email sent successfully!");
            // Optionally disable button for a short period
            setTimeout(() => setResendSuccess(null), 5000); // Clear message after 5s
        } catch (err: any) {
            console.error("Resend failed:", err);
            setResendError(err.message || "Failed to resend email.");
        } finally {
            setResendLoading(false);
        }
    }, [resendVerificationEmail]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Verify Your Email</h2>
            <p style={{ marginBottom: '15px', lineHeight: '1.5' }}>
                A verification link has been sent to <br/>
                <strong>{userEmail}</strong>.
            </p>
            <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                Please check your inbox (and spam folder) and click the link to complete your registration.
            </p>
            <p style={{ marginBottom: '25px', fontSize: '14px', color: '#666' }}>
                Waiting for verification...
            </p>
            {/* Task 5.3: Add note about potential delays/manual refresh */}
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px', fontStyle: 'italic' }}>
                If you've clicked the link and the view hasn't updated, please try closing and reopening this panel, or logging out and back in.
            </p>

            {/* Feedback messages for resend action */}
            {resendError && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{resendError}</p>}
            {resendSuccess && <p style={{ color: 'green', fontSize: '14px', marginBottom: '10px' }}>{resendSuccess}</p>}

            <button
                onClick={handleResendEmail}
                disabled={resendLoading || !!resendSuccess} // Disable while loading or just succeeded
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    cursor: (resendLoading || !!resendSuccess) ? 'not-allowed' : 'pointer'
                    // Add other styles as needed
                }}
            >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <button
                onClick={logout}
                disabled={resendLoading} // Also disable logout while resending?
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    textDecoration: 'underline',
                    cursor: resendLoading ? 'not-allowed' : 'pointer',
                    padding: '10px 0 0 0'
                }}
            >
                Log Out
            </button>
        </div>
    );
}

export default VerifyEmailView;
