import React from 'react';
import { useAuth } from '../../state/AuthProvider'; // Adjust path as needed
// import { useInsights } from '../../hooks/useInsights'; // TODO: Implement and use this hook

const InsightsView: React.FC = () => {
    // Get user info and logout function from auth context
    const { logout, userId, displayName, photoURL } = useAuth();
    // const { data: insightsData, loading, error } = useInsights(); // TODO
    
    // TODO: Replace inline styles/structure with proper elements and CSS modules

    // Determine the name to display
    const welcomeName = displayName || `User ${userId?.substring(0, 6) || '...'}`;

    return (
        <div style={{ padding: '20px' }}> {/* Added consistent padding */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' /* Increased margin */ }}>
                {/* User Info Section */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {photoURL && (
                        <img
                            src={photoURL}
                            alt="User Avatar"
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                marginRight: '10px',
                                border: '1px solid #ccc' // Optional border
                            }}
                        />
                    )}
                    {/* Display name or fallback */}
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal' }}>{welcomeName}</h3>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    style={{
                        background: '#777', // Slightly lighter grey
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px', // Adjusted padding
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px' // Added font size
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Insights Title (Optional, can be removed if name serves as title) */}
             <h2 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Insights</h2>

            {/* Existing Insights Placeholder */}
            {/* <p>Welcome User ID: {userId?.substring(0, 6)}...</p> Removed as name is shown above */}

            {/* TODO: Replace with loading/error/data display based on useInsights hook */}
            {/* {loading && <p>Loading insights...</p>} */}
            {/* {error && <p style={{ color: 'red' }}>Error: {error.message}</p>} */}
            {/* {insightsData && <p>Insights: {JSON.stringify(insightsData)}</p>} */}
            <p>Insights data will load here...</p>

        </div>
    );
}

export default InsightsView; 