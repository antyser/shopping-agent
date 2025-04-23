import React, { PropsWithChildren } from 'react';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SidePanel: React.FC<PropsWithChildren<SidePanelProps>> = ({ isOpen, onClose, children }) => {
    // TODO: Replace inline styles with CSS Modules
    // TODO: Apply styles based on data-view attribute from parent
    return (
        <div
            style={{
                position: 'fixed', top: 0, right: 0, width: '33%', maxWidth: '450px', height: '100vh',
                background: '#1F2937', // Default background
                color: 'white', // Default text color
                zIndex: 9999,
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
                overflowY: 'auto',
                boxSizing: 'border-box'
            }}
            aria-hidden={!isOpen} // Accessibility
        >
            <button
                onClick={onClose}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'inherit', fontSize: '20px', cursor: 'pointer', zIndex: 10 }}
                aria-label="Close Panel"
            >
                &times;
            </button>
            <div style={{ padding: '20px' }}> {/* Inner container for padding */} 
                 {children}
            </div>
        </div>
    );
};

export default SidePanel; 