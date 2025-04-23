import React from 'react';

interface FloatingActionButtonProps {
    onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
    // TODO: Replace inline styles with CSS Modules
    // TODO: Use the actual icon from assets
    return (
        <button
            onClick={onClick}
            style={{
                position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000,
                width: '50px', height: '50px', borderRadius: '50%', background: '#8B5CF6',
                color: 'white', border: 'none', fontSize: '24px', cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            aria-label="Toggle Shopping Agent Panel"
        >
            SA {/* Placeholder */} 
        </button>
    );
};

export default FloatingActionButton; 